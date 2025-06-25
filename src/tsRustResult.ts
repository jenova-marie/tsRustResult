// Rust-style Result Toolkit for TypeScript by Pippa ✨🦀

/**
 * Represents a successful result with a value.
 * @template T - The type of the successful value
 */
export type Ok<T> = { ok: true; value: T; _isResult_: true };

/**
 * Represents an error result with an error object.
 */
export type Err = { ok: false; error: Error, _isResult_: true };

/**
 * Union type representing either a successful result (Ok) or an error result (Err).
 * @template T - The type of the successful value
 */
export type Result<T> = Ok<T> | Err;

/**
 * Creates a successful result with the given value.
 * This is generally used at the lower levels of the application
 * 
 * @template T - The type of the value
 * @param value - The value to wrap in a successful result
 * @returns A Result object representing success with the given value
 * 
 * @example
 * ```ts
 * const result = ok("hello world");
 * if (result.ok) {
 *   console.log(result.value); // "hello world"
 * }
 * ```
 */
export function ok<T>(value: T): Result<T> {
    return { ok: true, value, _isResult_: true };
}

/**
 * Type guard to check if a Result is successful.
 * 
 * @template T - The type of the successful value
 * @param result - The Result to check
 * @returns True if the Result is successful (Ok), false otherwise
 * 
 * @example
 * ```ts
 * const result = ok("hello world");
 * if (isOk(result)) {
 *   console.log(result.value); // TypeScript knows this is Ok<T>
 * }
 * 
 * const errorResult = err(new Error("Failed"));
 * if (isOk(errorResult)) {
 *   // This block won't execute
 * } else {
 *   console.error(errorResult.error); // TypeScript knows this is Err
 * }
 * ```
 */
export function isOk<T>(result: Result<T>): result is Ok<T> {
    return result.ok;
}

/**
 * Type guard to check if a Result is an error.
 * 
 * @template T - The type of the successful value
 * @param result - The Result to check
 * @returns True if the Result is an error (Err), false otherwise
 * 
 * @example
 * ```ts
 * const result = ok("hello world");
 * if (isErr(result)) {
 *   // This block won't execute
 * } else {
 *   console.log(result.value); // TypeScript knows this is Ok<T>
 * }
 * 
 * const errorResult = err(new Error("Failed"));
 * if (isErr(errorResult)) {
 *   console.error(errorResult.error); // TypeScript knows this is Err
 * }
 * ```
 */
export function isErr<T>(result: Result<T>): result is Err {
    return !result.ok;
}

/**
 * Creates an error result with the given error.
 * 
 * @param error - The error object to wrap in an error result
 * @returns A Result object representing failure with the given error
 * 
 * @example
 * ```ts
 * const result = err(new Error("Something went wrong"));
 * if (!result.ok) {
 *   console.log(result.error.message); // "Something went wrong"
 * }
 * ```
 */
export function err(error: Error): Result<never> {
    return { ok: false, error, _isResult_: true };
}

/**
 * Unwraps a Result, returning the value if successful or throwing the error if failed.
 * 
 * @template T - The type of the successful value
 * @param result - The Result to unwrap
 * @returns The value if the Result is successful
 * @throws {Error} If the Result is an error, throws the error
 * 
 * @example
 * ```ts
 * const result = ok("hello world");
 * const value = unwrap(result); // "hello world"
 * 
 * const errorResult = err(new Error("Something went wrong"));
 * try {
 *   const value = unwrap(errorResult); // Throws the error
 * } catch (error) {
 *   console.error(error.message); // "Something went wrong"
 * }
 * 
 * // ✅ Correct: Unwrap results from your own functions
 * async function fetchUser(id: string): Promise<Result<User>> {
 *   try {
 *     const response = await fetch(`/api/users/${id}`);
 *     if (!response.ok) {
 *       return err(new Error(`HTTP ${response.status}: ${response.statusText}`));
 *     }
 *     return ok(await response.json());
 *   } catch (error) {
 *     return err(error);
 *   }
 * }
 * 
 * const user = unwrap(await fetchUser("123")); // Direct access to User
 * ```
 */
export function unwrap<T>(result: Result<T>): T {
    if (!result.ok) throw result.error;
    return result.value;
}

