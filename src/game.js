import domManager from './domManager';
import gameBoard from './gameBoard';
import { player, bot } from './player';

const game = (() => {
	let player1Turn = true;
	const gridSize = 10;
	const player1 = player(0, 'p1');
	const player2 = player(1, 'p2');

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

	function start(single) {
		if (single) {
			board2.placeShip([0, 0], 2);
			board2.placeShip([1, 0], 3, false);
			board2.placeShip([3, 3], 3);
			board2.placeShip([0, 9], 4, false);
			board2.placeShip([9, 0], 5);
		} else {
		}
	}

	return {
		player1,
		player2,
		board1,
		board2,
		gameOver,
		nextTurn,
		start,
		bot: bot
	};
})();

export default game;
