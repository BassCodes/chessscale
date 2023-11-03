import {
	$,
	Point,
	Unimplemented,
	Unreachable,
	addPoint,
	createCanvas,
	eqPoint,
	expect,
} from "./lib/util";

const TILE_SIZE = 64;

async function main(): Promise<void> {
	const { canvas, ctx } = expect(
		createCanvas(512, 512),
		"Could not create playfield canvas"
	);
	expect(
		$("pfcontainer"),
		"Could not insert playfield canvas into DOM"
	).appendChild(canvas);

	// Temporarily just creating a chunk
	const c = new Chunk();
	c.tiles[3][6] = new Pawn(ChessPieceColor.White);

	// TODO: The selection stuff should also be moved into some gamelogic class
	let selected: null | Point = null;
	canvas.addEventListener("click", (e) => {
		const position: Point = [
			Math.floor(e.x / TILE_SIZE),
			Math.floor(e.y / TILE_SIZE),
		];
		if (selected !== null && eqPoint(position, selected)) {
			selected = null;
		} else if (c.getPiece(position[0], position[1]) !== null) {
			selected = position;
		} else {
			selected = null;
		}
	});

	// Main loop
	ctx.lineWidth = 2;
	function frame(): void {
		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 8; y++) {
				if ((x + y) % 2 === 0) {
					ctx.fillStyle = "white";
				} else {
					ctx.fillStyle = "black";
				}
				ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
			}
		}

		ctx.strokeStyle = "red";
		if (selected !== null) {
			ctx.strokeRect(
				selected[0] * TILE_SIZE,
				selected[1] * TILE_SIZE,
				TILE_SIZE,
				TILE_SIZE
			);
			const piece = c.getPiece(selected[0], selected[1]) as ChessPiece;
			if (piece === null) {
				throw new Unreachable();
			}
			ctx.strokeStyle = "green";
			for (const move of piece.getMoves()) {
				const position = addPoint(selected, move);
				ctx.strokeRect(
					position[0] * TILE_SIZE,
					position[1] * TILE_SIZE,
					TILE_SIZE,
					TILE_SIZE
				);
			}
		}

		c.draw(ctx);

		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}

document.addEventListener("DOMContentLoaded", main);

enum ChessPieceColor {
	White,
	black,
}

class ChessPiece {
	color: ChessPieceColor;
	facing: Point;
	constructor(color: ChessPieceColor) {
		this.color = color;
		if (color === ChessPieceColor.White) {
			// I didn't think too hard about this
			this.facing = [0, -1];
		} else {
			this.facing = [0, 1];
		}
	}
	// Points in which the piece can move relative to the current point
	getMoves(): Array<Point> {
		throw new Unimplemented();
	}
	// Points in which the piece can capture (if there is a piece) relative to the current point
	getCaptures(): Array<Point> {
		// By default, the piece can capture in any place it can move (assuming there is a piece in that location)
		return this.getMoves();
	}
}

class Pawn extends ChessPiece {
	getMoves(): Array<Point> {
		return [this.facing];
	}
}

type tileState = null | ChessPiece;

class Chunk {
	tiles: tileState[][];
	constructor() {
		this.tiles = Array(8);
		for (let i = 0; i < 8; i++) {
			this.tiles[i] = Array(8).fill(null);
		}
		console.log(this.tiles);
	}

	// TODO: move this method to GameBoard class when making that class
	draw(ctx: CanvasRenderingContext2D): void {
		for (const [x, column] of this.tiles.entries()) {
			for (const [y, item] of column.entries()) {
				if (item !== null) {
					const color = item.color === ChessPieceColor.White ? "#0FF" : "#00f";
					ctx.fillStyle = color;
					ctx.fillRect(
						x * TILE_SIZE + 8,
						y * TILE_SIZE + 8,
						TILE_SIZE - 16,
						TILE_SIZE - 16
					);
				}
			}
		}
	}
	// TODO: also move this into gameboard class
	getPiece(x: number, y: number): ChessPiece | null {
		return this.tiles[x]?.[y];
	}
}
