import game from './game';

const domManager = (function () {
	const content = document.querySelector('.content');
	const form = document.querySelector('form');
	const display = document.querySelector('.display');
	const battle = document.querySelector('.battle');
	const messageHead = document.querySelector('.msg-header');
	const message = document.querySelector('.msg-content');
	const bgModal = document.querySelector('.bg-modal');
	const modal = document.querySelector('.modal');
	const modalClose = document.querySelector('.close');

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

	function placementCell() {
		const row = parseInt(this.getAttribute('row'));
		const col = parseInt(this.getAttribute('col'));
		const checkedOption = document.querySelector('input[name="ship-option"]:checked');
		const shipIndex = parseInt(checkedOption.value);
		const horizontal = document.querySelector('input[type="checkbox"]').checked;
		message.textContent = '';
		try {
			game.board1.placeShip([row, col], shipIndex, horizontal);
		} catch (error) {
			message.textContent = error;
			console.log(error);
		}
		displayShips(game.board1, document.querySelector('.grid'));
		const nextShip = game.board1.shipCoordinates.findIndex((element) => element == undefined);
		if (nextShip == -1) {
			return;
		}
		document.querySelector(`input[type="radio"][value="${nextShip}"]`).checked = true;
	}

	function cellTurn() {
		if (this.classList.contains('hit') || this.classList.contains('miss')) {
			return;
		}
		const row = parseInt(this.getAttribute('row'));
		const col = parseInt(this.getAttribute('col'));
		const oppBoard = game.board2;
		const myBoard = game.board1;
		const myDisplay = document.querySelectorAll('.board1');
		const oppDisplay = document.querySelectorAll('.board2');
		/* Player Turn */
		game.player1.playTurn([row, col], oppBoard);
		oppDisplay.forEach((display) => {
			displayMissedAttacks(oppBoard, display);
			displayShipAttacks(oppBoard, display);
		});

		/* Bot Turn */
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

	function createGrid(board, name) {
		const grid = container('grid');
		const heading = container('board-heading');
		heading.textContent = name;
		grid.append(heading);
		const rowLabels = 'abcdefghij';

		for (let n = 0; n < 11; n++) {
			const colLabel = document.createElement('div');
			colLabel.classList.add('col-label');
			if (n == 0) {
				colLabel.textContent = '';
			} else {
				colLabel.textContent = `${n}`;
			}
			grid.append(colLabel);
		}

		for (let i = 0; i < board.grid.length; i++) {
			const rowLabel = document.createElement('div');
			rowLabel.classList.add('row-label');
			rowLabel.textContent = rowLabels[i].toUpperCase();
			grid.append(rowLabel);
			for (let j = 0; j < board.grid.length; j++) {
				const cell = cellElement(i, j);
				grid.append(cell);
			}
		}
		return grid;
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

	function clearMsg() {
		messageHead.textContent = '';
		message.textContent = '';
	}

	function displayMsg(heading, content = '') {
		messageHead.textContent = heading;
		message.textContent = content;
	}

	/* Eventlisteners */
	form.addEventListener('submit', function (e) {
		const name = document.getElementById('player-name').value;
		game.startGame(name);
		this.parentElement.style.display = 'none';
		this.reset();

		const myGrid = createGrid(game.board1, game.player1.name);
		myGrid.classList.add('board1');
		Array.from(myGrid.children).forEach((cell) => {
			cell.addEventListener('click', placementCell);
		});
		display.append(myGrid);
		display.append(container('shipyard-mirror'));
		content.style.display = 'flex';
		e.preventDefault();
	});

	battle.addEventListener('click', function () {
		if (game.board1.shipCoordinates.includes(undefined)) {
			console.log('Must place all ships first');
			return;
		}

		const grid = document.querySelector('.grid');
		Array.from(grid.children).forEach((cell) => {
			cell.removeEventListener('click', placementCell);
		});

		const oppGrid = createGrid(game.board2, 'computer');
		oppGrid.classList.add('board2');
		Array.from(oppGrid.children).forEach((cell) => {
			cell.addEventListener('click', cellTurn);
		});
		display.prepend(oppGrid);
		this.style.display = 'none';
		document.querySelector('.shipyard').style.display = 'none';
		document.querySelector('.shipyard-mirror').style.display = 'none';
		document.querySelector('.display').style.flexDirection = 'column';
		displayMsg('Battle!');
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
		displayMsg,
		clearMsg
	};
})();

export default domManager;
