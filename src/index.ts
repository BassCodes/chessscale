import {
	Bishop,
	ChessPieceColor,
	King,
	Knight,
	Pawn,
	Queen,
	Rook,
} from "./chess_piece";
import { $, createCanvas, expect } from "./lib/util";
import Camera from "./camera";
import GameLogic from "./game_logic";
import TextureStore from "./texture_store";

// add debug object to global scope so you can do `debug.toggleBorders()` in the console to enable chunk boarders etc.
declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		debug: any;
	}
}

window.debug = {
	cborders: false,
	toggleBorders(): void {
		this.cborders = !this.cborders;
	},
};

async function main(): Promise<void> {
	const canvas_size = 512;
	const { canvas, ctx } = expect(
		createCanvas(canvas_size, canvas_size),
		"Could not create playfield canvas"
	);
	expect(
		$("pfcontainer"),
		"Could not insert playfield canvas into DOM"
	).appendChild(canvas);

	// prevent canvas right click
	canvas.oncontextmenu = (e): void => {
		e.preventDefault();
	};

	await TextureStore.init();

	const camera = new Camera(ctx);

	const game = new GameLogic();
	for (let i = 0; i < 8; i++) {
		game.board.setPiece(i, 6, new Pawn(ChessPieceColor.White));
	}
	for (let i = 0; i < 8; i++) {
		game.board.setPiece(i, 1, new Pawn(ChessPieceColor.Black));
	}
	game.board.setPiece(0, 7, new Rook(ChessPieceColor.White));
	game.board.setPiece(7, 7, new Rook(ChessPieceColor.White));
	game.board.setPiece(6, 7, new Knight(ChessPieceColor.White));
	game.board.setPiece(1, 7, new Knight(ChessPieceColor.White));
	game.board.setPiece(2, 7, new Bishop(ChessPieceColor.White));
	game.board.setPiece(5, 7, new Bishop(ChessPieceColor.White));
	game.board.setPiece(4, 7, new King(ChessPieceColor.White));
	game.board.setPiece(3, 7, new Queen(ChessPieceColor.White));

	game.board.setPiece(0, 0, new Rook(ChessPieceColor.Black));
	game.board.setPiece(7, 0, new Rook(ChessPieceColor.Black));
	game.board.setPiece(6, 0, new Knight(ChessPieceColor.Black));
	game.board.setPiece(1, 0, new Knight(ChessPieceColor.Black));
	game.board.setPiece(2, 0, new Bishop(ChessPieceColor.Black));
	game.board.setPiece(5, 0, new Bishop(ChessPieceColor.Black));
	game.board.setPiece(4, 0, new King(ChessPieceColor.Black));
	game.board.setPiece(3, 0, new Queen(ChessPieceColor.Black));

	canvas.addEventListener("mousedown", (e) => {
		game.clickBoard(...camera.screenToWorld(e.x, e.y));
	});

	canvas.addEventListener("mouseup", (e) => {
		game.clickBoard(...camera.screenToWorld(e.x, e.y));
	});

	// Main loop
	function frame(): void {
		camera.begin();

		game.board.drawChunks(camera);
		if (window.debug.cborders) {
			game.board.drawChunkBorders(camera);
		}
		game.drawMovements(camera);
		game.board.drawPieces(camera);

		camera.end();

		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}

document.addEventListener("DOMContentLoaded", main);
