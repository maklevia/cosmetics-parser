import { Circle } from "@chakra-ui/react";
import type { ComponentProps } from "react";

export function UnreadCircle(props: ComponentProps<typeof Circle>) {

  return (
    <Circle
      size="10px"
      bg={{ base: "brand.text", _dark: "brand.muted" }}
      position="absolute"
      top={0}
      right={0}
      {...props}
    />
  );
}
