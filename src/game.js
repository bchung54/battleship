import domManager from './domManager';
import gameBoard from './gameBoard';
import { player, bot } from './player';

const game = (() => {
	let player1Turn = true;
	const gridSize = 10;
	let player1;
	let player2;

	const board1 = gameBoard(gridSize);
	const board2 = gameBoard(gridSize);

	function gameOver() {
		if (board1.allSunk() || board2.allSunk()) {
			return true;
		}
		return false;
	}

	function nextTurn() {
		player1Turn = !player1Turn;
	}

	function startGame(playerName) {
		this.player1 = player(0, playerName);
		this.player2 = bot;
		board2.placeShip([0, 0], 0);
		board2.placeShip([1, 0], 1, false);
		board2.placeShip([3, 3], 2);
		board2.placeShip([0, 9], 3, false);
		board2.placeShip([9, 0], 4);
	}

	return {
		player1,
		player2,
		board1,
		board2,
		gameOver,
		nextTurn,
		startGame,
		bot: bot
	};
})();

export default game;
