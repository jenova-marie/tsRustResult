# RustResult ✨🦀

A lightweight, zero-dependency TypeScript library that brings Rust's `Result` type to your JavaScript/TypeScript projects. Handle errors gracefully with type safety and functional programming patterns.

## Why RustResult Exists

Error handling in JavaScript and TypeScript is fundamentally broken. Here's what we're dealing with:

### The Problem with Traditional Error Handling

1. **Inconsistent Error Handling**: Some functions throw exceptions, others return `null`/`undefined`, and others return error objects. There's no standard way to handle failures.

2. **Type Safety Issues**: TypeScript can't guarantee that you've handled all error cases. A function might return `User | null`, but TypeScript won't force you to check for `null`.

3. **Error Propagation Hell**: You end up with deeply nested try-catch blocks or error checking at every level of your call stack.

4. **Lost Context**: When errors bubble up through multiple layers, you lose the original context and stack trace information.

5. **Unpredictable Control Flow**: Exceptions can be thrown from anywhere, making it hard to reason about your code's execution path.

### What RustResult Accomplishes

RustResult provides a **consistent, type-safe, and ergonomic** way to handle errors by treating them as values rather than exceptions. This approach:

- **Eliminates the guesswork** of whether a function might fail
- **Forces explicit error handling** through TypeScript's type system
- **Preserves error context** throughout your call chain
- **Makes control flow predictable** and easy to follow
- **Enables functional programming patterns** for error transformation and composition

### Real-World Impact

Instead of this error-prone pattern:
```typescript
// ❌ Traditional approach - error-prone and verbose
function getUser(id: string) {
    try {
        const user = database.findUser(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (error) {
        // What kind of error? Database error? Network error? Validation error?
        throw new Error(`Failed to get user: ${error.message}`);
    }
}

// Usage - must remember to handle exceptions
try {
    const user = getUser("123");
    // Do something with user
} catch (error) {
    // Handle error... somehow
}
```

You get this clean, type-safe approach:
```typescript
// ✅ RustResult approach - explicit and safe
function getUser(id: string): Result<User> {
    const user = database.findUser(id);
    return user ? ok(user) : err(new Error("User not found"));
}

// Usage - TypeScript forces you to handle both cases
const userResult = getUser("123");
if (userResult.ok) {
    // TypeScript knows userResult.value is User
    console.log(userResult.value.name);
} else {
    // TypeScript knows userResult.error is Error
    console.error(userResult.error.message);
}
```

## Features

- 🦀 **Rust-style Result types** - `Ok<T>` and `Err` with full TypeScript support
- 🛡️ **Type-safe error handling** - No more throwing exceptions everywhere
- 🔧 **Functional utilities** - `map`, `mapErr`, `unwrap`, and more
- ⚡ **Async support** - `tryResult` for wrapping async operations
- 🧪 **Assertion helpers** - `assert`, `assertOr`, `assertNotNil` with Result returns
- 📦 **Zero dependencies** - Lightweight and tree-shakeable
- 🎯 **TypeScript-first** - Full type safety and IntelliSense support

## Benefits

### For Developers
- **Better Developer Experience**: IntelliSense and TypeScript will guide you to handle all error cases
- **Reduced Cognitive Load**: No more wondering "what if this fails?" - the type system tells you
- **Cleaner Code**: Eliminate deeply nested try-catch blocks and error checking
- **Functional Programming**: Chain operations with `map`, `mapErr`, and other functional utilities

### For Teams
- **Consistent Error Handling**: Everyone on your team handles errors the same way
- **Better Code Reviews**: Error handling is explicit and visible in the type signatures
- **Easier Testing**: Results are just values - easy to test success and failure cases
- **Reduced Bugs**: TypeScript prevents you from forgetting to handle error cases

### For Applications
- **Better User Experience**: Graceful error handling without crashes
- **Improved Debugging**: Rich error context preserved throughout the call chain
- **Performance**: No exception throwing overhead in the happy path
- **Maintainability**: Clear separation between success and error logic

