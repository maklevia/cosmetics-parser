import { Box, Input, Icon, Field } from "@chakra-ui/react";
import React from "react";

interface Props {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string | boolean | null;
  name?: string;
}

export function AuthInput({
  label,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyDown,
  error,
  name,
}: Props) {
  const hasError = !!error;

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
        <Input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          variant="outline"
          pl={icon ? "40px" : "16px"}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </Box>
      {typeof error === "string" && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
}
