import { useState } from "react";
import { useParserByLink } from "@fe/modules/collection/components/ParseForm/hooks/useParserByLink";
import { useCheckLink } from "@fe/modules/collection/hooks/useCheckLink";
import { addProductDialog } from "@fe/modules/collection/components/AddProductDialog";

interface Props {
  refreshProducts: () => void;
}

interface HookOutput {
  productLink: string;
  setProductLink: (link: string) => void;
  isParsing: boolean;
  errorMessage: string;
  handleParse: () => Promise<void>;
}

export function useParseAndOpenDialog({ refreshProducts }: Props): HookOutput {
  const [productLink, setProductLink] = useState("");
  const { isLoading: isParsing, parse, errorMessage, setErrorMessage } = useParserByLink();
  const { checkLink } = useCheckLink();

  const handleParse = async () => {
    if (!productLink.trim()) return;

    if (!checkLink(productLink)) {
      setErrorMessage("Invalid link format");
      return;
    }

    try {
      const response = await parse(productLink);
      if (response) {
        addProductDialog.open("a", {
          productId: response.productId,
          parseResult: response.parsedResults,
          refreshProducts,
        });
      }
    } catch {
      // Error message is handled via errorMessage state and displayed in the UI
    }
  };

  return { productLink, setProductLink, isParsing, errorMessage, handleParse };
}