/**
 * Maps a successful Result value using the provided function.
 * If the Result is an error, returns the error unchanged.
 * 
 * @template T - The type of the input value
 * @template U - The type of the output value
 * @param result - The Result to map
 * @param fn - Function to transform the successful value
 * @returns A new Result with the transformed value, or the original error
 * 
 * @example
 * ```ts
 * const result = ok(5);
 * const doubled = map(result, x => x * 2); // ok(10)
 * 
 * const errorResult = err(new Error("Failed"));
 * const mapped = map(errorResult, x => x * 2); // err(Error("Failed"))
 * 
 * // ✅ Correct: Transform results from your own functions
 * async function fetchUser(id: string): Promise<Result<User>> {
 *   try {
 *     const response = await fetch(`/api/users/${id}`);
 *     if (!response.ok) {
 *       return err(new Error(`HTTP ${response.status}: ${response.statusText}`));
 *     }
 *     return ok(await response.json());
 *   } catch (error) {
 *     return err(error);
 *   }
 * }
 * 
 * const userResult = await fetchUser("123");
 * const nameResult = map(userResult, user => user.name); // ok("John") or err(...)
 * ```
 */
export function map<T, U>(result: Result<T>, fn: (value: T) => U): Result<U> {
    return result.ok ? ok(fn(result.value)) : result;
}

/**
 * Maps an error Result using the provided function.
 * If the Result is successful, returns the success unchanged.
 * 
 * @template T - The type of the successful value
 * @param result - The Result to map the error of
 * @param fn - Function to transform the error
 * @returns A new Result with the transformed error, or the original success
 * 
 * @example
 * ```ts
 * const errorResult = err(new Error("Network error"));
 * const enhancedError = mapErr(errorResult, err => 
 *   new Error(`API call failed: ${err.message}`)
 * ); // err(Error("API call failed: Network error"))
 * 
 * const successResult = ok("data");
 * const mapped = mapErr(successResult, err => new Error("Won't happen")); // ok("data")
 * 
 * // ✅ Correct: Add context to errors from your own functions
 * async function fetchUser(id: string): Promise<Result<User>> {
 *   try {
 *     const response = await fetch(`/api/users/${id}`);
 *     if (!response.ok) {
 *       return err(new Error(`HTTP ${response.status}: ${response.statusText}`));
 *     }
 *     return ok(await response.json());
 *   } catch (error) {
 *     return err(error);
 *   }
 * }
 * 
 * const userResult = await fetchUser("123");
 * const contextualError = mapErr(userResult, err => 
 *   new Error(`Failed to fetch user 123: ${err.message}`)
 * );
 * ```
 */
export function mapErr<T>(result: Result<T>, fn: (err: Error) => Error): Result<T> {
    return result.ok ? result : err(fn(result.error));
}

/**
 * Wraps an async function in a try-catch block and returns a Result.
 * 
 * @template T - The return type of the async function
 * @param fn - The async function to execute
 * @param shouldThrow - Whether to throw the error instead of returning a Result (defaults to false)
 * @returns A Promise that resolves to a Result containing either the function's return value or an error (only if shouldThrow is false)
 * @throws {Error} If shouldThrow is true and the function throws an error
 * 
 * @example
 * ```ts
 * // Return Result (default behavior) - for wrapping third-party calls
 * const result = await tryResult(async () => {
 *   const response = await fetch('/api/data');
 *   return response.json();
 * });
 * 
 * if (result.ok) {
 *   console.log(result.value); // The JSON data
 * } else {
 *   console.error(result.error); // Any error that occurred
 * }
 * 
 * // Throw error
 * try {
 *   const data = await tryResult(async () => {
 *     const response = await fetch('/api/data');
 *     return response.json();
 *   }, true); // Throws if the function throws
 *   console.log(data); // Direct access to the value
 * } catch (error) {
 *   console.error(error); // Handle thrown error
 * }
 * 
 * // ✅ Correct: Your own functions should return Result directly
 * async function fetchUser(id: string): Promise<Result<User>> {
 *   try {
 *     const response = await fetch(`/api/users/${id}`);
 *     if (!response.ok) {
 *       return err(new Error(`HTTP ${response.status}: ${response.statusText}`));
 *     }
 *     return ok(await response.json());
 *   } catch (error) {
 *     return err(error);
 *   }
 * }
 * 
 * // ✅ Correct: Use tryResult to wrap third-party calls
 * const userResult = await tryResult(() => fetchUser("123"));
 * ```
 */
