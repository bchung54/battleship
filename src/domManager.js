import game from './game';

const domManager = (function () {
	const start = document.querySelector('.start');
	const content = document.querySelector('.content');
	const form = document.querySelector('form');
	const display = document.querySelector('.display');
	const battle = document.querySelector('.battle');
	const bgModal = document.querySelector('.bg-modal');
	const modal = document.querySelector('.modal');
	const modalClose = document.querySelector('.close');

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

	function cellElement(row, col) {
		const element = container('cell');
		element.setAttribute('row', row);
		element.setAttribute('col', col);
		return element;
	}

	function createGrid(board) {
		const grid = container('grid');

		for (let i = 0; i < board.grid.length; i++) {
			for (let j = 0; j < board.grid.length; j++) {
				const cell = cellElement(i, j);
				grid.append(cell);
			}
		}
		return grid;
	}

	function displayGrid(container, board) {
		container.append(createGrid(board));
	}

	function displayShipAttacks(board, grid) {
		board.ships.forEach((ship, shipId) => {
			ship.hits.forEach((value, index) => {
				if (value == 1) {
					if (board.horizontals[shipId]) {
						const cell = grid.querySelector(
							`[row="${board.shipCoordinates[shipId][0]}"][col="${
								board.shipCoordinates[shipId][1] + index
							}"]`
						);
						cell.classList.toggle('hit', true);
					} else {
						const cell = grid.querySelector(
							`[row="${board.shipCoordinates[shipId][0] + index}"][col="${
								board.shipCoordinates[shipId][1]
							}"]`
						);
						cell.classList.toggle('hit', true);
					}
				}
			});
		});
	}

	function displayMissedAttacks(board, grid) {
		board.missedAttacks.forEach((coord) => {
			const cell = grid.querySelector(`[row="${coord[0]}"][col="${coord[1]}"]`);
			cell.classList.toggle('miss', true);
		});
	}

	function placementCell() {
		const row = parseInt(this.getAttribute('row'));
		const col = parseInt(this.getAttribute('col'));
		const checkedOption = document.querySelector('input[name="ship-option"]:checked');
		const shipIndex = parseInt(checkedOption.value);
		const horizontal = document.querySelector('input[type="checkbox"]').checked;
		game.board1.placeShip([row, col], shipIndex, horizontal);
		displayShips(game.board1, document.querySelector('.grid'));
		const nextShip = game.board1.shipCoordinates.findIndex((element) => element == undefined);
		if (nextShip == -1) {
			return;
		}
		document.querySelector(`input[type="radio"][value="${nextShip}"]`).checked = true;
	}

	function displayShips(board, display) {
		clearGrid(display);
		board.shipCoordinates.forEach((coord, id) => {
			if (coord) {
				const shipRow = coord[0];
				const shipCol = coord[1];
				for (let i = 0; i < board.lengths[id]; i++) {
					if (board.horizontals[id]) {
						const cell = display.querySelector(`[row="${shipRow}"][col="${shipCol + i}"]`);
						cell.classList.add('ship');
					} else {
						const cell = display.querySelector(`[row="${shipRow + i}"][col="${shipCol}"]`);
						cell.classList.add('ship');
					}
				}
			}
		});
	}

	function clearGrid(display) {
		display.childNodes.forEach((cell) => {
			cell.classList.toggle('ship', false);
		});
	}

	const closeModal = () => {
		bgModal.style.display = 'none';
	};

	function displayStart() {
		start.style.display = 'flex';
	}

	/* Eventlisteners */
	form.addEventListener('submit', function (e) {
		const name = document.getElementById('player-name').value;
		game.startGame(name);
		this.parentElement.style.display = 'none';
		this.reset();
		const myGrid = createGrid(game.board1);
		myGrid.classList.add('board1');
		Array.from(myGrid.children).forEach((cell) => {
			cell.addEventListener('click', placementCell);
		});
		display.append(myGrid);
		content.style.display = 'flex';
		e.preventDefault();
	});

	battle.addEventListener('click', () => {
		if (game.board1.shipCoordinates.includes(undefined)) {
			console.log('Must place all ships first');
			return;
		}

		const grid = document.querySelector('.grid');
		Array.from(grid.children).forEach((cell) => {
			cell.removeEventListener('click', placementCell);
		});

		const oppGrid = createGrid(game.board2);
		oppGrid.classList.add('board2');
		Array.from(oppGrid.children).forEach((cell) => {
			cell.addEventListener('click', singlePlayerCell);
		});
		display.prepend(oppGrid);
	});

	/* Modal Functions */
	modalClose.addEventListener('click', closeModal); // for X close
	bgModal.addEventListener('click', closeModal); // for background close
	modal.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		return false;
	});

	return {
		displayGrid,
		displayShips,
		clearGrid,
		closeModal
	};
})();

export default domManager;
