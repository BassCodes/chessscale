export type Image = HTMLImageElement;

export type Point = [number, number];
export function addPoint(p1: Point, p2: Point): Point {
	return [p1[0] + p2[0], p1[1] + p2[1]];
}

export function eqPoint(p1: Point, p2: Point): boolean {
	if (p1[0] === p2[0] && p1[1] === p2[1]) return true;
	return false;
}

/**
	Unwrap option of `null|undefined|T` to `T` throw error if value is not `T`.
    `expect()` is preferred to this function as it gives better error messages
 */
export function unwrap<T>(input: T | null | undefined): T {
	if (input === null || input === undefined) {
		throw new TypeError("Unwrap called on null/undefined value");
	}
	return input;
}

/**
	Unwrap option of `null|undefined|T` to `T` throw error with `exceptionMessage` if value is not `T`
*/
export function expect<T>(
	input: T | null | undefined,
	exceptionMessage: string
): T {
	if (input === null || input === undefined) {
		throw new TypeError(exceptionMessage);
	}
	return input;
}

//
// DOM manipulation
//

// Who needs Jquery?
export function $(elementId: string): null | HTMLElement {
	return document.getElementById(elementId);
}

export function createCanvas(
	width: number,
	height: number
): null | { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	if (canvas === null) {
		return null;
	}
	const ctx = canvas.getContext("2d");
	if (ctx === null) {
		return null;
	}
	return { canvas, ctx };
}

export function clearBody(): void {
	Array.from(document.body.children).forEach((c) => {
		c.remove();
	});
}

//
// Mathematical Functions
//

export const TAU = Math.PI * 2;

const PI_OVER_ONE_EIGHTY = Math.PI / 180;
const ONE_EIGHTY_OVER_PI = 180 / Math.PI;

export function degreeToRadian(degree: number): number {
	return degree * PI_OVER_ONE_EIGHTY;
}
export function radianToDegree(radian: number): number {
	return radian * ONE_EIGHTY_OVER_PI;
}

export function rngRange(low: number, high: number): number {
	const range = high - low;
	const rand = Math.random();
	return rand * range + low;
}

export function rngRangeInt(low: number, high: number): number {
	return Math.floor(rngRange(low, high));
}

//
// Array Methods
//

export function pickRandom<T>(a: Array<T>): T {
	const index = rngRangeInt(0, a.length);
	return a[index];
}

/**
	Find the smallest and largest number in an array of numbers
*/
export function minMax(numbers: Array<number>): [number, number] {
	// TODO: check whether Math.max(numbers) works instead of reducing
	const smallest = numbers.reduce((v, o) => {
		return Math.min(v, o);
	});
	const biggest = numbers.reduce((v, o) => {
		return Math.max(v, o);
	});

	return [smallest, biggest];
}

//
// Callback -> Promise Wrappers
//

export function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		img.addEventListener("load", () => resolve(img), { once: true });
		img.addEventListener(
			"error",
			(err) => {
				reject(err);
			},
			{ once: true }
		);
		img.src = url;
	});
}
