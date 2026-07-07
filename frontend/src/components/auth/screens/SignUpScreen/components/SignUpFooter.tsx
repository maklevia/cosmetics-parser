import { Heading, Link as LinkUI } from '@chakra-ui/react'

export default function SignUpFooter() {
  return (
    <>
      <Heading size='md'>Already have an account?</Heading>
      
      <LinkUI href="/login">
        Sign In
      </LinkUI>
    </>
  );
}
