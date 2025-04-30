
import { Label } from "@/components/ui/label";

interface PasswordStrengthProps {
  score: number;
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
  };
}

export default function PasswordStrengthMeter({ score, requirements }: PasswordStrengthProps) {
  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-lime-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1 h-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-full w-full rounded-full transition-colors ${
              i < score ? getStrengthColor(score) : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <ul className="text-xs space-y-1 text-gray-500">
        <li className={requirements.minLength ? 'text-green-600' : ''}>
          ✓ At least 8 characters
        </li>
        <li className={requirements.hasUpperCase ? 'text-green-600' : ''}>
          ✓ One uppercase letter
        </li>
        <li className={requirements.hasNumber ? 'text-green-600' : ''}>
          ✓ One number
        </li>
        <li className={requirements.hasSymbol ? 'text-green-600' : ''}>
          ✓ One special character
        </li>
      </ul>
    </div>
  );
}

