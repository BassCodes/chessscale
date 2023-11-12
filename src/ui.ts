import Camera from "./camera";
import ChessBoard from "./chess_board";
import { ChessPiece, Pawn } from "./chess_piece";
import { TILE_SIZE } from "./constants";
import { Point, addPoint, eqPoint, mulPoint } from "./lib/util";


export default class UI {
	selectedPosition: null | Point = null;
	selectedPiece: null | ChessPiece = null;


	clickBoard(x: number, y: number, board: ChessBoard, key: string): void {
		// TODO: mega refactor this
		const clicked: Point = [
			Math.floor(x / TILE_SIZE),
			Math.floor(y / TILE_SIZE),
		];

		if (key === "up" && this.selectedPosition === null) {
			this.selectedPosition = null;
			this.selectedPiece = null;
			return;
		}

		if (key === "down" && this.selectedPiece === board.getPiece(...clicked)) {
			this.selectedPosition = null;
			this.selectedPiece = null;
			return;
		}

		if (key === "down" && board.getPiece(...clicked) !== null) {
			this.selectedPosition = clicked;
			this.selectedPiece = board.getPiece(...clicked);
			return;
		}
	
		if (this.selectedPiece === null || this.selectedPosition === null) {
			return;
		}

		// TODO: check if move is valid before moving
		for (const move of this.selectedPiece.getMoves()) {
			const updatedPosition = addPoint(move, this.selectedPosition);
			if (eqPoint(updatedPosition, clicked)) {
				board.setPiece(...updatedPosition, this.selectedPiece);
				board.setPiece(...this.selectedPosition, null);
				if (this.selectedPiece instanceof Pawn) {
					this.selectedPiece.firstMove = false;
				}
				this.selectedPosition = null;
				this.selectedPiece = null;
				return;
			}
		}
		
		if (key === "up") {
			return;
		}
		this.selectedPosition = null;
		this.selectedPosition = null;
	}

	drawMovements(cam: Camera, board: ChessBoard): void {
		if (this.selectedPosition === null) {
			return;
		}
		cam.ctx.lineWidth = 2;

		const piece = board.getPiece(...this.selectedPosition);
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
