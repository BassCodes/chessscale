import { ChessPiece, ChessPieceColor, Pawn } from "./chess_piece";
import {
	$,
	Point,
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
	const game = new ChessGame();

	// TODO: The selection stuff should also be moved into some gamelogic class
	let selected: null | Point = null;
	canvas.addEventListener("click", (e) => {
		const position: Point = [
			Math.floor(e.x / TILE_SIZE),
			Math.floor(e.y / TILE_SIZE),
		];
		if (selected !== null && eqPoint(position, selected)) {
			selected = null;
		} else if (game.getPiece(position[0], position[1]) !== null) {
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
			const piece = game.getPiece(selected[0], selected[1]) as ChessPiece;
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

		game.drawPieces(ctx);

		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}

document.addEventListener("DOMContentLoaded", main);

type tileState = null | ChessPiece;
const CHUNK_WIDTH = 8;

class ChessGame {
	private chunks: Array<Chunk>;
	constructor() {
		this.chunks = [new Chunk(0, 0)];
		this.chunks[0].tiles[5][5] = new Pawn(ChessPieceColor.White);
	}

	drawPieces(ctx: CanvasRenderingContext2D): void {
		for (const chunk of this.chunks) {
			for (const [x, column] of chunk.tiles.entries()) {
				for (const [y, item] of column.entries()) {
					if (item === null) continue;
					const color = item.color === ChessPieceColor.White ? "#0FF" : "#00f";
					ctx.fillStyle = color;
					ctx.fillRect(
						(x + CHUNK_WIDTH * chunk.chunkCoordinate[0]) * TILE_SIZE + 8,
						(y + CHUNK_WIDTH * chunk.chunkCoordinate[1]) * TILE_SIZE + 8,
						TILE_SIZE - 16,
						TILE_SIZE - 16
					);
				}
			}
		}
	}
	private getChunk(cx: number, cy: number): Chunk | null {
		const chunk = this.chunks.find(
			(c) => c.chunkCoordinate[0] === cx && c.chunkCoordinate[1] === cy
		);
		if (chunk === undefined) {
			return null;
		}
		return chunk;
	}
	getPiece(x: number, y: number): ChessPiece | null {
		const chunk = this.getChunk(
			Math.floor(x / CHUNK_WIDTH),
			Math.floor(y / CHUNK_WIDTH)
		);
		if (chunk === null) {
			return null;
		}
		return chunk.tiles[x][y];
	}
}

class Chunk {
	tiles: Array<Array<tileState>>;
	chunkCoordinate: Point;
	constructor(x: number, y: number) {
		this.chunkCoordinate = [x, y];
		this.tiles = Array(8);
		for (let i = 0; i < 8; i++) {
			this.tiles[i] = Array(8).fill(null);
		}
	}
}
