import Camera from "./camera";
import ChessBoard from "./chess_board";
import { TILE_SIZE } from "./constants";
import { Point, addPoint, eqPoint, mulPoint } from "./lib/util";

// I'm not exactly sure where the line begins and ends between game logic and UI logic, so for now they're mixed somewhat.

export default class GameLogic {
	board: ChessBoard;
	selectedPosition: null | Point = null;
	constructor() {
		this.board = new ChessBoard();
	}

	// TODO: most of this should be within a separate UI class.
	// This class should be primarily for handling turns of the the players and that stuff
	clickBoard(x: number, y: number): void {
		// TODO: mega refactor this
		const clicked: Point = [
			Math.floor(x / TILE_SIZE),
			Math.floor(y / TILE_SIZE),
		];
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

	// Should also mostly be in UI class
	drawMovements(cam: Camera): void {
		if (this.selectedPosition === null) {
			return;
		}
		cam.ctx.lineWidth = 2;

		const piece = this.board.getPiece(...this.selectedPosition);
		if (piece === null || piece === undefined) {
			throw new Error("unreachable code executed");
		}
		cam.ctx.strokeStyle = "green";
		for (const move of piece.getMoves()) {
			const position = addPoint(this.selectedPosition, move);
			// TODO: maybe a more visible color?
			cam.ctx.fillStyle = "rgba(140,140,140,0.6)";
			cam.ctx.beginPath();
			cam.ctx.arc(
				...addPoint(mulPoint(position, TILE_SIZE), 0.5 * TILE_SIZE),
				TILE_SIZE / 6,
				0,
				Math.PI * 2
			);
			cam.ctx.fill();
		}
		cam.ctx.strokeStyle = "red";
		cam.ctx.strokeRect(
			...mulPoint(this.selectedPosition, TILE_SIZE),
			TILE_SIZE,
			TILE_SIZE
		);
	}
}
