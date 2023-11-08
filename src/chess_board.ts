import Camera from "./camera";
import { ChessPiece, ChessPieceColor } from "./chess_piece";
import { TILE_SIZE } from "./constants";
import { Point } from "./lib/util";

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
			this.discovered[i] = Array(8).fill(true);
		}
	}
}

export class ChessBoard {
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
					const color = item.color === ChessPieceColor.White ? "#0FF" : "#00f";
					cam.ctx.fillStyle = color;

					cam.ctx.drawImage(item.getImage(), x * TILE_SIZE, y * TILE_SIZE);
				}
			}
		}
	}

	drawChunks(cam: Camera): void {
		for (const chunk of this.chunks) {
			for (let x = 0; x < 8; x++) {
				for (let y = 0; y < 8; y++) {
					if ((x + y) % 2 === 0) {
						cam.ctx.fillStyle = "#b4955f";
					} else {
						cam.ctx.fillStyle = "#805833";
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
	setPiece(x: number, y: number, put: ChessPiece | null): void {
		const chunk = this.getChunk(
			Math.floor(x / CHUNK_WIDTH),
			Math.floor(y / CHUNK_WIDTH)
		);
		if (chunk === null) {
			return;
		}
		chunk.tiles[x % CHUNK_WIDTH][y % CHUNK_WIDTH] = put;
	}
}
