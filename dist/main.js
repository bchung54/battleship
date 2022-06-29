/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/domManager.js":
/*!***************************!*\
  !*** ./src/domManager.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");


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
			_game__WEBPACK_IMPORTED_MODULE_0__["default"].board1.placeShip([row, col], shipIndex, horizontal);
		} catch (error) {
			message.textContent = error;
			console.log(error);
		}
		displayShips(_game__WEBPACK_IMPORTED_MODULE_0__["default"].board1, document.querySelector('.grid'));
		const nextShip = _game__WEBPACK_IMPORTED_MODULE_0__["default"].board1.shipCoordinates.findIndex((element) => element == undefined);
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
		const oppBoard = _game__WEBPACK_IMPORTED_MODULE_0__["default"].board2;
		const myBoard = _game__WEBPACK_IMPORTED_MODULE_0__["default"].board1;
		const myDisplay = document.querySelectorAll('.board1');
		const oppDisplay = document.querySelectorAll('.board2');
		/* Player Turn */
		_game__WEBPACK_IMPORTED_MODULE_0__["default"].player1.playTurn([row, col], oppBoard);
		oppDisplay.forEach((display) => {
			displayMissedAttacks(oppBoard, display);
			displayShipAttacks(oppBoard, display);
		});

		/* Bot Turn */
		_game__WEBPACK_IMPORTED_MODULE_0__["default"].bot.playTurn(myBoard);
		myDisplay.forEach((display) => {
			displayMissedAttacks(myBoard, display);
			displayShipAttacks(myBoard, display);
		});

		if (_game__WEBPACK_IMPORTED_MODULE_0__["default"].gameOver()) {
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
		_game__WEBPACK_IMPORTED_MODULE_0__["default"].startGame(name);
		this.parentElement.style.display = 'none';
		this.reset();

		const myGrid = createGrid(_game__WEBPACK_IMPORTED_MODULE_0__["default"].board1, _game__WEBPACK_IMPORTED_MODULE_0__["default"].player1.name);
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
		if (_game__WEBPACK_IMPORTED_MODULE_0__["default"].board1.shipCoordinates.includes(undefined)) {
			console.log('Must place all ships first');
			return;
		}

		const grid = document.querySelector('.grid');
		Array.from(grid.children).forEach((cell) => {
			cell.removeEventListener('click', placementCell);
		});

		const oppGrid = createGrid(_game__WEBPACK_IMPORTED_MODULE_0__["default"].board2, 'computer');
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (domManager);


/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _gameBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameBoard */ "./src/gameBoard.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");



const game = (() => {
	let player1Turn = true;
	const gridSize = 10;
	let player1;
	let player2;

	const board1 = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_0__["default"])(gridSize);
	const board2 = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_0__["default"])(gridSize);

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
		this.player1 = (0,_player__WEBPACK_IMPORTED_MODULE_1__.player)(0, playerName);
		this.player2 = _player__WEBPACK_IMPORTED_MODULE_1__.bot;
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
		bot: _player__WEBPACK_IMPORTED_MODULE_1__.bot
	};
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (game);


/***/ }),

/***/ "./src/gameBoard.js":
/*!**************************!*\
  !*** ./src/gameBoard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _domManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domManager */ "./src/domManager.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ "./src/ship.js");



function gameBoard(size) {
	const lengths = [2, 3, 3, 4, 5];
	const grid = Array.from(Array(size), () => new Array(size).fill(-1));
	const ships = [];
	const shipCoordinates = new Array(lengths.length);
	const horizontals = new Array(lengths.length);
	const missedAttacks = [];

	/* Prepopulate ships */
	function loadShips() {
		lengths.forEach((length, index) => {
			ships.push((0,_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(index, length));
		});
	}

	loadShips();

	function placeShip(coord, shipId, horizontal = true) {
		const row = coord[0];
		const col = coord[1];
		const length = lengths[shipId];

		// Coordinate Validation
		if (horizontal) {
			if (col + length > size) {
				throw new Error('Out of grid column range');
			}
		} else {
			if (row + length > size) {
				throw new Error('Out of grid row range');
			}
		}

		clearShip(shipId);
		if (horizontal) {
			// horizontal
			for (let i = 0; i < length; i++) {
				if (this.grid[row][col + i] != -1) {
					throw new Error(`Ship:${shipId} overlaps Ship:${this.grid[row][col + i]}`);
				}
				this.grid[row][col + i] = shipId;
			}
			horizontals[shipId] = true;
		} else {
			// vertical
			for (let i = 0; i < length; i++) {
				if (this.grid[row + i][col] != -1) {
					throw new Error(`Ship:${shipId} overlaps Ship:${this.grid[row + i][col]}`);
				}
				this.grid[row + i][col] = shipId;
			}
			horizontals[shipId] = false;
		}
		shipCoordinates[shipId] = [row, col];
	}

	function clearShip(shipId) {
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid.length; j++) {
				if (grid[i][j] == shipId) {
					grid[i][j] = -1;
				}
			}
		}
	}

	function receiveAttack(coord) {
		const row = coord[0];
		const col = coord[1];
		const id = this.grid[row][col];
		if (id == -1) {
			missedAttacks.push(coord);
			return -1;
		}
		const attackedShip = ships[id];
		const hitPosition = row - shipCoordinates[id][0] + col - shipCoordinates[id][1];
		attackedShip.hit(hitPosition);
		return 0;
	}

	function allSunk() {
		const afloat = ships.some((ship) => !ship.isSunk());
		if (afloat) {
			return false;
		}
		return true;
	}

	function clear() {
		this.grid = Array.from(Array(size), () => new Array(size).fill(-1));
		this.ships = [];
		this.shipCoordinates = new Array(lengths.length);
		this.horizontals = new Array(lengths.length);
		this.missedAttacks = [];
		loadShips();
	}

	return {
		lengths,
		grid,
		ships,
		shipCoordinates,
		horizontals,
		placeShip,
		receiveAttack,
		missedAttacks,
		allSunk,
		clear
	};
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameBoard);


