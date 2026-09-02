export const EMAIL_REQUIRED = "validation.emailRequired";
export const EMAIL_INVALID = "validation.emailInvalid";
export const PASSWORD_REQUIRED = "validation.passwordRequired";
export const PASSWORD_SHORT = "validation.passwordShort";
export const NAME_REQUIRED = "validation.nameRequired";
export const PASSWORDS_DONT_MATCH = "validation.passwordsDontMatch";

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return EMAIL_REQUIRED;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value)) return EMAIL_INVALID;
  return null;
}

export function validatePasswordRequired(password: string): string | null {
  if (!password) return PASSWORD_REQUIRED;
  return null;
}

export function validateNewPassword(password: string): string | null {
  if (!password) return PASSWORD_REQUIRED;
  if (password.length < 6) return PASSWORD_SHORT;
  return null;
}

export function validateName(name: string): string | null {
  if (!name.trim()) return NAME_REQUIRED;
  return null;
}

export function validateConfirm(password: string, confirm: string): string | null {
  if (!confirm) return PASSWORD_REQUIRED;
  if (password !== confirm) return PASSWORDS_DONT_MATCH;
  return null;
}