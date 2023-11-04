import { Point, Unimplemented } from "./lib/util";

export enum ChessPieceColor {
	White,
	black,
}

export abstract class ChessPiece {
	color: ChessPieceColor;
	facing: Point;
	constructor(color: ChessPieceColor) {
		this.color = color;
		if (color === ChessPieceColor.White) {
			// I didn't think too hard about this
			this.facing = [0, -1];
		} else {
			this.facing = [0, 1];
		}
	}
	// Points in which the piece can move relative to the current point
	getMoves(): Array<Point> {
		throw new Unimplemented();
	}
	// Points in which the piece can capture (if there is a piece) relative to the current point
	getCaptures(): Array<Point> {
		// By default, the piece can capture in any place it can move (assuming there is a piece in that location)
		return this.getMoves();
	}
}

export class Pawn extends ChessPiece {
	getMoves(): Array<Point> {
		return [this.facing];
	}
	getCaptures(): Array<Point> {
		return [
			[-1, -1],
			[1, -1],
		];
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

export class King extends ChessPiece {
	getMoves(): Array<Point> {
		return ADJACENT_PIECES;
	}
}

// TODO add behavior for other pieces
export class Queen extends ChessPiece {
	getMoves(): Array<Point> {
		return ADJACENT_PIECES;
	}
}

export class Rook extends ChessPiece {
	getMoves(): Array<Point> {
		return ADJACENT_PIECES;
	}
}

export class Bishop extends ChessPiece {
	getMoves(): Array<Point> {
		return ADJACENT_PIECES;
	}
}

export class Knight extends ChessPiece {
	getMoves(): Array<Point> {
		return ADJACENT_PIECES;
	}
}
