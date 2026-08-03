import { Input, Icon, Field } from "@chakra-ui/react";
import { useColorModeValue } from "@fe/components/ui/color-mode";
import React from "react";

interface Props {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
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
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const hasError = !!error;

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
        <Input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          variant="auth"
          pl={icon ? "40px" : "16px"}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>
      {typeof error === "string" && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
}
