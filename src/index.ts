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
	
	canvas.addEventListener("mousedown", (e) => {
		game.clickBoard(...camera.screenToWorld(e.x, e.y));
	});

	canvas.addEventListener("mouseup", (e) => {
		game.clickBoard(...camera.screenToWorld(e.x, e.y));
	});

	// Main loop
	function frame(): void {
		camera.begin();
		
		game.drawMovements(camera);
		game.board.drawChunks(camera);
		game.board.drawPieces(camera);

		
		camera.end();

		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}

document.addEventListener("DOMContentLoaded", main);
