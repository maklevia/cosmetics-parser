import { Circle, CircleProps } from "@chakra-ui/react";

export function UnreadCircle(props: CircleProps) {
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
