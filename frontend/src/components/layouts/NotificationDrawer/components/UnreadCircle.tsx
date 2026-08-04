import { Circle } from "@chakra-ui/react";
import type { ComponentProps } from "react";
import { useColorModeValue } from "@fe/components/ui/color-mode";

export function UnreadCircle(props: ComponentProps<typeof Circle>) {
  const circleBg = useColorModeValue("rgb(156, 111, 111)", "rgba(210, 170, 162, 1)");

  return (
    <Circle
      size="10px"
      bg={circleBg}
      position="absolute"
      top={0}
      right={0}
      {...props}
    />
  );
}
