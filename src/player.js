import domManager from './domManager';
import gameBoard from './gameBoard';

export function player(id, name) {
	const boardSize = 10;
	const myBoard = gameBoard(boardSize);
	function playTurn(coord, oppBoard) {
		let a = oppBoard.receiveAttack(coord);
		if (a) {
			domManager.displayMsg('Battle!', 'Aww, you missed...');
		} else {
			domManager.displayMsg('Battle!', "Yeah baby, that's a hit!");
		}
	}

	return {
		id,
		name,
		myBoard,
		playTurn
	};
}

export var bot = Object.create(player(-1, 'bot'), {
	attackLog: {
		value: []
	},
	pickCoord: {
		value: function () {
			const max = this.myBoard.grid.length;
			let row = Math.floor(Math.random() * max);
			let col = Math.floor(Math.random() * max);
			do {
				row = Math.floor(Math.random() * max);
				col = Math.floor(Math.random() * max);
			} while (this.attackLog.includes([row, col]));

			this.attackLog.push([row, col]);
			return [row, col];
		}
	},
	playTurn: {
		value: function (oppBoard) {
			const target = this.pickCoord();
			return oppBoard.receiveAttack(target);
		}
	}
});
