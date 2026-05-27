export const RATE_LIMITS = {
  formSubmit: { max: 5, windowMs: 60_000 },
  authLogin: { max: 10, windowMs: 60_000 },
  authSignup: { max: 3, windowMs: 300_000 },
  explore: { max: 60, windowMs: 60_000 },
} as const;

export const FIELD_LIMITS = {
  maxFieldsPerForm: 50,
  maxOptionsPerField: 20,
  maxTextLength: 5000,
} as const;
