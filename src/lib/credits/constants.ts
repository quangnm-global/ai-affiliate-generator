/** Every generation costs exactly 1 credit */
export const GENERATION_CREDIT_COST = 1;

/** Credits granted to new users on signup */
export const SIGNUP_BONUS_CREDITS = 5;

/** Minimum credits required to start a generation */
export const MIN_CREDITS_TO_GENERATE = 1;

export const CREDIT_REASONS = {
  SIGNUP_BONUS: "signup_bonus",
  GENERATION: "generation",
  REFUND: "refund",
  ADMIN_GRANT: "admin_grant",
} as const;

export type CreditReason =
  (typeof CREDIT_REASONS)[keyof typeof CREDIT_REASONS];
