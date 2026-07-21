/** Lower-cased domain portion of an email address, or "" if malformed. */
export function getEmailDomain(email: string): string {
  const at = email.lastIndexOf("@");
  if (at === -1 || at === email.length - 1) return "";
  return email.slice(at + 1).trim().toLowerCase();
}
