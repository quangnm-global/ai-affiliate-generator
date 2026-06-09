export class InsufficientCreditsError extends Error {
  readonly balance: number;

  constructor(balance = 0) {
    super(
      balance === 0
        ? "You have no credits left. Please top up to continue."
        : `Insufficient credits. You need 1 credit but have ${balance}.`
    );
    this.name = "InsufficientCreditsError";
    this.balance = balance;
  }
}

export class CreditsUpdateForbiddenError extends Error {
  constructor() {
    super("Direct credit updates are not allowed.");
    this.name = "CreditsUpdateForbiddenError";
  }
}

export function isInsufficientCreditsError(
  error: unknown
): error is InsufficientCreditsError {
  return (
    error instanceof InsufficientCreditsError ||
    (error instanceof Error && error.message.includes("INSUFFICIENT_CREDITS"))
  );
}

export function mapCreditRpcError(error: { message: string }): never {
  if (error.message.includes("INSUFFICIENT_CREDITS")) {
    throw new InsufficientCreditsError(0);
  }
  if (error.message.includes("USER_NOT_FOUND")) {
    throw new Error("User profile not found.");
  }
  if (error.message.includes("CREDITS_UPDATE_FORBIDDEN")) {
    throw new CreditsUpdateForbiddenError();
  }
  throw error;
}
