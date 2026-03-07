/**
 * Gera um identificador alfanumérico aleatório.
 *
 * @param length - Quantidade de caracteres
 * @param options - includeCapitalCharacters: inclui A-Z no charset
 */
export function generateId(
  length: number,
  options?: { includeCapitalCharacters?: boolean },
): string {
  let charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  if (options?.includeCapitalCharacters) {
    charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}
