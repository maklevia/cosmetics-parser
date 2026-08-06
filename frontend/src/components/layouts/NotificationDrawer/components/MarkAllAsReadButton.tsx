import { Button } from "@chakra-ui/react";
import { LuCheck } from "react-icons/lu";

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export function MarkAllAsReadButton({ onClick, disabled }: Props) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      colorPalette="gray"
      _hover={{ bg: "transparent", color: "fg.muted" }}
      display="flex"
      gap={1}
      alignItems="center"
    >
      <LuCheck size={16} />
      Read all
    </Button>
  );
}
