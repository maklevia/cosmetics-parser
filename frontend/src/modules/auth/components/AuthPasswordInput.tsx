import { Box, Icon, Field } from "@chakra-ui/react";
import { PasswordInput } from "@fe/components/ui/password-input";
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

      <Field.Label color="gray.700" _dark={{ color: "gray.300" }} fontSize="sm" fontWeight="500">
        {label}
      </Field.Label>

      <Box position="relative" display="flex" alignItems="center" w="100%">
        {icon && (
          <Box position="absolute" left="16px" zIndex={2} display="flex">
            <Icon color="gray.400" _dark={{ color: "gray.500" }} boxSize="18px">{icon}</Icon>
          </Box>
        )}
        
        <PasswordInput
          name={name}
          placeholder={placeholder}
          value={value}
          variant="outline"
          pl={icon ? "40px" : "16px"}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </Box>
      {errorList.map((err, i) => (
        <Field.ErrorText key={i}>{err}</Field.ErrorText>
      ))}

    </Field.Root>
  );
}