/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bot": () => (/* binding */ bot),
/* harmony export */   "player": () => (/* binding */ player)
/* harmony export */ });
/* harmony import */ var _domManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domManager */ "./src/domManager.js");
/* harmony import */ var _gameBoard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameBoard */ "./src/gameBoard.js");



function player(id, name) {
	const boardSize = 10;
	const myBoard = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_1__["default"])(boardSize);
	function playTurn(coord, oppBoard) {
		let a = oppBoard.receiveAttack(coord);
		if (a) {
			_domManager__WEBPACK_IMPORTED_MODULE_0__["default"].displayMsg('Battle!', 'Aww, you missed...');
		} else {
			_domManager__WEBPACK_IMPORTED_MODULE_0__["default"].displayMsg('Battle!', "Yeah baby, that's a hit!");
		}
	}

	return {
		id,
		name,
		myBoard,
		playTurn
	};
}

var bot = Object.create(player(-1, 'bot'), {
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


/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function ship(id, length) {
	const hits = Array(length).fill(0);

	function isSunk() {
		return hits.includes(0) ? false : true;
	}
	function hit(pos) {
		hits[pos] = 1;
	}

	return {
		id,
		length,
		hits,
		hit,
		isSunk
	};
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ship);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _domManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domManager */ "./src/domManager.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./src/game.js");



const nameInput = document.querySelector('#player-name');
nameInput.focus();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDMUI7QUFDQTtBQUNBO0FBQ0EsR0FBRyw4REFBcUI7QUFDeEIsSUFBSTtBQUNKLEdBQUcsOERBQXFCO0FBQ3hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUMvQ0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxJQUFJLEVBQUM7Ozs7Ozs7VUNuQnBCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTnNDO0FBQ1o7O0FBRTFCO0FBQ0Esa0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xuXG5jb25zdCBkb21NYW5hZ2VyID0gKGZ1bmN0aW9uICgpIHtcblx0Y29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50Jyk7XG5cdGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG5cdGNvbnN0IGRpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGlzcGxheScpO1xuXHRjb25zdCBiYXR0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmF0dGxlJyk7XG5cdGNvbnN0IG1lc3NhZ2VIZWFkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1zZy1oZWFkZXInKTtcblx0Y29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tc2ctY29udGVudCcpO1xuXHRjb25zdCBiZ01vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJnLW1vZGFsJyk7XG5cdGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsJyk7XG5cdGNvbnN0IG1vZGFsQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xvc2UnKTtcblxuXHRmdW5jdGlvbiBjb250YWluZXIoLi4uY2xhc3Nlcykge1xuXHRcdGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGNsYXNzZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4gY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoZWxlbWVudCkpO1xuXHRcdHJldHVybiBjb250YWluZXI7XG5cdH1cblxuXHRmdW5jdGlvbiBjZWxsRWxlbWVudChyb3csIGNvbCkge1xuXHRcdGNvbnN0IGVsZW1lbnQgPSBjb250YWluZXIoJ2NlbGwnKTtcblx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSgncm93Jywgcm93KTtcblx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSgnY29sJywgY29sKTtcblx0XHRyZXR1cm4gZWxlbWVudDtcblx0fVxuXG5cdGZ1bmN0aW9uIHBsYWNlbWVudENlbGwoKSB7XG5cdFx0Y29uc3Qgcm93ID0gcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoJ3JvdycpKTtcblx0XHRjb25zdCBjb2wgPSBwYXJzZUludCh0aGlzLmdldEF0dHJpYnV0ZSgnY29sJykpO1xuXHRcdGNvbnN0IGNoZWNrZWRPcHRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwic2hpcC1vcHRpb25cIl06Y2hlY2tlZCcpO1xuXHRcdGNvbnN0IHNoaXBJbmRleCA9IHBhcnNlSW50KGNoZWNrZWRPcHRpb24udmFsdWUpO1xuXHRcdGNvbnN0IGhvcml6b250YWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5jaGVja2VkO1xuXHRcdG1lc3NhZ2UudGV4dENvbnRlbnQgPSAnJztcblx0XHR0cnkge1xuXHRcdFx0Z2FtZS5ib2FyZDEucGxhY2VTaGlwKFtyb3csIGNvbF0sIHNoaXBJbmRleCwgaG9yaXpvbnRhbCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdG1lc3NhZ2UudGV4dENvbnRlbnQgPSBlcnJvcjtcblx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHR9XG5cdFx0ZGlzcGxheVNoaXBzKGdhbWUuYm9hcmQxLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZCcpKTtcblx0XHRjb25zdCBuZXh0U2hpcCA9IGdhbWUuYm9hcmQxLnNoaXBDb29yZGluYXRlcy5maW5kSW5kZXgoKGVsZW1lbnQpID0+IGVsZW1lbnQgPT0gdW5kZWZpbmVkKTtcblx0XHRpZiAobmV4dFNoaXAgPT0gLTEpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgaW5wdXRbdHlwZT1cInJhZGlvXCJdW3ZhbHVlPVwiJHtuZXh0U2hpcH1cIl1gKS5jaGVja2VkID0gdHJ1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNlbGxUdXJuKCkge1xuXHRcdGlmICh0aGlzLmNsYXNzTGlzdC5jb250YWlucygnaGl0JykgfHwgdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ21pc3MnKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCByb3cgPSBwYXJzZUludCh0aGlzLmdldEF0dHJpYnV0ZSgncm93JykpO1xuXHRcdGNvbnN0IGNvbCA9IHBhcnNlSW50KHRoaXMuZ2V0QXR0cmlidXRlKCdjb2wnKSk7XG5cdFx0Y29uc3Qgb3BwQm9hcmQgPSBnYW1lLmJvYXJkMjtcblx0XHRjb25zdCBteUJvYXJkID0gZ2FtZS5ib2FyZDE7XG5cdFx0Y29uc3QgbXlEaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkMScpO1xuXHRcdGNvbnN0IG9wcERpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hcmQyJyk7XG5cdFx0LyogUGxheWVyIFR1cm4gKi9cblx0XHRnYW1lLnBsYXllcjEucGxheVR1cm4oW3JvdywgY29sXSwgb3BwQm9hcmQpO1xuXHRcdG9wcERpc3BsYXkuZm9yRWFjaCgoZGlzcGxheSkgPT4ge1xuXHRcdFx0ZGlzcGxheU1pc3NlZEF0dGFja3Mob3BwQm9hcmQsIGRpc3BsYXkpO1xuXHRcdFx0ZGlzcGxheVNoaXBBdHRhY2tzKG9wcEJvYXJkLCBkaXNwbGF5KTtcblx0XHR9KTtcblxuXHRcdC8qIEJvdCBUdXJuICovXG5cdFx0Z2FtZS5ib3QucGxheVR1cm4obXlCb2FyZCk7XG5cdFx0bXlEaXNwbGF5LmZvckVhY2goKGRpc3BsYXkpID0+IHtcblx0XHRcdGRpc3BsYXlNaXNzZWRBdHRhY2tzKG15Qm9hcmQsIGRpc3BsYXkpO1xuXHRcdFx0ZGlzcGxheVNoaXBBdHRhY2tzKG15Qm9hcmQsIGRpc3BsYXkpO1xuXHRcdH0pO1xuXG5cdFx0aWYgKGdhbWUuZ2FtZU92ZXIoKSkge1xuXHRcdFx0YmdNb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWVzc2FnZScpO1xuXHRcdFx0bWVzc2FnZS50ZXh0Q29udGVudCA9ICdHYW1lIE92ZXInO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUdyaWQoYm9hcmQsIG5hbWUpIHtcblx0XHRjb25zdCBncmlkID0gY29udGFpbmVyKCdncmlkJyk7XG5cdFx0Y29uc3QgaGVhZGluZyA9IGNvbnRhaW5lcignYm9hcmQtaGVhZGluZycpO1xuXHRcdGhlYWRpbmcudGV4dENvbnRlbnQgPSBuYW1lO1xuXHRcdGdyaWQuYXBwZW5kKGhlYWRpbmcpO1xuXHRcdGNvbnN0IHJvd0xhYmVscyA9ICdhYmNkZWZnaGlqJztcblxuXHRcdGZvciAobGV0IG4gPSAwOyBuIDwgMTE7IG4rKykge1xuXHRcdFx0Y29uc3QgY29sTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdGNvbExhYmVsLmNsYXNzTGlzdC5hZGQoJ2NvbC1sYWJlbCcpO1xuXHRcdFx0aWYgKG4gPT0gMCkge1xuXHRcdFx0XHRjb2xMYWJlbC50ZXh0Q29udGVudCA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29sTGFiZWwudGV4dENvbnRlbnQgPSBgJHtufWA7XG5cdFx0XHR9XG5cdFx0XHRncmlkLmFwcGVuZChjb2xMYWJlbCk7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5ncmlkLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCByb3dMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0cm93TGFiZWwuY2xhc3NMaXN0LmFkZCgncm93LWxhYmVsJyk7XG5cdFx0XHRyb3dMYWJlbC50ZXh0Q29udGVudCA9IHJvd0xhYmVsc1tpXS50b1VwcGVyQ2FzZSgpO1xuXHRcdFx0Z3JpZC5hcHBlbmQocm93TGFiZWwpO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBib2FyZC5ncmlkLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGNvbnN0IGNlbGwgPSBjZWxsRWxlbWVudChpLCBqKTtcblx0XHRcdFx0Z3JpZC5hcHBlbmQoY2VsbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBncmlkO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcGxheVNoaXBBdHRhY2tzKGJvYXJkLCBncmlkKSB7XG5cdFx0Ym9hcmQuc2hpcHMuZm9yRWFjaCgoc2hpcCwgc2hpcElkKSA9PiB7XG5cdFx0XHRzaGlwLmhpdHMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PSAxKSB7XG5cdFx0XHRcdFx0aWYgKGJvYXJkLmhvcml6b250YWxzW3NoaXBJZF0pIHtcblx0XHRcdFx0XHRcdGNvbnN0IGNlbGwgPSBncmlkLnF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdFx0XHRcdGBbcm93PVwiJHtib2FyZC5zaGlwQ29vcmRpbmF0ZXNbc2hpcElkXVswXX1cIl1bY29sPVwiJHtcblx0XHRcdFx0XHRcdFx0XHRib2FyZC5zaGlwQ29vcmRpbmF0ZXNbc2hpcElkXVsxXSArIGluZGV4XG5cdFx0XHRcdFx0XHRcdH1cIl1gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0Y2VsbC5jbGFzc0xpc3QudG9nZ2xlKCdoaXQnLCB0cnVlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgY2VsbCA9IGdyaWQucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0XHRcdFx0YFtyb3c9XCIke2JvYXJkLnNoaXBDb29yZGluYXRlc1tzaGlwSWRdWzBdICsgaW5kZXh9XCJdW2NvbD1cIiR7XG5cdFx0XHRcdFx0XHRcdFx0Ym9hcmQuc2hpcENvb3JkaW5hdGVzW3NoaXBJZF1bMV1cblx0XHRcdFx0XHRcdFx0fVwiXWBcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRjZWxsLmNsYXNzTGlzdC50b2dnbGUoJ2hpdCcsIHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwbGF5TWlzc2VkQXR0YWNrcyhib2FyZCwgZ3JpZCkge1xuXHRcdGJvYXJkLm1pc3NlZEF0dGFja3MuZm9yRWFjaCgoY29vcmQpID0+IHtcblx0XHRcdGNvbnN0IGNlbGwgPSBncmlkLnF1ZXJ5U2VsZWN0b3IoYFtyb3c9XCIke2Nvb3JkWzBdfVwiXVtjb2w9XCIke2Nvb3JkWzFdfVwiXWApO1xuXHRcdFx0Y2VsbC5jbGFzc0xpc3QudG9nZ2xlKCdtaXNzJywgdHJ1ZSk7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwbGF5U2hpcHMoYm9hcmQsIGRpc3BsYXkpIHtcblx0XHRjbGVhckdyaWQoZGlzcGxheSk7XG5cdFx0Ym9hcmQuc2hpcENvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkLCBpZCkgPT4ge1xuXHRcdFx0aWYgKGNvb3JkKSB7XG5cdFx0XHRcdGNvbnN0IHNoaXBSb3cgPSBjb29yZFswXTtcblx0XHRcdFx0Y29uc3Qgc2hpcENvbCA9IGNvb3JkWzFdO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aHNbaWRdOyBpKyspIHtcblx0XHRcdFx0XHRpZiAoYm9hcmQuaG9yaXpvbnRhbHNbaWRdKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBjZWxsID0gZGlzcGxheS5xdWVyeVNlbGVjdG9yKGBbcm93PVwiJHtzaGlwUm93fVwiXVtjb2w9XCIke3NoaXBDb2wgKyBpfVwiXWApO1xuXHRcdFx0XHRcdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnN0IGNlbGwgPSBkaXNwbGF5LnF1ZXJ5U2VsZWN0b3IoYFtyb3c9XCIke3NoaXBSb3cgKyBpfVwiXVtjb2w9XCIke3NoaXBDb2x9XCJdYCk7XG5cdFx0XHRcdFx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNsZWFyR3JpZChkaXNwbGF5KSB7XG5cdFx0ZGlzcGxheS5jaGlsZE5vZGVzLmZvckVhY2goKGNlbGwpID0+IHtcblx0XHRcdGNlbGwuY2xhc3NMaXN0LnRvZ2dsZSgnc2hpcCcsIGZhbHNlKTtcblx0XHR9KTtcblx0fVxuXG5cdGNvbnN0IGNsb3NlTW9kYWwgPSAoKSA9PiB7XG5cdFx0YmdNb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGNsZWFyTXNnKCkge1xuXHRcdG1lc3NhZ2VIZWFkLnRleHRDb250ZW50ID0gJyc7XG5cdFx0bWVzc2FnZS50ZXh0Q29udGVudCA9ICcnO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcGxheU1zZyhoZWFkaW5nLCBjb250ZW50ID0gJycpIHtcblx0XHRtZXNzYWdlSGVhZC50ZXh0Q29udGVudCA9IGhlYWRpbmc7XG5cdFx0bWVzc2FnZS50ZXh0Q29udGVudCA9IGNvbnRlbnQ7XG5cdH1cblxuXHQvKiBFdmVudGxpc3RlbmVycyAqL1xuXHRmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7XG5cdFx0Y29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXItbmFtZScpLnZhbHVlO1xuXHRcdGdhbWUuc3RhcnRHYW1lKG5hbWUpO1xuXHRcdHRoaXMucGFyZW50RWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdHRoaXMucmVzZXQoKTtcblxuXHRcdGNvbnN0IG15R3JpZCA9IGNyZWF0ZUdyaWQoZ2FtZS5ib2FyZDEsIGdhbWUucGxheWVyMS5uYW1lKTtcblx0XHRteUdyaWQuY2xhc3NMaXN0LmFkZCgnYm9hcmQxJyk7XG5cdFx0QXJyYXkuZnJvbShteUdyaWQuY2hpbGRyZW4pLmZvckVhY2goKGNlbGwpID0+IHtcblx0XHRcdGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwbGFjZW1lbnRDZWxsKTtcblx0XHR9KTtcblx0XHRkaXNwbGF5LmFwcGVuZChteUdyaWQpO1xuXHRcdGRpc3BsYXkuYXBwZW5kKGNvbnRhaW5lcignc2hpcHlhcmQtbWlycm9yJykpO1xuXHRcdGNvbnRlbnQuc3R5bGUuZGlzcGxheSA9ICdmbGV4Jztcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdH0pO1xuXG5cdGJhdHRsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoZ2FtZS5ib2FyZDEuc2hpcENvb3JkaW5hdGVzLmluY2x1ZGVzKHVuZGVmaW5lZCkpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdNdXN0IHBsYWNlIGFsbCBzaGlwcyBmaXJzdCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZCcpO1xuXHRcdEFycmF5LmZyb20oZ3JpZC5jaGlsZHJlbikuZm9yRWFjaCgoY2VsbCkgPT4ge1xuXHRcdFx0Y2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHBsYWNlbWVudENlbGwpO1xuXHRcdH0pO1xuXG5cdFx0Y29uc3Qgb3BwR3JpZCA9IGNyZWF0ZUdyaWQoZ2FtZS5ib2FyZDIsICdjb21wdXRlcicpO1xuXHRcdG9wcEdyaWQuY2xhc3NMaXN0LmFkZCgnYm9hcmQyJyk7XG5cdFx0QXJyYXkuZnJvbShvcHBHcmlkLmNoaWxkcmVuKS5mb3JFYWNoKChjZWxsKSA9PiB7XG5cdFx0XHRjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2VsbFR1cm4pO1xuXHRcdH0pO1xuXHRcdGRpc3BsYXkucHJlcGVuZChvcHBHcmlkKTtcblx0XHR0aGlzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoaXB5YXJkJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2hpcHlhcmQtbWlycm9yJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGlzcGxheScpLnN0eWxlLmZsZXhEaXJlY3Rpb24gPSAnY29sdW1uJztcblx0XHRkaXNwbGF5TXNnKCdCYXR0bGUhJyk7XG5cdH0pO1xuXG5cdC8qIE1vZGFsIEZ1bmN0aW9ucyAqL1xuXHRtb2RhbENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VNb2RhbCk7IC8vIGZvciBYIGNsb3NlXG5cdGJnTW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU1vZGFsKTsgLy8gZm9yIGJhY2tncm91bmQgY2xvc2Vcblx0bW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdGRpc3BsYXlNc2csXG5cdFx0Y2xlYXJNc2dcblx0fTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGRvbU1hbmFnZXI7XG4iLCJpbXBvcnQgZ2FtZUJvYXJkIGZyb20gJy4vZ2FtZUJvYXJkJztcbmltcG9ydCB7IHBsYXllciwgYm90IH0gZnJvbSAnLi9wbGF5ZXInO1xuXG5jb25zdCBnYW1lID0gKCgpID0+IHtcblx0bGV0IHBsYXllcjFUdXJuID0gdHJ1ZTtcblx0Y29uc3QgZ3JpZFNpemUgPSAxMDtcblx0bGV0IHBsYXllcjE7XG5cdGxldCBwbGF5ZXIyO1xuXG5cdGNvbnN0IGJvYXJkMSA9IGdhbWVCb2FyZChncmlkU2l6ZSk7XG5cdGNvbnN0IGJvYXJkMiA9IGdhbWVCb2FyZChncmlkU2l6ZSk7XG5cblx0ZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG5cdFx0aWYgKGJvYXJkMS5hbGxTdW5rKCkgfHwgYm9hcmQyLmFsbFN1bmsoKSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGZ1bmN0aW9uIG5leHRUdXJuKCkge1xuXHRcdHBsYXllcjFUdXJuID0gIXBsYXllcjFUdXJuO1xuXHR9XG5cblx0ZnVuY3Rpb24gc3RhcnRHYW1lKHBsYXllck5hbWUpIHtcblx0XHR0aGlzLnBsYXllcjEgPSBwbGF5ZXIoMCwgcGxheWVyTmFtZSk7XG5cdFx0dGhpcy5wbGF5ZXIyID0gYm90O1xuXHRcdGJvYXJkMi5wbGFjZVNoaXAoWzAsIDBdLCAwKTtcblx0XHRib2FyZDIucGxhY2VTaGlwKFsxLCAwXSwgMSwgZmFsc2UpO1xuXHRcdGJvYXJkMi5wbGFjZVNoaXAoWzMsIDNdLCAyKTtcblx0XHRib2FyZDIucGxhY2VTaGlwKFswLCA5XSwgMywgZmFsc2UpO1xuXHRcdGJvYXJkMi5wbGFjZVNoaXAoWzksIDBdLCA0KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0cGxheWVyMSxcblx0XHRwbGF5ZXIyLFxuXHRcdGJvYXJkMSxcblx0XHRib2FyZDIsXG5cdFx0Z2FtZU92ZXIsXG5cdFx0bmV4dFR1cm4sXG5cdFx0c3RhcnRHYW1lLFxuXHRcdGJvdDogYm90XG5cdH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xuIiwiaW1wb3J0IGRvbU1hbmFnZXIgZnJvbSAnLi9kb21NYW5hZ2VyJztcbmltcG9ydCBzaGlwIGZyb20gJy4vc2hpcCc7XG5cbmZ1bmN0aW9uIGdhbWVCb2FyZChzaXplKSB7XG5cdGNvbnN0IGxlbmd0aHMgPSBbMiwgMywgMywgNCwgNV07XG5cdGNvbnN0IGdyaWQgPSBBcnJheS5mcm9tKEFycmF5KHNpemUpLCAoKSA9PiBuZXcgQXJyYXkoc2l6ZSkuZmlsbCgtMSkpO1xuXHRjb25zdCBzaGlwcyA9IFtdO1xuXHRjb25zdCBzaGlwQ29vcmRpbmF0ZXMgPSBuZXcgQXJyYXkobGVuZ3Rocy5sZW5ndGgpO1xuXHRjb25zdCBob3Jpem9udGFscyA9IG5ldyBBcnJheShsZW5ndGhzLmxlbmd0aCk7XG5cdGNvbnN0IG1pc3NlZEF0dGFja3MgPSBbXTtcblxuXHQvKiBQcmVwb3B1bGF0ZSBzaGlwcyAqL1xuXHRmdW5jdGlvbiBsb2FkU2hpcHMoKSB7XG5cdFx0bGVuZ3Rocy5mb3JFYWNoKChsZW5ndGgsIGluZGV4KSA9PiB7XG5cdFx0XHRzaGlwcy5wdXNoKHNoaXAoaW5kZXgsIGxlbmd0aCkpO1xuXHRcdH0pO1xuXHR9XG5cblx0bG9hZFNoaXBzKCk7XG5cblx0ZnVuY3Rpb24gcGxhY2VTaGlwKGNvb3JkLCBzaGlwSWQsIGhvcml6b250YWwgPSB0cnVlKSB7XG5cdFx0Y29uc3Qgcm93ID0gY29vcmRbMF07XG5cdFx0Y29uc3QgY29sID0gY29vcmRbMV07XG5cdFx0Y29uc3QgbGVuZ3RoID0gbGVuZ3Roc1tzaGlwSWRdO1xuXG5cdFx0Ly8gQ29vcmRpbmF0ZSBWYWxpZGF0aW9uXG5cdFx0aWYgKGhvcml6b250YWwpIHtcblx0XHRcdGlmIChjb2wgKyBsZW5ndGggPiBzaXplKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignT3V0IG9mIGdyaWQgY29sdW1uIHJhbmdlJyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChyb3cgKyBsZW5ndGggPiBzaXplKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignT3V0IG9mIGdyaWQgcm93IHJhbmdlJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y2xlYXJTaGlwKHNoaXBJZCk7XG5cdFx0aWYgKGhvcml6b250YWwpIHtcblx0XHRcdC8vIGhvcml6b250YWxcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHRoaXMuZ3JpZFtyb3ddW2NvbCArIGldICE9IC0xKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBTaGlwOiR7c2hpcElkfSBvdmVybGFwcyBTaGlwOiR7dGhpcy5ncmlkW3Jvd11bY29sICsgaV19YCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5ncmlkW3Jvd11bY29sICsgaV0gPSBzaGlwSWQ7XG5cdFx0XHR9XG5cdFx0XHRob3Jpem9udGFsc1tzaGlwSWRdID0gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gdmVydGljYWxcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHRoaXMuZ3JpZFtyb3cgKyBpXVtjb2xdICE9IC0xKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBTaGlwOiR7c2hpcElkfSBvdmVybGFwcyBTaGlwOiR7dGhpcy5ncmlkW3JvdyArIGldW2NvbF19YCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5ncmlkW3JvdyArIGldW2NvbF0gPSBzaGlwSWQ7XG5cdFx0XHR9XG5cdFx0XHRob3Jpem9udGFsc1tzaGlwSWRdID0gZmFsc2U7XG5cdFx0fVxuXHRcdHNoaXBDb29yZGluYXRlc1tzaGlwSWRdID0gW3JvdywgY29sXTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNsZWFyU2hpcChzaGlwSWQpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGdyaWQubGVuZ3RoOyBpKyspIHtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgZ3JpZC5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRpZiAoZ3JpZFtpXVtqXSA9PSBzaGlwSWQpIHtcblx0XHRcdFx0XHRncmlkW2ldW2pdID0gLTE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZWNlaXZlQXR0YWNrKGNvb3JkKSB7XG5cdFx0Y29uc3Qgcm93ID0gY29vcmRbMF07XG5cdFx0Y29uc3QgY29sID0gY29vcmRbMV07XG5cdFx0Y29uc3QgaWQgPSB0aGlzLmdyaWRbcm93XVtjb2xdO1xuXHRcdGlmIChpZCA9PSAtMSkge1xuXHRcdFx0bWlzc2VkQXR0YWNrcy5wdXNoKGNvb3JkKTtcblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cdFx0Y29uc3QgYXR0YWNrZWRTaGlwID0gc2hpcHNbaWRdO1xuXHRcdGNvbnN0IGhpdFBvc2l0aW9uID0gcm93IC0gc2hpcENvb3JkaW5hdGVzW2lkXVswXSArIGNvbCAtIHNoaXBDb29yZGluYXRlc1tpZF1bMV07XG5cdFx0YXR0YWNrZWRTaGlwLmhpdChoaXRQb3NpdGlvbik7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblxuXHRmdW5jdGlvbiBhbGxTdW5rKCkge1xuXHRcdGNvbnN0IGFmbG9hdCA9IHNoaXBzLnNvbWUoKHNoaXApID0+ICFzaGlwLmlzU3VuaygpKTtcblx0XHRpZiAoYWZsb2F0KSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2xlYXIoKSB7XG5cdFx0dGhpcy5ncmlkID0gQXJyYXkuZnJvbShBcnJheShzaXplKSwgKCkgPT4gbmV3IEFycmF5KHNpemUpLmZpbGwoLTEpKTtcblx0XHR0aGlzLnNoaXBzID0gW107XG5cdFx0dGhpcy5zaGlwQ29vcmRpbmF0ZXMgPSBuZXcgQXJyYXkobGVuZ3Rocy5sZW5ndGgpO1xuXHRcdHRoaXMuaG9yaXpvbnRhbHMgPSBuZXcgQXJyYXkobGVuZ3Rocy5sZW5ndGgpO1xuXHRcdHRoaXMubWlzc2VkQXR0YWNrcyA9IFtdO1xuXHRcdGxvYWRTaGlwcygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRsZW5ndGhzLFxuXHRcdGdyaWQsXG5cdFx0c2hpcHMsXG5cdFx0c2hpcENvb3JkaW5hdGVzLFxuXHRcdGhvcml6b250YWxzLFxuXHRcdHBsYWNlU2hpcCxcblx0XHRyZWNlaXZlQXR0YWNrLFxuXHRcdG1pc3NlZEF0dGFja3MsXG5cdFx0YWxsU3Vuayxcblx0XHRjbGVhclxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnYW1lQm9hcmQ7XG4iLCJpbXBvcnQgZG9tTWFuYWdlciBmcm9tICcuL2RvbU1hbmFnZXInO1xuaW1wb3J0IGdhbWVCb2FyZCBmcm9tICcuL2dhbWVCb2FyZCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGF5ZXIoaWQsIG5hbWUpIHtcblx0Y29uc3QgYm9hcmRTaXplID0gMTA7XG5cdGNvbnN0IG15Qm9hcmQgPSBnYW1lQm9hcmQoYm9hcmRTaXplKTtcblx0ZnVuY3Rpb24gcGxheVR1cm4oY29vcmQsIG9wcEJvYXJkKSB7XG5cdFx0bGV0IGEgPSBvcHBCb2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkKTtcblx0XHRpZiAoYSkge1xuXHRcdFx0ZG9tTWFuYWdlci5kaXNwbGF5TXNnKCdCYXR0bGUhJywgJ0F3dywgeW91IG1pc3NlZC4uLicpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkb21NYW5hZ2VyLmRpc3BsYXlNc2coJ0JhdHRsZSEnLCBcIlllYWggYmFieSwgdGhhdCdzIGEgaGl0IVwiKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGlkLFxuXHRcdG5hbWUsXG5cdFx0bXlCb2FyZCxcblx0XHRwbGF5VHVyblxuXHR9O1xufVxuXG5leHBvcnQgdmFyIGJvdCA9IE9iamVjdC5jcmVhdGUocGxheWVyKC0xLCAnYm90JyksIHtcblx0YXR0YWNrTG9nOiB7XG5cdFx0dmFsdWU6IFtdXG5cdH0sXG5cdHBpY2tDb29yZDoge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRjb25zdCBtYXggPSB0aGlzLm15Qm9hcmQuZ3JpZC5sZW5ndGg7XG5cdFx0XHRsZXQgcm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcblx0XHRcdGxldCBjb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuXHRcdFx0ZG8ge1xuXHRcdFx0XHRyb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuXHRcdFx0XHRjb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuXHRcdFx0fSB3aGlsZSAodGhpcy5hdHRhY2tMb2cuaW5jbHVkZXMoW3JvdywgY29sXSkpO1xuXG5cdFx0XHR0aGlzLmF0dGFja0xvZy5wdXNoKFtyb3csIGNvbF0pO1xuXHRcdFx0cmV0dXJuIFtyb3csIGNvbF07XG5cdFx0fVxuXHR9LFxuXHRwbGF5VHVybjoge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAob3BwQm9hcmQpIHtcblx0XHRcdGNvbnN0IHRhcmdldCA9IHRoaXMucGlja0Nvb3JkKCk7XG5cdFx0XHRyZXR1cm4gb3BwQm9hcmQucmVjZWl2ZUF0dGFjayh0YXJnZXQpO1xuXHRcdH1cblx0fVxufSk7XG4iLCJmdW5jdGlvbiBzaGlwKGlkLCBsZW5ndGgpIHtcblx0Y29uc3QgaGl0cyA9IEFycmF5KGxlbmd0aCkuZmlsbCgwKTtcblxuXHRmdW5jdGlvbiBpc1N1bmsoKSB7XG5cdFx0cmV0dXJuIGhpdHMuaW5jbHVkZXMoMCkgPyBmYWxzZSA6IHRydWU7XG5cdH1cblx0ZnVuY3Rpb24gaGl0KHBvcykge1xuXHRcdGhpdHNbcG9zXSA9IDE7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGlkLFxuXHRcdGxlbmd0aCxcblx0XHRoaXRzLFxuXHRcdGhpdCxcblx0XHRpc1N1bmtcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2hpcDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGRvbU1hbmFnZXIgZnJvbSAnLi9kb21NYW5hZ2VyJztcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZSc7XG5cbmNvbnN0IG5hbWVJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwbGF5ZXItbmFtZScpO1xubmFtZUlucHV0LmZvY3VzKCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9