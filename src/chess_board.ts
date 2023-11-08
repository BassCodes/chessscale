import Camera from "./camera";
import { ChessPiece, ChessPieceColor } from "./chess_piece";
import { DARK_SQUARE_COLOR, LIGHT_SQUARE_COLOR, TILE_SIZE } from "./constants";
import { Point, eqPoint } from "./lib/util";

type tileState = null | ChessPiece;
const CHUNK_WIDTH = 8;

class Chunk {
	tiles: Array<Array<tileState>>;
	discovered: Array<Array<boolean>>;
	chunkCoordinate: Point;
	constructor(x: number, y: number) {
		this.chunkCoordinate = [x, y];
		this.tiles = Array(8);
		this.discovered = Array(8);
		for (let i = 0; i < 8; i++) {
			this.tiles[i] = Array(8).fill(null);
			this.discovered[i] = Array(8).fill(false);
		}
	}
}

export default class ChessBoard {
	private chunks: Array<Chunk>;
	constructor() {
		this.chunks = [];
		for (let x = -3; x <= 3; x++) {
			for (let y = -3; y <= 3; y++) {
				this.chunks.push(new Chunk(x, y));
			}
		}
	}

	drawPieces(cam: Camera): void {
		for (const chunk of this.chunks) {
			for (const [x, column] of chunk.tiles.entries()) {
				for (const [y, item] of column.entries()) {
					if (item === null) continue;

					cam.ctx.drawImage(
						item.getImage(),
						(x + CHUNK_WIDTH * chunk.chunkCoordinate[0]) * TILE_SIZE,
						(y + CHUNK_WIDTH * chunk.chunkCoordinate[1]) * TILE_SIZE
					);
				}
			}
		}
	}

	drawChunks(cam: Camera): void {
		for (const chunk of this.chunks) {
			for (let x = 0; x < 8; x++) {
				for (let y = 0; y < 8; y++) {
					if ((x + y) % 2 === 0) {
						cam.ctx.fillStyle = LIGHT_SQUARE_COLOR;
					} else {
						cam.ctx.fillStyle = DARK_SQUARE_COLOR;
					}
					cam.ctx.fillRect(
						(x + chunk.chunkCoordinate[0] * CHUNK_WIDTH) * TILE_SIZE,
						(y + chunk.chunkCoordinate[1] * CHUNK_WIDTH) * TILE_SIZE,
						TILE_SIZE,
						TILE_SIZE
					);
				}
			}
		}
	}
	drawChunkBorders(cam: Camera): void {
		cam.ctx.lineWidth = 3;
		cam.ctx.strokeStyle = "green";
		for (const chunk of this.chunks) {
			cam.ctx.strokeRect(
				chunk.chunkCoordinate[0] * CHUNK_WIDTH * TILE_SIZE,
				chunk.chunkCoordinate[1] * CHUNK_WIDTH * TILE_SIZE,
				CHUNK_WIDTH * TILE_SIZE,
				CHUNK_WIDTH * TILE_SIZE
			);
		}
	}

	private getChunk(chunk_x: number, chunk_y: number): Chunk | null {
		const chunk = this.chunks.find(
			(c) =>
				c.chunkCoordinate[0] === chunk_x && c.chunkCoordinate[1] === chunk_y
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
		if (x < 0) {
			x = 8 - (Math.abs(x) % CHUNK_WIDTH);
		}
		if (y < 0) {
			y = 8 - (Math.abs(y) % CHUNK_WIDTH);
		}
		return chunk.tiles[x % CHUNK_WIDTH][y % CHUNK_WIDTH];
	}
	setPiece(x: number, y: number, put: ChessPiece | null): void {
		const chunk = this.getChunk(
			Math.floor(x / CHUNK_WIDTH),
			Math.floor(y / CHUNK_WIDTH)
		);
		if (chunk === null) {
			return;
		}
		if (x < 0) {
			x = 8 - (Math.abs(x) % CHUNK_WIDTH);
		}
		if (y < 0) {
			y = 8 - (Math.abs(y) % CHUNK_WIDTH);
		}
		chunk.tiles[x % CHUNK_WIDTH][y % CHUNK_WIDTH] = put;
	}
}
