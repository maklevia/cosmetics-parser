import { Button, type ButtonProps } from "@chakra-ui/react";
import React from "react";

interface AuthButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function AuthButton({ children, ...props }: AuthButtonProps) {
  return (
    <Button
      type="submit"
      w="100%"
      py={5}
      bgGradient="to-r"
      gradientFrom="rgba(196, 159, 152, 1)"
      gradientTo="rgba(181, 130, 120, 1)"
      color="white"
      fontWeight="600"
      fontSize="md"
      textTransform="uppercase"
      letterSpacing="wider"
      borderRadius="lg"
      _hover={{
        bgGradient: "to-r",
        gradientFrom: "rgba(210, 170, 162, 1)",
        gradientTo: "rgba(196, 145, 135, 1)",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 20px rgba(196, 159, 152, 0.35)",
      }}
      _active={{
        transform: "translateY(0)",
      }}
      transition="all 0.2s"
      {...props}
    >
      {children}
    </Button>
  );
}
