//
// Options (inspired by rust)
//

// Most methods like `document.getElementById("something")` will naturally return something of the type `Option<T>`
// This type has been chosen to remain compatible with most vanilla JS methods.
// A more capable option type could have been made by creating an option object, but would lose compatibility with JS.
export type Option<T> = null | undefined | T;

export function isNone<T>(input: Option<T>): boolean {
	if (input === null || input === undefined) {
		return true;
	}
	return false;
}

export function isSome<T>(input: Option<T>): boolean {
	if (input === null || input === undefined) {
		return false;
	}
	return true;
}

type SingleArgCallback<T> = (v: T) => void;
type EmptyCallback = () => void;

/**
 * If the input `Option<T>` is some, then run the `doAfter` callback.
 * Intended to mimic rust's conditional enum matching pattern: `if let Some(v) = opt {<do things with value v>}`
 */
export function ifSome<T>(
	input: Option<T>,
	doAfter: SingleArgCallback<T>
): void {
	if (isSome(input)) {
		doAfter(input as T);
	}
}

export function ifNone<T>(input: Option<T>, doAfter: EmptyCallback): void {
	if (isNone(input)) {
		doAfter();
	}
}

// Not sure how ergonomic this is in actual use. It may get axed.
export function ifEither<T>(
	input: Option<T>,
	doIfSome: SingleArgCallback<T>,
	doIfNone: EmptyCallback
): void {
	if (isSome(input)) {
		doIfSome(input as T);
		return;
	}
	doIfNone();
}

/**
	Unwrap option of `null|undefined|T` to `T` throw error if value is not `T`.
    `expect()` is preferred to this function as it gives better error messages
 */
export function unwrap<T>(input: Option<T>): T {
	if (isNone(input)) {
		throw new TypeError("Unwrap called on null/undefined value");
	}
	return input as T;
}

/**
	Unwrap option of `null|undefined|T` to `T` throw error with `exceptionMessage` if value is not `T`
 */
export function expect<T>(input: Option<T>, exceptionMessage: string): T {
	if (isNone(input)) {
		throw new TypeError(exceptionMessage);
	}
	return input as T;
}
