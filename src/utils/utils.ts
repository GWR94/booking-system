export const camelToCapitalized = (str: string): string => {
  return (
    str
      // Insert a space before any uppercase letter that follows a lowercase letter or number
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      // Capitalize the first letter of the entire string
      .replace(/^./, (char: string) => char.toUpperCase())
  );
};
