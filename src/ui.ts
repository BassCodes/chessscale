import Camera from "./camera";
import ChessBoard from "./chess_board";
import { ChessPiece, ChessPieceColor, Pawn } from "./chess_piece";
import { TILE_SIZE } from "./constants";
import { Point, addPoint, eqPoint, mulPoint } from "./lib/util";


export default class UI {
	selectedPosition: null | Point = null;
	selectedPiece: null | ChessPiece = null;
	moves: Array<Point> = [];

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

		if (key === "down" && board.getPiece(...clicked)?.color === ChessPieceColor.White) {
			this.selectedPosition = clicked;
			this.selectedPiece = board.getPiece(...clicked);
			return;
		}
	
		if (this.selectedPiece === null || this.selectedPosition === null) {
			return;
		}
		
		this.moves = [];
		for (const rays of this.selectedPiece.getMoves()) {
			for (const move of rays) {
				const updatedPosition = addPoint(move, this.selectedPosition);
				const updatedPostitionPiece = board.getPiece(...updatedPosition);
				if (updatedPostitionPiece !== null) {
					if (this.selectedPiece.color === updatedPostitionPiece?.color) {
						break;
					} else {
						this.moves.push(updatedPosition);
						break;
					}
				}
				this.moves.push(updatedPosition);
			}
		}
		
		for(const move of this.moves) {
			if (eqPoint(move, clicked)) {
				board.setPiece(...move, this.selectedPiece);
				board.setPiece(...this.selectedPosition, null);
				if (this.selectedPiece instanceof Pawn) {
					this.selectedPiece.firstMove = false;
				}
				this.selectedPosition = null;
				this.selectedPiece = null;
				this.moves = [];
				return;
			}
		}
		
		if (key === "up") {
			return;
		}
		this.selectedPosition = null;
		this.selectedPosition = null;
		this.moves = [];
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
		for (const move of this.moves) {
			const positionPiece = board.getPiece(...move);
			// TODO: maybe a more visible color?
			if (positionPiece !== null) {
				if (piece.color === positionPiece?.color) {
					break;
				} else {
					cam.ctx.fillStyle = "rgba(140,140,140,0.6)";
					cam.ctx.beginPath();
					cam.ctx.arc(
						...addPoint(mulPoint(move, TILE_SIZE), 0.5 * TILE_SIZE),
						TILE_SIZE / 6,
						0,
						Math.PI * 2
					);
					cam.ctx.fill();
					break;
				}
			}
			cam.ctx.fillStyle = "rgba(140,140,140,0.6)";
			cam.ctx.beginPath();
			cam.ctx.arc(
				...addPoint(mulPoint(move, TILE_SIZE), 0.5 * TILE_SIZE),
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