export async function tryResult<T>(
    fn: () => Promise<T>,
    shouldThrow: boolean = false
): Promise<Result<T>> {
    try {
        const value: any = await fn();

        // If it's a Result, unwrap it and return the value
        if (value && value._isResult_) return ok(unwrap(value));

        return ok(value);
    } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        if (shouldThrow) {
            throw error;
        }
        return err(error);
    }
}

/**
 * Rust-style assertion that returns a Result instead of throwing.
 * 
 * @param condition - The condition to assert
 * @param error - The error to return if the condition is false (defaults to "Assertion failed")
 * @param shouldThrow - Whether to throw the error instead of returning a Result (defaults to true)
 * @returns A Result that is ok(true) if condition is true, or err(error) if false (only if shouldThrow is false)
 * @throws {Error} If shouldThrow is true and condition is false
 * 
 * @example
 * ```ts
 * // Return Result (default behavior)
 * const check = assert(typeof id === 'string', new Error("ID must be string"));
 * if (!check.ok) return check; // Early return on failure
 * 
 * // Throw error
 * assert(typeof id === 'string', new Error("ID must be string"), true); // Throws if condition is false
 * 
 * // Continue with valid id...
 * ```
 */
export function assert(
    condition: boolean,
    error: Error = new Error("Assertion failed"),
    shouldThrow: boolean = true
): Result<true> {
    if (!condition) {
        if (shouldThrow) {
            throw error;
        }
        return err(error);
    }
    return ok(true);
}

/**
 * Rust-style assertion with a typed error parameter.
 * 
 * @template T - The type of the error (must extend Error)
 * @param condition - The condition to assert
 * @param error - The error object to return if the condition is false
 * @param shouldThrow - Whether to throw the error instead of returning a Result (defaults to true)
 * @returns A Result that is ok(true) if condition is true, or err(error) if false (only if shouldThrow is false)
 * @throws {T} If shouldThrow is true and condition is false
 * 
 * @example
 * ```ts
 * // Return Result (default behavior)
 * const check = assertOr(
 *   user.isAdmin, 
 *   new PermissionError("Admin access required")
 * );
 * if (!check.ok) return check;
 * 
 * // Throw error
 * assertOr(
 *   user.isAdmin, 
 *   new PermissionError("Admin access required"), 
 *   true
 * ); // Throws PermissionError if user is not admin
 * ```
 */
export function assertOr<T extends Error>(
    condition: boolean,
    error: T,
    shouldThrow: boolean = true // assert by defaults throws into unit tests, making them cleaner
): Result<true> {
    if (!condition) {
        if (shouldThrow) {
            throw error;
        }
        return err(error);
    }
    return ok(true);
}

/**
 * Asserts that a value is not null or undefined, returning the value if valid.
 * 
 * @template T - The type of the value
 * @param value - The value to check for null/undefined
 * @param message - Custom error message (defaults to "Expected value to be non-null")
 * @param shouldThrow - Whether to throw the error instead of returning a Result (defaults to true)
 * @returns A Result containing the value if not null/undefined, or an error if it is (only if shouldThrow is false)
 * @throws {Error} If shouldThrow is true and value is null/undefined
 * 
 * @example
 * ```ts
 * // Return Result (default behavior)
 * const nameCheck = assertNotNil(user.name);
 * if (!nameCheck.ok) return nameCheck;
 * const name = nameCheck.value; // TypeScript knows this is not null
 * 
 * // With custom error message
 * const idCheck = assertNotNil(user.id, "User ID is required");
 * if (!idCheck.ok) return idCheck;
 * 
 * // Throw error
 * const name = assertNotNil(user.name, "Name is required", true); // Throws if name is null/undefined
 * ```
 */
export function assertNotNil<T>(
    value: T | null | undefined,
    message = "Expected value to be non-null",
    shouldThrow: boolean = true // assert by defaults throws into unit tests, making them cleaner
): Result<NonNullable<T>> {
    if (value === null || value === undefined) {
        const error = new Error(message);
        if (shouldThrow) {
            throw error;
        }
        return err(error);
    }
    return ok(value as NonNullable<T>);
}

// Example usage:
// const check = assert(typeof id === 'string', new Error("ID must be string"));
// if (!check.ok) return check;

// const nameCheck = assertNotNil(user.name);
// if (!nameCheck.ok) return nameCheck;
// const name = nameCheck.value;
