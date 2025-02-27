
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DomainPicklist } from "../DomainPicklist";
import { SocialPicklist } from "../SocialPicklist";

interface EditableProjectDetailsProps {
  name: string;
  description: string;
  url: string;
  selectedDomainIds: string[];
  selectedSocialIds: string[];
  onDomainSelect: (domainId: string) => void;
  onSocialSelect: (socialId: string) => void;
  onSave: (details: { name: string; description: string; url: string }) => void;
  onCancel: () => void;
}

export function EditableProjectDetails({
  name: initialName,
  description: initialDescription,
  url: initialUrl,
  selectedDomainIds,
  selectedSocialIds,
  onDomainSelect,
  onSocialSelect,
  onSave,
  onCancel,
}: EditableProjectDetailsProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [url, setUrl] = useState(initialUrl);

  const handleSave = () => {
    onSave({
      name: name.trim(),
      description: description.trim(),
      url: url.trim(),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="url">Project URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-1"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
      <Separator className="my-4" />
      <DomainPicklist
        selectedDomainIds={selectedDomainIds}
        onSelect={onDomainSelect}
        className="mb-4"
      />
      <SocialPicklist
        selectedAccountIds={selectedSocialIds}
        onSelect={onSocialSelect}
      />
    </div>
  );
}
