import { Point } from "./lib/util";
import { TILE_SIZE } from "./constants";

/**
 * Camera by @robashton returns Camera object.
 *  constructor initial parameters:
 *  @param {ctx} str *required
 *  @param {settings} str *optional
 */
export default class Camera {
	distance: number;
	lookAt: [number, number];
	ctx: CanvasRenderingContext2D;
	fieldOfView: number;
	viewport: {
		left: number;
		right: number;
		top: number;
		bottom: number;
		width: number;
		height: number;
		scale: [number, number];
	};
	aspectRatio: number;

	constructor(ctx: CanvasRenderingContext2D) {
		this.distance = 512.0;
		this.lookAt = [256, 256];
		this.ctx = ctx;
		this.fieldOfView = Math.PI / 4.0;
		this.viewport = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			width: 0,
			height: 0,
			scale: [1.0, 1.0],
		};
		this.aspectRatio = ctx.canvas.width / ctx.canvas.height;
		this.init();
	}

	/**
	 * Camera Initialization
	 * -Add listeners.
	 * -Initial calculations.
	 */
	init(): void {
		this.addListeners();
		this.updateViewport();
	}

	/**
	 * Applies to canvas ctx the parameters:
	 *  -Scale
	 *  -Translation
	 */
	begin(): void {
		this.ctx.save();
		this.applyScale();
		this.applyTranslation();
	}

	/**
	 * 2d ctx restore() method
	 */
	end(): void {
		this.ctx.restore();
	}

	/**
	 * 2d ctx scale(Camera.viewport.scale[0], Camera.viewport.scale[0]) method
	 */
	applyScale(): void {
		this.ctx.scale(this.viewport.scale[0], this.viewport.scale[1]);
	}

	/**
	 * 2d ctx translate(-Camera.viewport.left, -Camera.viewport.top) method
	 */
	applyTranslation(): void {
		this.ctx.translate(-this.viewport.left, -this.viewport.top);
	}

	/**
	 * Camera.viewport data update
	 */
	updateViewport(): void {
		this.aspectRatio = this.ctx.canvas.width / this.ctx.canvas.height;
		this.viewport.width = this.distance * Math.tan(this.fieldOfView);
		this.viewport.height = this.viewport.width / this.aspectRatio;
		this.viewport.left = this.lookAt[0] - this.viewport.width / 2.0;
		this.viewport.top = this.lookAt[1] - this.viewport.height / 2.0;
		this.viewport.right = this.viewport.left + this.viewport.width;
		this.viewport.bottom = this.viewport.top + this.viewport.height;
		this.viewport.scale[0] = this.ctx.canvas.width / this.viewport.width;
		this.viewport.scale[1] = this.ctx.canvas.height / this.viewport.height;
	}

	/**
	 * Zooms to certain z distance
	 * @param {*z distance} z
	 */
	zoomTo(z: number): void {
		this.distance = z;
		this.updateViewport();
	}

	/**
	 * Moves the centre of the viewport to new x, y coords (updates Camera.lookAt)
	 * @param {x axis coord} x
	 * @param {y axis coord} y
	 */
	moveTo(x: number, y: number): void {
		this.lookAt[0] = x;
		this.lookAt[1] = y;
		this.updateViewport();
	}

	screenToWorld(x: number, y: number): Point {
		const nx = x / this.viewport.scale[0] + this.viewport.left;
		const ny = y / this.viewport.scale[1] + this.viewport.top;
		return [nx, ny];
	}

	worldToScreen(x: number, y: number): Point {
		const nx = (x - this.viewport.left) * this.viewport.scale[0];
		const ny = (y - this.viewport.top) * this.viewport.scale[1];
		return [nx, ny];
	}

	addListeners(): void {
		let mouseIsDown = false;

		window.addEventListener("mousedown", () => {
			mouseIsDown = true;
		});

		window.addEventListener("mouseup", () => {
			mouseIsDown = false;
		});

		window.addEventListener("mousemove", (e) => {
			if (e.shiftKey && mouseIsDown) {
				this.ctx.clearRect(0, 0, 100000, 100000);
				const [currentCamX, currentCamY] = this.lookAt;
				this.moveTo(
					currentCamX - (e.movementX * this.distance) / 512,
					currentCamY - (e.movementY * this.distance) / 512
				);
			}
		});

		window.onwheel = (e): void => {
			this.ctx.clearRect(0, 0, 100000, 100000);
			let zoomLevel = this.distance + e.deltaY * 2;
			// const [currentCamX, currentCamY] = this.lookAt;
			// this.moveTo(
			// 	currentCamX - (currentCamX - e.x) / 2,
			// 	currentCamY - (currentCamY - e.y) / 2
			// );

			if (zoomLevel <= 1) {
				zoomLevel = 1;
			}

			this.zoomTo(zoomLevel);
		};
	}
}
