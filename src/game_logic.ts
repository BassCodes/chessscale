import Camera from "./camera.js";
import { ChessBoard } from "./chess_board";
import { ChessPiece } from "./chess_piece";
import { TILE_SIZE } from "./constants";
import { Point, Unreachable, addPoint, eqPoint } from "./lib/util";

// I'm not exactly sure where the line begins and ends between game logic and UI logic, so for now they're mixed somewhat.

export class GameLogic {
	board: ChessBoard;
	selectedPosition: null | Point = null;
	constructor() {
		this.board = new ChessBoard();
	}

	clickBoard(x: number, y: number): void {
		// TODO: mega refactor this
		const clicked: Point = [Math.floor(x / TILE_SIZE), Math.floor(y / TILE_SIZE)];
		if (this.selectedPosition === null) {
			if (this.board.getPiece(...clicked) !== null) {
				this.selectedPosition = clicked;
			} else {
				this.selectedPosition = null;
			}
			return;
		}

		if (eqPoint(clicked, this.selectedPosition)) {
			this.selectedPosition = null;
			return;
		}

		const pieceAtPosition = this.board.getPiece(...this.selectedPosition);
		if (pieceAtPosition === null) {
			return;
		}

		// TODO: check if move is valid before moving
		for (const move of pieceAtPosition.getMoves()) {
			const updatedPosition = addPoint(move, this.selectedPosition);
			if (eqPoint(updatedPosition, clicked)) {
				this.board.setPiece(...updatedPosition, pieceAtPosition);
				this.board.setPiece(...this.selectedPosition, null);
				this.selectedPosition = null;
				break;
			}
		}
	}

	drawMovements(cam: Camera): void {
		cam.ctx.strokeStyle = "red";
		if (this.selectedPosition === null) {
			return;
		}
		cam.ctx.strokeRect(
			this.selectedPosition[0] * TILE_SIZE,
			this.selectedPosition[1] * TILE_SIZE,
			TILE_SIZE,
			TILE_SIZE
		);
		const piece = this.board.getPiece(...this.selectedPosition) as ChessPiece;
		if (piece === null) {
			throw new Unreachable();
		}
		cam.ctx.strokeStyle = "green";
		for (const move of piece.getMoves()) {
			const position = addPoint(this.selectedPosition, move);
			cam.ctx.strokeRect(
				position[0] * TILE_SIZE,
				position[1] * TILE_SIZE,
				TILE_SIZE,
				TILE_SIZE
			);
		}
	}
}
