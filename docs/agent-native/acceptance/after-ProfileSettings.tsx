import { useState } from "react";
import { Card } from "@/components/nyc-tron/ui/components/Card";
import { Button } from "@/components/nyc-tron/ui/components/Button";
import { TextField } from "@/components/nyc-tron/ui/components/TextField";
import { Stack } from "@/components/nyc-tron/ui/components/layout/Stack";
import { Text } from "@/components/nyc-tron/ui/components/layout/Text";

export function ProfileSettings({ onSave }: { onSave?: (name: string) => Promise<void> | void }) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const tooLong = name.length > 40;

  const save = async () => {
    setSaving(true);
    try {
      await onSave?.(name.trim());
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack padding={4} gap={3}>
      <Card>
        <Stack gap={3} align="stretch">
          <Text variant="body">Profile settings</Text>
          <TextField
            id="display-name"
            label="Display name"
            helperText="Shown on your profile."
            errorText={tooLong ? "Use 40 characters or fewer." : undefined}
            value={name}
            onChangeText={setName}
          />
          <Button
            title="Save"
            variant="primary"
            loading={saving}
            disabled={name.trim().length === 0 || tooLong}
            onPress={save}
          />
        </Stack>
      </Card>
    </Stack>
  );
}
