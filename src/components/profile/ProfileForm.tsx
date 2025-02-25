
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  username: string | null;
  avatar_url: string | null;
}

interface ProfileFormProps {
  profile: Profile | null;
  onProfileUpdate: () => Promise<void>;
}

export function ProfileForm({ profile, onProfileUpdate }: ProfileFormProps) {
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      setAvatarFile(file);
    }
  };

  const uploadAvatar = async (userId: string) => {
    if (!avatarFile) return null;

    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleUpdateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      setIsUploading(true);

      let avatarUrl = profile?.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(user.id);
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          username,
          ...(avatarUrl && { avatar_url: avatarUrl }),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      await onProfileUpdate();
      setAvatarFile(null);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = () => {
    if (!profile) return "";
    return `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="bg-white/30 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative group">
          <Avatar className="h-20 w-20">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={`${profile.first_name}'s avatar`} />
            ) : (
              <AvatarFallback className="text-lg bg-slate-200">{getInitials()}</AvatarFallback>
            )}
          </Avatar>
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            Change
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            {profile?.first_name} {profile?.last_name}
          </h2>
          <p className="text-slate-500">@{profile?.username || "username"}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="max-w-sm"
            placeholder="Choose a username"
          />
        </div>
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="max-w-sm"
          />
        </div>
        {avatarFile && (
          <p className="text-sm text-slate-500">
            New avatar selected: {avatarFile.name}
          </p>
        )}
        <Button onClick={handleUpdateProfile} disabled={isUploading}>
          {isUploading ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </div>
  );
}
