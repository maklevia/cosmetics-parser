import { Link as LinkUI } from "@chakra-ui/react";
export default function LoginFooter() {
  return (
    <>
      <h2>Do not have an account?</h2>
      <LinkUI href="/signup">
        Sign Up
      </LinkUI>
    </>
  );
}
