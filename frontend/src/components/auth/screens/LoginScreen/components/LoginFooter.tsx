import { Heading, Link as LinkUI } from "@chakra-ui/react";
export default function LoginFooter() {
  return (
    <>
      <Heading size='md'>Do not have an account?</Heading>
      <LinkUI href="/signup">
        Sign Up
      </LinkUI>
    </>
  );
}