## Installation

```bash
npm install ts-rust-result
# or
yarn add ts-rust-result
# or
pnpm add ts-rust-result
```

## Quick Start

```typescript
import { ok, err, Result, tryResult, unwrap } from 'ts-rust-result';

// Basic usage
function divide(a: number, b: number): Result<number> {
    if (b === 0) {
        return err(new Error("Division by zero"));
    }
    return ok(a / b);
}

// Handle results
const result = divide(10, 2);
if (result.ok) {
    console.log(result.value); // 5
} else {
    console.error(result.error.message); // Won't execute
}

// Async operations
const dataResult = await tryResult(async () => {
    const response = await fetch('/api/data');
    return response.json();
});

if (dataResult.ok) {
    console.log(dataResult.value);
} else {
    console.error('API call failed:', dataResult.error);
}
```

## API Reference

### Core Types

```typescript
type Ok<T> = { ok: true; value: T };
type Err = { ok: false; error: Error };
type Result<T> = Ok<T> | Err;
```

### Core Functions

#### `ok<T>(value: T): Result<T>`
Creates a successful result.

```typescript
const result = ok("hello world");
// { ok: true, value: "hello world" }
```

#### `err(error: Error): Result<never>`
Creates an error result.

```typescript
const result = err(new Error("Something went wrong"));
// { ok: false, error: Error }
```

#### `isOk<T>(result: Result<T>): result is Ok<T>`
Type guard to check if a result is successful.

```typescript
const result = ok("hello");
if (isOk(result)) {
    console.log(result.value); // TypeScript knows this is Ok<string>
}
```

#### `isErr<T>(result: Result<T>): result is Err`
Type guard to check if a result is an error.

```typescript
const result = err(new Error("Failed"));
if (isErr(result)) {
    console.error(result.error.message); // TypeScript knows this is Err
}
```

### Utility Functions

#### `unwrap<T>(result: Result<T>): T`
Unwraps a result, throwing the error if it's an error.

```typescript
const result = ok(42);
const value = unwrap(result); // 42

const errorResult = err(new Error("Failed"));
const value = unwrap(errorResult); // Throws the error
```

#### `map<T, U>(result: Result<T>, fn: (value: T) => U): Result<U>`
Maps a successful result value using the provided function.

```typescript
const result = ok(5);
const doubled = map(result, x => x * 2); // ok(10)

const userResult = ok({ id: 1, name: "John" });
const nameResult = map(userResult, user => user.name); // ok("John")
```

#### `mapErr<T>(result: Result<T>, fn: (err: Error) => Error): Result<T>`
Maps an error result using the provided function.

```typescript
const errorResult = err(new Error("Network error"));
const enhancedError = mapErr(errorResult, err => 
    new Error(`API call failed: ${err.message}`)
); // err(Error("API call failed: Network error"))
```

### Async Support

#### `tryResult<T>(fn: () => Promise<T>, shouldThrow?: boolean): Promise<Result<T>>`
Wraps an async function in a try-catch block and returns a Result.

```typescript
// Return Result (default behavior)
const result = await tryResult(async () => {
    const response = await fetch('/api/data');
    return response.json();
});

if (result.ok) {
    console.log(result.value); // The JSON data
} else {
    console.error(result.error); // Any error that occurred
}

// Throw error
try {
    const data = await tryResult(async () => {
        const response = await fetch('/api/data');
        return response.json();
    }, true); // Throws if the function throws
    console.log(data); // Direct access to the value
} catch (error) {
    console.error(error); // Handle thrown error
}
```

### Assertion Helpers

#### `assert(condition: boolean, error?: Error, shouldThrow?: boolean): Result<true>`
Rust-style assertion that returns a Result instead of throwing.

```typescript
// Return Result (default behavior)
const check = assert(typeof id === 'string', new Error("ID must be string"));
if (!check.ok) return check; // Early return on failure

// Throw error
assert(typeof id === 'string', new Error("ID must be string"), true); // Throws if condition is false
```

