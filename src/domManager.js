import game from './game';

const domManager = (function () {
	const content = document.querySelector('.content');
	const p1View = document.getElementById('player1');
	const p2View = document.getElementById('player2');
	const bgModal = document.querySelector('.bg-modal');

	function cellElement(row, col, opponent = false) {
		const element = container('cell');
		element.setAttribute('row', row);
		element.setAttribute('col', col);

		if (opponent) {
			element.addEventListener('click', singlePlayerCell);
		}

		/* element.addEventListener('click', function () {
				if (this.classList.contains('hit') || this.classList.contains('miss')) {
					return;
				}
				const row = this.getAttribute('row');
				const col = this.getAttribute('col');
				console.log(row, col);

				let board;
				let cells;
				if (this.parentElement.classList.contains('board1')) {
					if (!game.player1Turn) {
						return;
					}
					board = game.board1;
					cells = document.querySelectorAll(`.board1>[row="${row}"][col="${col}"]`);
				} else {
					if (game.player1Turn) {
						return;
					}
					board = game.board2;
					cells = document.querySelectorAll(`.board2>[row="${row}"][col="${col}"]`);
				}

				const attack = board.receiveAttack([row, col]);
				if (attack == 0) {
					cells.forEach((cell) => {
						cell.classList.add('hit');
					});
				} else {
					cells.forEach((cell) => {
						cell.classList.add('miss');
					});
				}
				game.nextTurn();
			}); */
		return element;
	}

	function singlePlayerCell() {
		if (this.classList.contains('hit') || this.classList.contains('miss')) {
			return;
		}
		const row = parseInt(this.getAttribute('row'));
		const col = parseInt(this.getAttribute('col'));
		const oppBoard = game.board2;
		const myBoard = game.board1;
		const myDisplay = document.querySelectorAll('.board1');
		const oppDisplay = document.querySelectorAll('.board2');
		game.player1.playTurn([row, col], oppBoard);
		oppDisplay.forEach((display) => {
			displayMissedAttacks(oppBoard, display);
			displayShipAttacks(oppBoard, display);
		});
		game.bot.playTurn(myBoard);
		myDisplay.forEach((display) => {
			displayMissedAttacks(myBoard, display);
			displayShipAttacks(myBoard, display);
		});

		if (game.gameOver()) {
			bgModal.style.display = 'block';
			const message = document.querySelector('.message');
			message.textContent = 'Game Over';
		}
	}

	function container(...classes) {
		const container = document.createElement('div');
		classes.forEach((element) => container.classList.add(element));
		return container;
	}

	function displayShipAttacks(board, gridDisplay) {
		board.ships.forEach((ship) => {
			ship.shipObj.hits.forEach((value, index) => {
				if (value == 1) {
					if (ship.orientation) {
						const cell = gridDisplay.querySelector(
							`[row="${ship.shipObj.id[0]}"][col="${ship.shipObj.id[1] + index}"]`
						);
						cell.classList.toggle('hit', true);
					} else {
						const cell = gridDisplay.querySelector(
							`[row="${ship.shipObj.id[0] + index}"][col="${ship.shipObj.id[1]}"]`
						);
						cell.classList.toggle('hit', true);
					}
				}
			});
		});
	}

	function displayMissedAttacks(board, gridDisplay) {
		board.missedAttacks.forEach((coord) => {
			const cell = gridDisplay.querySelector(`[row="${coord[0]}"][col="${coord[1]}"]`);
			cell.classList.toggle('miss', true);
		});
	}

	function displayGrid(board, className, opponent = false) {
		const display = container('grid-display', className);
		if (opponent) {
			display.classList.add('opponent');
		}

		for (let i = 0; i < board.grid.length; i++) {
			for (let j = 0; j < board.grid.length; j++) {
				const cell = cellElement(i, j, opponent);
				display.append(cell);
			}
		}

		if (!opponent) {
			displayShips(board, display);
		}
		return display;
	}

	function displayShips(board, display) {
		board.ships.forEach((ship) => {
			const shipRow = ship.shipObj.id[0];
			const shipCol = ship.shipObj.id[1];
			for (let i = 0; i < ship.shipObj.length; i++) {
				if (ship.orientation) {
					const cell = display.querySelector(`[row="${shipRow}"][col="${shipCol + i}"]`);
					cell.classList.add('ship');
				} else {
					const cell = display.querySelector(`[row="${shipRow + i}"][col="${shipCol}"]`);
					cell.classList.add('ship');
				}
			}
		});
	}

	function clearGrid(display) {
		display.childNodes.forEach((cell) => {
			cell.classList.toggle('ship', false);
		});
	}

	function initDisplay() {
		p1View.append(displayGrid(game.board2, 'board2', true));
		p1View.append(displayGrid(game.board1, 'board1'));

		p2View.append(displayGrid(game.board1, 'board1', true));
		p2View.append(displayGrid(game.board2, 'board2'));
	}

	const closeModal = () => {
		bgModal.style.display = 'none';
	};

	return {
		initDisplay,
		displayShips,
		clearGrid,
		closeModal
	};
})();

export default domManager;
