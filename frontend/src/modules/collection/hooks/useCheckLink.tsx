export function useCheckLink() {
  const checkLink = (link: string): boolean => {
    try {
      const url = new URL(link);
      const path = url.pathname;

      if (url.hostname.endsWith("makeup.com.ua") && /\/product\/\d+/.test(path)) {
        return true;
      }
      if (url.hostname.endsWith("eva.ua") && /\/pr\d+/.test(path)) {
        return true;
      }
      if (url.hostname.endsWith("notino.ua") && path.split("/").filter(Boolean).length >= 2) {
        return true;
      }
      
      return false;
    } catch {
      return false; // Invalid URL format
    }
  };

  return { checkLink };
}
