import ChessBoard from "./chess_board";

export default class GameLogic {
	board: ChessBoard;
	constructor() {
		this.board = new ChessBoard();
	}
}
