import { Button, Image } from "@chakra-ui/react";
import { useAuth } from "@fe/modules/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useColorModeValue } from "@fe/components/ui/color-mode";

export function ProfileButton() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();

  const buttonColor = useColorModeValue("rgba(196, 159, 152, 1)", "rgb(156, 111, 111)");
  const buttonBgImage = useColorModeValue(
    "linear-gradient(white, white), radial-gradient(circle, white 0%, white 100%)",
    "linear-gradient(#1F1515, #1F1515), linear-gradient(rgb(156, 111, 111), rgb(156, 111, 111))"
  );
  const buttonHoverBgImage = useColorModeValue(
    "linear-gradient(#f9f5f4, #f9f5f4), radial-gradient(circle, #f9f5f4 0%, #f9f5f4 100%)",
    "linear-gradient(#2A1D1D, #2A1D1D), linear-gradient(rgb(156, 111, 111), rgb(156, 111, 111))"
  );
  const buttonHoverShadow = useColorModeValue(
    "0 4px 20px rgba(255, 255, 255, 0.4)",
    "0 4px 20px rgba(196, 159, 152, 0.35)"
  );

  if (isLoading) return null;

  let buttonText: string = 'Login';
  if (isAuthenticated) {
    buttonText = user?.name ? user.name : 'Profile'
  }

  const buttonRoute: string = isAuthenticated ? "/profile" : "/login";

  return (
    <Button
      onClick={() => navigate(buttonRoute)}
      variant="outline"
      borderRadius="full"
      border="1px solid transparent"
      color={buttonColor}
      bgImage={buttonBgImage}
      bgClip="padding-box, border-box"
      _hover={{
        bgImage: buttonHoverBgImage,
        transform: "translateY(-1px)",
        boxShadow: buttonHoverShadow,
      }}
      _active={{
        transform: "translateY(0)",
      }}
      transition="all 0.2s"
      size="md"
      fontWeight="500"
      px={4}
    >
        
      {isAuthenticated && (
        <Image 
          src="/profile.png" 
          alt="Profile"
          boxSize="20px" 
        />
      )}

      {buttonText}
    </Button>
  );
}