#### `assertOr<T extends Error>(condition: boolean, error: T, shouldThrow?: boolean): Result<true>`
Rust-style assertion with a typed error parameter.

```typescript
class PermissionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PermissionError';
    }
}

// Return Result (default behavior)
const check = assertOr(
    user.isAdmin, 
    new PermissionError("Admin access required")
);
if (!check.ok) return check;

// Throw error
assertOr(
    user.isAdmin, 
    new PermissionError("Admin access required"), 
    true
); // Throws PermissionError if user is not admin
```

#### `assertNotNil<T>(value: T | null | undefined, message?: string, shouldThrow?: boolean): Result<NonNullable<T>>`
Asserts that a value is not null or undefined, returning the value if valid.

```typescript
// Return Result (default behavior)
const nameCheck = assertNotNil(user.name);
if (!nameCheck.ok) return nameCheck;
const name = nameCheck.value; // TypeScript knows this is not null

// With custom error message
const idCheck = assertNotNil(user.id, "User ID is required");
if (!idCheck.ok) return idCheck;

// Throw error
const name = assertNotNil(user.name, "Name is required", true); // Throws if name is null/undefined
```

## Real-World Examples

### API Service Layer

```typescript
import { ok, err, Result, tryResult, map } from 'ts-rust-result';

interface User {
    id: string;
    name: string;
    email: string;
}

class UserService {
    async getUser(id: string): Promise<Result<User>> {
        return await tryResult(async () => {
            const response = await fetch(`/api/users/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        });
    }

    async getUserName(id: string): Promise<Result<string>> {
        const userResult = await this.getUser(id);
        return map(userResult, user => user.name);
    }
}

// Usage
const userService = new UserService();

const userNameResult = await userService.getUserName("123");
if (userNameResult.ok) {
    console.log("User name:", userNameResult.value);
} else {
    console.error("Failed to get user name:", userNameResult.error.message);
}
```

### Validation Layer

```typescript
import { ok, err, Result, assert, assertNotNil } from 'ts-rust-result';

interface CreateUserRequest {
    name?: string;
    email?: string;
    age?: number;
}

function validateUserRequest(data: CreateUserRequest): Result<ValidatedUser> {
    // Check required fields
    const nameCheck = assertNotNil(data.name, "Name is required");
    if (!nameCheck.ok) return nameCheck;

    const emailCheck = assertNotNil(data.email, "Email is required");
    if (!emailCheck.ok) return emailCheck;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = assert(emailRegex.test(data.email), new Error("Invalid email format"));
    if (!emailValid.ok) return emailValid;

    // Validate age
    if (data.age !== undefined) {
        const ageValid = assert(data.age >= 0 && data.age <= 120, new Error("Age must be between 0 and 120"));
        if (!ageValid.ok) return ageValid;
    }

    return ok({
        name: data.name,
        email: data.email,
        age: data.age
    });
}

// Usage
const request = { name: "John", email: "john@example.com", age: 25 };
const validation = validateUserRequest(request);

if (validation.ok) {
    console.log("Valid user:", validation.value);
} else {
    console.error("Validation failed:", validation.error.message);
}
```

### Database Operations

```typescript
import { ok, err, Result, tryResult, mapErr } from 'ts-rust-result';

class DatabaseService {
    async findUser(id: string): Promise<Result<User>> {
        return await tryResult(async () => {
            const user = await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
            if (!user) {
                throw new Error(`User with id ${id} not found`);
            }
            return user;
        });
    }

    async createUser(userData: CreateUserData): Promise<Result<User>> {
        return await tryResult(async () => {
            const result = await this.db.query(
                'INSERT INTO users (name, email) VALUES (?, ?)',
                [userData.name, userData.email]
            );
            return { id: result.insertId, ...userData };
        });
    }

