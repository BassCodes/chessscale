import { Option, ifSome } from "./option";

export type Point = [number, number];
export function addPoint(p1: Point, p2: Point): Point {
	return [p1[0] + p2[0], p1[1] + p2[1]];
}

//
// DOM manipulation
//

// Who needs Jquery?
export function $(elementId: string): Option<HTMLElement> {
	return document.getElementById(elementId);
}

export function createCanvas(
	width: number,
	height: number
): Option<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }> {
	let ret = null;
	ifSome(document.createElement("canvas"), (canvas) => {
		canvas.width = width;
		canvas.height = height;
		ifSome(canvas.getContext("2d"), (ctx) => {
			ctx.imageSmoothingEnabled = false;
			ret = { canvas, ctx };
		});
	});
	return ret;
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

//
// Development aid errors (again inspired by rust)
//

// Intended for if else if blocks which are unreachable, but that the type system might not be able to recognize as unreachable
export class Unreachable extends Error {
	constructor() {
		super("Code marked unreachable was run");
		this.name = "Unreachable";
	}
}

// Allows mocking out methods when the return type hasn't been satisfied yet
export class Unimplemented extends Error {
	constructor() {
		super("Code marked unimplemented was run");
		this.name = "Unimplemented";
	}
}
