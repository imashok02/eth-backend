enum ImErrorCodes {
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
}

/*
 * Error format
 * Code    - This represents a category of errors.
 *           Ex - UNAUTHORIZED.
 * Message - This is a human readable message summarizing the issue for a code.
 *           Ex - JWT malformed, JWT invalid, etc
 * Details - This is an optional argument to give extra information.
 *           Ex - DTO validation can return an array of errors for every field which failed the validation.
 */
const toErrorMessage = (
  code: ImErrorCodes,
  message: string,
  details?: Record<string, string>[],
): Record<string, string | Record<string, string>[]> => {
  return {
    code,
    message,
    details: details || [],
  };
};

export { ImErrorCodes, toErrorMessage };