    async updateUser(id: string, updates: Partial<User>): Promise<Result<User>> {
        const userResult = await this.findUser(id);
        if (!userResult.ok) {
            return mapErr(userResult, err => new Error(`Cannot update user: ${err.message}`));
        }

        return await tryResult(async () => {
            const result = await this.db.query(
                'UPDATE users SET ? WHERE id = ?',
                [updates, id]
            );
            return { ...userResult.value, ...updates };
        });
    }
}
```

## Migration Guide

### From Traditional Error Handling

**Before (Traditional):**
```typescript
function processUser(id: string) {
    try {
        const user = getUser(id);
        if (!user) {
            throw new Error("User not found");
        }
        
        const processed = processUserData(user);
        if (!processed) {
            throw new Error("Processing failed");
        }
        
        return processed;
    } catch (error) {
        console.error("Failed to process user:", error.message);
        throw error;
    }
}
```

**After (RustResult):**
```typescript
function processUser(id: string): Result<ProcessedUser> {
    const userResult = getUser(id);
    if (!userResult.ok) return userResult;
    
    const processedResult = processUserData(userResult.value);
    if (!processedResult.ok) return processedResult;
    
    return ok(processedResult.value);
}
```

### From Promise-based Error Handling

**Before (Promises):**
```typescript
async function fetchUserData(id: string) {
    try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw error;
    }
}
```

**After (RustResult):**
```typescript
async function fetchUserData(id: string): Promise<Result<User>> {
    return await tryResult(async () => {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    });
}
```

## Performance Considerations

- **Zero Runtime Overhead**: Results are just plain objects with no hidden costs
- **Tree-shakeable**: Only include the functions you actually use
- **No Dependencies**: No external libraries to load or parse
- **TypeScript-only**: No runtime type checking overhead

## Browser Support

- **Modern Browsers**: ES2020+ features (Chrome 80+, Firefox 75+, Safari 13.1+)
- **Node.js**: 16.0.0+
- **TypeScript**: 4.5+

## Contributing

We love contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/yourusername/ts-rust-result.git`
3. **Install dependencies**: `pnpm install`
4. **Create a feature branch**: `git checkout -b feature/amazing-feature`

### Development

- **Build the project**: `pnpm build`
- **Run tests**: `pnpm test`
- **Run tests in watch mode**: `pnpm test:watch`
- **Lint code**: `pnpm lint`

### Making Changes

1. **Write your code** following the existing style
2. **Add tests** for new functionality
3. **Update documentation** if needed
4. **Ensure all tests pass**: `pnpm test`
5. **Commit your changes**: `git commit -m "feat: add amazing feature"`

### Submitting Changes

1. **Push to your fork**: `git push origin feature/amazing-feature`
2. **Create a Pull Request** with a clear description of your changes
3. **Wait for review** and address any feedback

### What We're Looking For

- **Bug fixes** - Help us squash those bugs!
- **New features** - Ideas for additional utility functions
- **Documentation improvements** - Better examples, clearer explanations
- **Performance optimizations** - Make it faster!
- **TypeScript improvements** - Better type definitions and inference

## Code of Conduct

This project is committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to:

- Be respectful and considerate of others
- Use welcoming and inclusive language
- Be collaborative and open to constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Support

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Stack Overflow**: Tag questions with `ts-rust-result`

### Common Issues

**Q: Why not just use try-catch everywhere?**
A: Try-catch doesn't provide type safety and can make control flow unpredictable. Results make error handling explicit and type-safe.

**Q: Isn't this just more verbose?**
A: Initially yes, but it prevents bugs and makes your code more maintainable in the long run.

**Q: Can I mix Results with traditional error handling?**
A: Yes! Use `tryResult` to wrap existing async functions and gradually migrate your codebase.

## Changelog

### [1.0.0] - 2024-01-XX
- Initial release
- Core Result types and functions
- Async support with `tryResult`
- Assertion helpers
- Full TypeScript support

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Rust Community** - For the inspiration and the Result type pattern
- **TypeScript Team** - For the amazing type system that makes this possible
- **All Contributors** - For making this library better

---

Made with 💖 by Pippa ✨🦀

*"Error handling should be elegant, not an afterthought."*