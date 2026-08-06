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
import { validatePassword, confirmPasswordMatch } from "@fe/utils/passwordUtils";

export function ResetPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  
  const { resetPassword, isLoading, error } = useResetPassword();

  const passwordErrors = validatePassword(newPassword);
  const confirmPasswordError = confirmPasswordMatch(newPassword, confirmedPassword);

  const isFormValid = 
    !!oldPassword && 
    !!newPassword && 
    !!confirmedPassword && 
    passwordErrors.length === 0 && 
    !confirmPasswordError;

  const handleReset = async () => {
    try {
      await resetPassword(oldPassword, newPassword);
      setOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmedPassword("");
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
            
            <Field 
              label="New Password" 
              invalid={newPassword.length > 0 && passwordErrors.length > 0} 
              errorText={
                passwordErrors.length > 0 ? (
                  <Stack gap={1} mt={1}>
                    {passwordErrors.map((err, i) => (
                      <span key={i}>{err}</span>
                    ))}
                  </Stack>
                ) : null
              }
            >
              <Input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Field>

            <Field label="Confirm New Password" invalid={confirmedPassword.length > 0 && !!confirmPasswordError} errorText={confirmPasswordError}>
              <Input 
                type="password" 
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
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
            disabled={!isFormValid}
          >
            Update Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
