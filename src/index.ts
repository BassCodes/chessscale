import {
	Bishop,
	ChessPieceColor,
	King,
	Knight,
	Pawn,
	Queen,
	Rook,
} from "./chess_piece";
import { TILE_SIZE } from "./constants";
import { GameLogic } from "./game_logic";
import { $, Point, createCanvas, expect } from "./lib/util";

async function main(): Promise<void> {
	const { canvas, ctx } = expect(
		createCanvas(512, 512),
		"Could not create playfield canvas"
	);
	expect(
		$("pfcontainer"),
		"Could not insert playfield canvas into DOM"
	).appendChild(canvas);

	const game = new GameLogic();
	for (let i = 0; i < 8; i++) {
		game.board.setPiece(i, 6, new Pawn(ChessPieceColor.White));
	}
	game.board.setPiece(0, 7, new Rook(ChessPieceColor.White));
	game.board.setPiece(7, 7, new Rook(ChessPieceColor.White));
	game.board.setPiece(6, 7, new Knight(ChessPieceColor.White));
	game.board.setPiece(1, 7, new Knight(ChessPieceColor.White));
	game.board.setPiece(2, 7, new Bishop(ChessPieceColor.White));
	game.board.setPiece(5, 7, new Bishop(ChessPieceColor.White));
	game.board.setPiece(4, 7, new King(ChessPieceColor.White));
	game.board.setPiece(3, 7, new Queen(ChessPieceColor.White));

	let last_mouse_event: null | MouseEvent = null;
	canvas.addEventListener("click", (e) => {
		last_mouse_event = e;
	});

	ctx.lineWidth = 5;
	// Main loop
	function frame(): void {
		// TODO: Move to chessboard class
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

		if (last_mouse_event !== null) {
			const position: Point = [
				Math.floor(last_mouse_event.x / TILE_SIZE),
				Math.floor(last_mouse_event.y / TILE_SIZE),
			];
			game.clickBoard(...position);
			last_mouse_event = null;
		}

		game.drawMovements(ctx);
		game.board.drawPieces(ctx);

		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}

document.addEventListener("DOMContentLoaded", main);
