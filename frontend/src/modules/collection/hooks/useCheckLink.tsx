export function useCheckLink() {
  const checkLink = (link: string): boolean => {
    // TODO: Implement actual domain or regex validation for supported stores
    return link.startsWith("http");
  };

  return { checkLink };
}
