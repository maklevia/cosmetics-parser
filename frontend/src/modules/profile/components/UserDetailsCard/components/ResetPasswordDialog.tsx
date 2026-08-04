import { Button, Input, Stack } from "@chakra-ui/react";
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from "@fe/components/ui/dialog";
import { Field } from "@fe/components/ui/field";
import { useResetPassword } from "@fe/modules/profile/components/UserDetailsCard/hooks/useResetPassword";
import { useState } from "react";

export function ResetPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const { resetPassword, isLoading, error } = useResetPassword();

  const handleReset = async () => {
    try {
      await resetPassword(oldPassword, newPassword);
      setOpen(false);
      setOldPassword("");
      setNewPassword("");
    } catch {
      // Error is handled in hook
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button variant="outline">Reset Password</Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        
        <DialogBody>
          <Stack gap={4}>
            <Field label="Current Password" invalid={!!error} errorText={error}>
              <Input 
                type="password" 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Field>
            
            <Field label="New Password">
              <Input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Field>
          </Stack>
        </DialogBody>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            bg="#CEABB0" 
            color="white"
            _hover={{ bg: "#b59297" }}
            onClick={handleReset} 
            loading={isLoading}
            disabled={!oldPassword || !newPassword}
          >
            Update Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
