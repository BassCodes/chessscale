import {
	Bishop,
	ChessPieceColor,
	King,
	Knight,
	Pawn,
	Queen,
	Rook,
} from "./chess_piece";
import GameLogic from "./game_logic";
import { $, Point, createCanvas, expect } from "./lib/util";
import Camera from "./camera";
import TextureStore from "./texture_store";

async function main(): Promise<void> {
	const { canvas, ctx } = expect(
		createCanvas(512, 512),
		"Could not create playfield canvas"
	);
	expect(
		$("pfcontainer"),
		"Could not insert playfield canvas into DOM"
	).appendChild(canvas);

	await TextureStore.init();

	const camera = new Camera(ctx);

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

	// Main loop
	function frame(): void {
		camera.begin();

		if (last_mouse_event !== null) {
			const position: Point = camera.screenToWorld(
				last_mouse_event.x,
				last_mouse_event.y
			);
			game.clickBoard(...position);

			last_mouse_event = null;
		}

		game.board.drawChunks(camera);
		game.drawMovements(camera);
		game.board.drawPieces(camera);

		camera.end();

		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}

document.addEventListener("DOMContentLoaded", main);
