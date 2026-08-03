import { Circle } from "@chakra-ui/react";
import { ComponentProps } from "react";

export function UnreadCircle(props: ComponentProps<typeof Circle>) {
  return (
    <Circle
      size="10px"
      bg="pink.400"
      position="absolute"
      top={0}
      right={0}
      {...props}
    />
  );
}
