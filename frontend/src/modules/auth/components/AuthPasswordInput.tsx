import { Icon, Field } from "@chakra-ui/react";
import { PasswordInput } from "@fe/components/ui/password-input";
import { useColorModeValue } from "@fe/components/ui/color-mode";
import React from "react";

interface AuthPasswordInputProps {
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  errors?: string[] | string | boolean | null;
  name?: string;
}

export function AuthPasswordInput({
  label,
  icon,
  placeholder = "••••••••",
  value,
  onChange,
  onKeyDown,
  errors,
  name,
}: AuthPasswordInputProps) {
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const iconColor = useColorModeValue("gray.400", "gray.500");

  let hasError = false;
  let errorList: string[] = [];

  if (typeof errors === "boolean") {
    hasError = errors;
  } else if (errors) {
    errorList = Array.isArray(errors) ? errors.filter(e => !!e) : [errors as string];
    hasError = errorList.length > 0;
  }

  return (
    <Field.Root required invalid={hasError}>

      <Field.Label color={labelColor} fontSize="sm" fontWeight="500">
        {label}
      </Field.Label>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {icon && (
          <div style={{ position: 'absolute', left: '16px', zIndex: 2, display: 'flex' }}>
            <Icon color={iconColor} boxSize="18px">{icon}</Icon>
          </div>
        )}
        
        <PasswordInput
          name={name}
          placeholder={placeholder}
          value={value}
          variant="auth"
          pl={icon ? "40px" : "16px"}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>
      {errorList.map((err, i) => (
        <Field.ErrorText key={i}>{err}</Field.ErrorText>
      ))}

    </Field.Root>
  );
}
