import { Image, Point } from "./lib/util";
import TextureStore from "./texture_store";

export enum ChessPieceColor {
	White,
	Black,
}

export abstract class ChessPiece {
	readonly color: ChessPieceColor;
	constructor(color: ChessPieceColor) {
		this.color = color;
	}

	getImage(): Image {
		throw new Error("unimplemented");
	}
	// Points in which the piece can move relative to the current point
	getMoves(): Array<Point> {
		throw new Error("unimplemented");
	}
	// Points in which the piece can capture (if there is a piece) relative to the current point
	getCaptures(): Array<Point> {
		// By default, the piece can capture in any place it can move (assuming there is a piece in that location)
		return this.getMoves();
	}
}

export class Pawn extends ChessPiece {
	firstMove: boolean = true;
	getMoves(): Array<Point> {
		const PAWN_MOVEMENT: Array<Point> = [(this.color === ChessPieceColor.White) ? [0, -1] : [0, 1]];
		if (this.firstMove) {
			PAWN_MOVEMENT.push((this.color === ChessPieceColor.White) ? [0, -2] : [0, 2]);
		}
		return PAWN_MOVEMENT;
	}
	getCaptures(): Array<Point> {
		return (this.color === ChessPieceColor.White) ?  [[-1, -1], [1, -1],] : [[-1, 1], [1, 1],];
	}
	getImage(): Image { 
		return (this.color === ChessPieceColor.White) ? TextureStore.pieces[5] : TextureStore.pieces[11];
	}
}

const ADJACENT_PIECES: Array<Point> = [
	[1, 1],
	[1, 0],
	[1, -1],
	[0, 1],
	[0, -1],
	[-1, 1],
	[-1, 0],
	[-1, -1],
];

const DIAGONAL: Array<Point> = [
	// Up Left
	[-1, -1],
	[-2, -2],
	[-3, -3],
	[-4, -4],
	[-5, -5],
	[-6, -6],
	[-7, -7],
	[-8, -8],
	// Up Right
	[1, -1],
	[2, -2],
	[3, -3],
	[4, -4],
	[5, -5],
	[6, -6],
	[7, -7],
	[8, -8],
	// Down Left
	[-1, 1],
	[-2, 2],
	[-3, 3],
	[-4, 4],
	[-5, 5],
	[-6, 6],
	[-7, 7],
	[-8, 8],
	// Down Right
	[1, 1],
	[2, 2],
	[3, 3],
	[4, 4],
	[5, 5],
	[6, 6],
	[7, 7],
	[8, 8],
];

const VERTICAL_HORIZONTAL: Array<Point> = [
	// Right
	[1, 0],
	[2, 0],
	[3, 0],
	[4, 0],
	[5, 0],
	[6, 0],
	[7, 0],
	[8, 0],
	// Left
	[-1, 0],
	[-2, 0],
	[-3, 0],
	[-4, 0],
	[-5, 0],
	[-6, 0],
	[-7, 0],
	[-8, 0],
	// Up
	[0, -1],
	[0, -2],
	[0, -3],
	[0, -4],
	[0, -5],
	[0, -6],
	[0, -7],
	[0, -8],
	// Down
	[0, 1],
	[0, 2],
	[0, 3],
	[0, 4],
	[0, 5],
	[0, 6],
	[0, 7],
	[0, 8],
];

const KNIGHT_MOVEMENT: Array<Point> = [
	[2, 1],
	[2, -1],
	[-2, 1],
	[-2, -1],
	[1, 2],
	[1, -2],
	[-1, 2],
	[-1, -2],
];

const VERTICAL_HORIZONTAL_DIAGONAL: Array<Point> = [];
VERTICAL_HORIZONTAL_DIAGONAL.push(...VERTICAL_HORIZONTAL);
VERTICAL_HORIZONTAL_DIAGONAL.push(...DIAGONAL);

export class King extends ChessPiece {
	getMoves(): Array<Point> {
		return ADJACENT_PIECES;
	}
	getImage(): Image { 
		return (this.color === ChessPieceColor.White) ? TextureStore.pieces[0] : TextureStore.pieces[6];
	}
}

// TODO add behavior for other pieces
export class Queen extends ChessPiece {
	getMoves(): Array<Point> {
		return VERTICAL_HORIZONTAL_DIAGONAL;
	}
	getImage(): Image {
		return (this.color === ChessPieceColor.White) ? TextureStore.pieces[1] : TextureStore.pieces[7];
	}
}

export class Rook extends ChessPiece {
	getMoves(): Array<Point> {
		return VERTICAL_HORIZONTAL;
	}
	getImage(): Image {
		return (this.color === ChessPieceColor.White) ? TextureStore.pieces[4] : TextureStore.pieces[10];
	}
}

export class Bishop extends ChessPiece {
	getMoves(): Array<Point> {
		return DIAGONAL;
	}
	getImage(): Image {
		return (this.color === ChessPieceColor.White) ? TextureStore.pieces[2] : TextureStore.pieces[8];
	}
}

export class Knight extends ChessPiece {
	getMoves(): Array<Point> {
		return KNIGHT_MOVEMENT;
	}
	getImage(): Image {
		return (this.color === ChessPieceColor.White) ? TextureStore.pieces[3] : TextureStore.pieces[9];
	}
}
