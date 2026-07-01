import { Link as LinkUI } from '@chakra-ui/react'

export default function SignUpFooter() {
  return (
    <>
      <h2>Already have an account?</h2>
      <LinkUI href="/login">
        Sign In
      </LinkUI>
    </>
  );
}
