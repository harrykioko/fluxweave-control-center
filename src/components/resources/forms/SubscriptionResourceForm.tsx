
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SubscriptionResourceFormProps {
  price: string;
  frequency: string;
  username: string;
  password: string;
  onPriceChange: (value: string) => void;
  onFrequencyChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export function SubscriptionResourceForm({
  price,
  frequency,
  username,
  password,
  onPriceChange,
  onFrequencyChange,
  onUsernameChange,
  onPasswordChange,
}: SubscriptionResourceFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="Free, $9.99/month, $99/year"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <Input
          id="frequency"
          value={frequency}
          onChange={(e) => onFrequencyChange(e.target.value)}
          placeholder="Daily, Weekly, Monthly"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Account username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Account password"
        />
      </div>
    </>
  );
}
