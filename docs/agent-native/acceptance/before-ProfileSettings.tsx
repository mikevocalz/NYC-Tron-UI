import { useState } from "react";
import { View } from "react-native";
import { Button } from "@nyc-tron/ui/components/Button";
import { Card } from "@nyc-tron/ui/components/Card";
import { TextField } from "@nyc-tron/ui/components/TextField";

// Requires the app's global.css (tailwindcss + uniwind + the theme tokens from
// docs/THEME_TOKENS.md) to be imported once at the app entry. See INSTALL.md.

export interface ProfileSettingsProps {
  initialDisplayName?: string;
  onSave: (displayName: string) => void;
}

export default function ProfileSettings({ initialDisplayName = "", onSave }: ProfileSettingsProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const trimmed = displayName.trim();
  const error = displayName.length > 0 && trimmed.length === 0 ? "Display name cannot be blank." : undefined;

  return (
    // Spacing comes from Tailwind classes backed by the app's theme (p-4, gap-4).
    <View className="flex-1 p-4">
      <Card>
        <View className="gap-4">
          <TextField
            id="profile-display-name"
            label="Display name"
            helperText="Shown on your profile."
            errorText={error}
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="done"
            onSubmitEditing={() => trimmed && onSave(trimmed)}
          />
          <Button
            title="Save"
            variant="primary"
            disabled={trimmed.length === 0}
            onPress={() => onSave(trimmed)}
          />
        </View>
      </Card>
    </View>
  );
}
