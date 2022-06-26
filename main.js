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
		const oppBoard = _game__WEBPACK_IMPORTED_MODULE_0__["default"].board2;
		const myBoard = _game__WEBPACK_IMPORTED_MODULE_0__["default"].board1;
		const myDisplay = document.querySelectorAll('.board1');
		const oppDisplay = document.querySelectorAll('.board2');
		_game__WEBPACK_IMPORTED_MODULE_0__["default"].player1.playTurn([row, col], oppBoard);
		oppDisplay.forEach((display) => {
			displayMissedAttacks(oppBoard, display);
			displayShipAttacks(oppBoard, display);
		});
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
		_game__WEBPACK_IMPORTED_MODULE_0__["default"].board1.placeShip([row, col], shipIndex, horizontal);
		displayShips(_game__WEBPACK_IMPORTED_MODULE_0__["default"].board1, document.querySelector('.grid'));
		const nextShip = _game__WEBPACK_IMPORTED_MODULE_0__["default"].board1.shipCoordinates.findIndex((element) => element == undefined);
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
		_game__WEBPACK_IMPORTED_MODULE_0__["default"].startGame(name);
		this.parentElement.style.display = 'none';
		this.reset();
		const myGrid = createGrid(_game__WEBPACK_IMPORTED_MODULE_0__["default"].board1);
		myGrid.classList.add('board1');
		Array.from(myGrid.children).forEach((cell) => {
			cell.addEventListener('click', placementCell);
		});
		display.append(myGrid);
		content.style.display = 'flex';
		e.preventDefault();
	});

	battle.addEventListener('click', () => {
		if (_game__WEBPACK_IMPORTED_MODULE_0__["default"].board1.shipCoordinates.includes(undefined)) {
			console.log('Must place all ships first');
			return;
		}

		const grid = document.querySelector('.grid');
		Array.from(grid.children).forEach((cell) => {
			cell.removeEventListener('click', placementCell);
		});

		const oppGrid = createGrid(_game__WEBPACK_IMPORTED_MODULE_0__["default"].board2);
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
/* harmony import */ var _domManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domManager */ "./src/domManager.js");
/* harmony import */ var _gameBoard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameBoard */ "./src/gameBoard.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./player */ "./src/player.js");




const game = (() => {
	let player1Turn = true;
	const gridSize = 10;
	let player1;
	let player2;

	const board1 = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_1__["default"])(gridSize);
	const board2 = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_1__["default"])(gridSize);

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
		this.player1 = (0,_player__WEBPACK_IMPORTED_MODULE_2__.player)(0, playerName);
		this.player2 = _player__WEBPACK_IMPORTED_MODULE_2__.bot;
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
		bot: _player__WEBPACK_IMPORTED_MODULE_2__.bot
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
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");


function gameBoard(size) {
	const lengths = [2, 3, 3, 4, 5];
	const grid = Array.from(Array(size), () => new Array(size).fill(-1));
	const ships = [];
	const shipCoordinates = new Array(lengths.length);
	const horizontals = [];
	const missedAttacks = [];

	lengths.forEach((length, index) => {
		ships.push((0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(index, length));
	});

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
		this.missedAttacks = [];
	}

	return {
		grid,
		ships,
		shipCoordinates,
		horizontals,
		lengths,
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
/* harmony import */ var _gameBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameBoard */ "./src/gameBoard.js");


function player(id, name) {
	const boardSize = 10;
	const myBoard = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_0__["default"])(boardSize);
	function playTurn(coord, oppBoard) {
		oppBoard.receiveAttack(coord);
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



// domManager.displayStart();
/* const display = document.querySelector('.display');
domManager.displayGrid(display); */
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLElBQUksRUFBQzs7Ozs7OztVQ25CcEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOc0M7QUFDWjs7QUFFMUI7QUFDQTtBQUNBLGlDQUFpQyxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb21NYW5hZ2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdhbWUgZnJvbSAnLi9nYW1lJztcblxuY29uc3QgZG9tTWFuYWdlciA9IChmdW5jdGlvbiAoKSB7XG5cdGNvbnN0IHN0YXJ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXJ0Jyk7XG5cdGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudCcpO1xuXHRjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9ybScpO1xuXHRjb25zdCBkaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRpc3BsYXknKTtcblx0Y29uc3QgYmF0dGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJhdHRsZScpO1xuXHRjb25zdCBiZ01vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJnLW1vZGFsJyk7XG5cdGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsJyk7XG5cdGNvbnN0IG1vZGFsQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xvc2UnKTtcblxuXHRmdW5jdGlvbiBzaW5nbGVQbGF5ZXJDZWxsKCkge1xuXHRcdGlmICh0aGlzLmNsYXNzTGlzdC5jb250YWlucygnaGl0JykgfHwgdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ21pc3MnKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRjb25zdCByb3cgPSBwYXJzZUludCh0aGlzLmdldEF0dHJpYnV0ZSgncm93JykpO1xuXHRcdGNvbnN0IGNvbCA9IHBhcnNlSW50KHRoaXMuZ2V0QXR0cmlidXRlKCdjb2wnKSk7XG5cdFx0Y29uc3Qgb3BwQm9hcmQgPSBnYW1lLmJvYXJkMjtcblx0XHRjb25zdCBteUJvYXJkID0gZ2FtZS5ib2FyZDE7XG5cdFx0Y29uc3QgbXlEaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkMScpO1xuXHRcdGNvbnN0IG9wcERpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9hcmQyJyk7XG5cdFx0Z2FtZS5wbGF5ZXIxLnBsYXlUdXJuKFtyb3csIGNvbF0sIG9wcEJvYXJkKTtcblx0XHRvcHBEaXNwbGF5LmZvckVhY2goKGRpc3BsYXkpID0+IHtcblx0XHRcdGRpc3BsYXlNaXNzZWRBdHRhY2tzKG9wcEJvYXJkLCBkaXNwbGF5KTtcblx0XHRcdGRpc3BsYXlTaGlwQXR0YWNrcyhvcHBCb2FyZCwgZGlzcGxheSk7XG5cdFx0fSk7XG5cdFx0Z2FtZS5ib3QucGxheVR1cm4obXlCb2FyZCk7XG5cdFx0bXlEaXNwbGF5LmZvckVhY2goKGRpc3BsYXkpID0+IHtcblx0XHRcdGRpc3BsYXlNaXNzZWRBdHRhY2tzKG15Qm9hcmQsIGRpc3BsYXkpO1xuXHRcdFx0ZGlzcGxheVNoaXBBdHRhY2tzKG15Qm9hcmQsIGRpc3BsYXkpO1xuXHRcdH0pO1xuXG5cdFx0aWYgKGdhbWUuZ2FtZU92ZXIoKSkge1xuXHRcdFx0YmdNb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWVzc2FnZScpO1xuXHRcdFx0bWVzc2FnZS50ZXh0Q29udGVudCA9ICdHYW1lIE92ZXInO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNvbnRhaW5lciguLi5jbGFzc2VzKSB7XG5cdFx0Y29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0Y2xhc3Nlcy5mb3JFYWNoKChlbGVtZW50KSA9PiBjb250YWluZXIuY2xhc3NMaXN0LmFkZChlbGVtZW50KSk7XG5cdFx0cmV0dXJuIGNvbnRhaW5lcjtcblx0fVxuXG5cdGZ1bmN0aW9uIGNlbGxFbGVtZW50KHJvdywgY29sKSB7XG5cdFx0Y29uc3QgZWxlbWVudCA9IGNvbnRhaW5lcignY2VsbCcpO1xuXHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCdyb3cnLCByb3cpO1xuXHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjb2wnLCBjb2wpO1xuXHRcdHJldHVybiBlbGVtZW50O1xuXHR9XG5cblx0ZnVuY3Rpb24gY3JlYXRlR3JpZChib2FyZCkge1xuXHRcdGNvbnN0IGdyaWQgPSBjb250YWluZXIoJ2dyaWQnKTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQuZ3JpZC5sZW5ndGg7IGkrKykge1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBib2FyZC5ncmlkLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGNvbnN0IGNlbGwgPSBjZWxsRWxlbWVudChpLCBqKTtcblx0XHRcdFx0Z3JpZC5hcHBlbmQoY2VsbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBncmlkO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcGxheUdyaWQoY29udGFpbmVyLCBib2FyZCkge1xuXHRcdGNvbnRhaW5lci5hcHBlbmQoY3JlYXRlR3JpZChib2FyZCkpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcGxheVNoaXBBdHRhY2tzKGJvYXJkLCBncmlkKSB7XG5cdFx0Ym9hcmQuc2hpcHMuZm9yRWFjaCgoc2hpcCwgc2hpcElkKSA9PiB7XG5cdFx0XHRzaGlwLmhpdHMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PSAxKSB7XG5cdFx0XHRcdFx0aWYgKGJvYXJkLmhvcml6b250YWxzW3NoaXBJZF0pIHtcblx0XHRcdFx0XHRcdGNvbnN0IGNlbGwgPSBncmlkLnF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdFx0XHRcdGBbcm93PVwiJHtib2FyZC5zaGlwQ29vcmRpbmF0ZXNbc2hpcElkXVswXX1cIl1bY29sPVwiJHtcblx0XHRcdFx0XHRcdFx0XHRib2FyZC5zaGlwQ29vcmRpbmF0ZXNbc2hpcElkXVsxXSArIGluZGV4XG5cdFx0XHRcdFx0XHRcdH1cIl1gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0Y2VsbC5jbGFzc0xpc3QudG9nZ2xlKCdoaXQnLCB0cnVlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgY2VsbCA9IGdyaWQucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0XHRcdFx0YFtyb3c9XCIke2JvYXJkLnNoaXBDb29yZGluYXRlc1tzaGlwSWRdWzBdICsgaW5kZXh9XCJdW2NvbD1cIiR7XG5cdFx0XHRcdFx0XHRcdFx0Ym9hcmQuc2hpcENvb3JkaW5hdGVzW3NoaXBJZF1bMV1cblx0XHRcdFx0XHRcdFx0fVwiXWBcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRjZWxsLmNsYXNzTGlzdC50b2dnbGUoJ2hpdCcsIHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwbGF5TWlzc2VkQXR0YWNrcyhib2FyZCwgZ3JpZCkge1xuXHRcdGJvYXJkLm1pc3NlZEF0dGFja3MuZm9yRWFjaCgoY29vcmQpID0+IHtcblx0XHRcdGNvbnN0IGNlbGwgPSBncmlkLnF1ZXJ5U2VsZWN0b3IoYFtyb3c9XCIke2Nvb3JkWzBdfVwiXVtjb2w9XCIke2Nvb3JkWzFdfVwiXWApO1xuXHRcdFx0Y2VsbC5jbGFzc0xpc3QudG9nZ2xlKCdtaXNzJywgdHJ1ZSk7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBwbGFjZW1lbnRDZWxsKCkge1xuXHRcdGNvbnN0IHJvdyA9IHBhcnNlSW50KHRoaXMuZ2V0QXR0cmlidXRlKCdyb3cnKSk7XG5cdFx0Y29uc3QgY29sID0gcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoJ2NvbCcpKTtcblx0XHRjb25zdCBjaGVja2VkT3B0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInNoaXAtb3B0aW9uXCJdOmNoZWNrZWQnKTtcblx0XHRjb25zdCBzaGlwSW5kZXggPSBwYXJzZUludChjaGVja2VkT3B0aW9uLnZhbHVlKTtcblx0XHRjb25zdCBob3Jpem9udGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykuY2hlY2tlZDtcblx0XHRnYW1lLmJvYXJkMS5wbGFjZVNoaXAoW3JvdywgY29sXSwgc2hpcEluZGV4LCBob3Jpem9udGFsKTtcblx0XHRkaXNwbGF5U2hpcHMoZ2FtZS5ib2FyZDEsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkJykpO1xuXHRcdGNvbnN0IG5leHRTaGlwID0gZ2FtZS5ib2FyZDEuc2hpcENvb3JkaW5hdGVzLmZpbmRJbmRleCgoZWxlbWVudCkgPT4gZWxlbWVudCA9PSB1bmRlZmluZWQpO1xuXHRcdGlmIChuZXh0U2hpcCA9PSAtMSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBpbnB1dFt0eXBlPVwicmFkaW9cIl1bdmFsdWU9XCIke25leHRTaGlwfVwiXWApLmNoZWNrZWQgPSB0cnVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcGxheVNoaXBzKGJvYXJkLCBkaXNwbGF5KSB7XG5cdFx0Y2xlYXJHcmlkKGRpc3BsYXkpO1xuXHRcdGJvYXJkLnNoaXBDb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCwgaWQpID0+IHtcblx0XHRcdGlmIChjb29yZCkge1xuXHRcdFx0XHRjb25zdCBzaGlwUm93ID0gY29vcmRbMF07XG5cdFx0XHRcdGNvbnN0IHNoaXBDb2wgPSBjb29yZFsxXTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5sZW5ndGhzW2lkXTsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKGJvYXJkLmhvcml6b250YWxzW2lkXSkge1xuXHRcdFx0XHRcdFx0Y29uc3QgY2VsbCA9IGRpc3BsYXkucXVlcnlTZWxlY3RvcihgW3Jvdz1cIiR7c2hpcFJvd31cIl1bY29sPVwiJHtzaGlwQ29sICsgaX1cIl1gKTtcblx0XHRcdFx0XHRcdGNlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBjZWxsID0gZGlzcGxheS5xdWVyeVNlbGVjdG9yKGBbcm93PVwiJHtzaGlwUm93ICsgaX1cIl1bY29sPVwiJHtzaGlwQ29sfVwiXWApO1xuXHRcdFx0XHRcdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBjbGVhckdyaWQoZGlzcGxheSkge1xuXHRcdGRpc3BsYXkuY2hpbGROb2Rlcy5mb3JFYWNoKChjZWxsKSA9PiB7XG5cdFx0XHRjZWxsLmNsYXNzTGlzdC50b2dnbGUoJ3NoaXAnLCBmYWxzZSk7XG5cdFx0fSk7XG5cdH1cblxuXHRjb25zdCBjbG9zZU1vZGFsID0gKCkgPT4ge1xuXHRcdGJnTW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0fTtcblxuXHRmdW5jdGlvbiBkaXNwbGF5U3RhcnQoKSB7XG5cdFx0c3RhcnQuc3R5bGUuZGlzcGxheSA9ICdmbGV4Jztcblx0fVxuXG5cdC8qIEV2ZW50bGlzdGVuZXJzICovXG5cdGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcblx0XHRjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllci1uYW1lJykudmFsdWU7XG5cdFx0Z2FtZS5zdGFydEdhbWUobmFtZSk7XG5cdFx0dGhpcy5wYXJlbnRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0dGhpcy5yZXNldCgpO1xuXHRcdGNvbnN0IG15R3JpZCA9IGNyZWF0ZUdyaWQoZ2FtZS5ib2FyZDEpO1xuXHRcdG15R3JpZC5jbGFzc0xpc3QuYWRkKCdib2FyZDEnKTtcblx0XHRBcnJheS5mcm9tKG15R3JpZC5jaGlsZHJlbikuZm9yRWFjaCgoY2VsbCkgPT4ge1xuXHRcdFx0Y2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHBsYWNlbWVudENlbGwpO1xuXHRcdH0pO1xuXHRcdGRpc3BsYXkuYXBwZW5kKG15R3JpZCk7XG5cdFx0Y29udGVudC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0fSk7XG5cblx0YmF0dGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdGlmIChnYW1lLmJvYXJkMS5zaGlwQ29vcmRpbmF0ZXMuaW5jbHVkZXModW5kZWZpbmVkKSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ011c3QgcGxhY2UgYWxsIHNoaXBzIGZpcnN0Jyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZ3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkJyk7XG5cdFx0QXJyYXkuZnJvbShncmlkLmNoaWxkcmVuKS5mb3JFYWNoKChjZWxsKSA9PiB7XG5cdFx0XHRjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcGxhY2VtZW50Q2VsbCk7XG5cdFx0fSk7XG5cblx0XHRjb25zdCBvcHBHcmlkID0gY3JlYXRlR3JpZChnYW1lLmJvYXJkMik7XG5cdFx0b3BwR3JpZC5jbGFzc0xpc3QuYWRkKCdib2FyZDInKTtcblx0XHRBcnJheS5mcm9tKG9wcEdyaWQuY2hpbGRyZW4pLmZvckVhY2goKGNlbGwpID0+IHtcblx0XHRcdGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzaW5nbGVQbGF5ZXJDZWxsKTtcblx0XHR9KTtcblx0XHRkaXNwbGF5LnByZXBlbmQob3BwR3JpZCk7XG5cdH0pO1xuXG5cdC8qIE1vZGFsIEZ1bmN0aW9ucyAqL1xuXHRtb2RhbENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VNb2RhbCk7IC8vIGZvciBYIGNsb3NlXG5cdGJnTW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU1vZGFsKTsgLy8gZm9yIGJhY2tncm91bmQgY2xvc2Vcblx0bW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdGRpc3BsYXlHcmlkLFxuXHRcdGRpc3BsYXlTaGlwcyxcblx0XHRjbGVhckdyaWQsXG5cdFx0Y2xvc2VNb2RhbFxuXHR9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgZG9tTWFuYWdlcjtcbiIsImltcG9ydCBkb21NYW5hZ2VyIGZyb20gJy4vZG9tTWFuYWdlcic7XG5pbXBvcnQgZ2FtZUJvYXJkIGZyb20gJy4vZ2FtZUJvYXJkJztcbmltcG9ydCB7IHBsYXllciwgYm90IH0gZnJvbSAnLi9wbGF5ZXInO1xuXG5jb25zdCBnYW1lID0gKCgpID0+IHtcblx0bGV0IHBsYXllcjFUdXJuID0gdHJ1ZTtcblx0Y29uc3QgZ3JpZFNpemUgPSAxMDtcblx0bGV0IHBsYXllcjE7XG5cdGxldCBwbGF5ZXIyO1xuXG5cdGNvbnN0IGJvYXJkMSA9IGdhbWVCb2FyZChncmlkU2l6ZSk7XG5cdGNvbnN0IGJvYXJkMiA9IGdhbWVCb2FyZChncmlkU2l6ZSk7XG5cblx0ZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG5cdFx0aWYgKGJvYXJkMS5hbGxTdW5rKCkgfHwgYm9hcmQyLmFsbFN1bmsoKSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGZ1bmN0aW9uIG5leHRUdXJuKCkge1xuXHRcdHBsYXllcjFUdXJuID0gIXBsYXllcjFUdXJuO1xuXHR9XG5cblx0ZnVuY3Rpb24gc3RhcnRHYW1lKHBsYXllck5hbWUpIHtcblx0XHR0aGlzLnBsYXllcjEgPSBwbGF5ZXIoMCwgcGxheWVyTmFtZSk7XG5cdFx0dGhpcy5wbGF5ZXIyID0gYm90O1xuXHRcdGJvYXJkMi5wbGFjZVNoaXAoWzAsIDBdLCAwKTtcblx0XHRib2FyZDIucGxhY2VTaGlwKFsxLCAwXSwgMSwgZmFsc2UpO1xuXHRcdGJvYXJkMi5wbGFjZVNoaXAoWzMsIDNdLCAyKTtcblx0XHRib2FyZDIucGxhY2VTaGlwKFswLCA5XSwgMywgZmFsc2UpO1xuXHRcdGJvYXJkMi5wbGFjZVNoaXAoWzksIDBdLCA0KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0cGxheWVyMSxcblx0XHRwbGF5ZXIyLFxuXHRcdGJvYXJkMSxcblx0XHRib2FyZDIsXG5cdFx0Z2FtZU92ZXIsXG5cdFx0bmV4dFR1cm4sXG5cdFx0c3RhcnRHYW1lLFxuXHRcdGJvdDogYm90XG5cdH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xuIiwiaW1wb3J0IHNoaXAgZnJvbSAnLi9zaGlwJztcblxuZnVuY3Rpb24gZ2FtZUJvYXJkKHNpemUpIHtcblx0Y29uc3QgbGVuZ3RocyA9IFsyLCAzLCAzLCA0LCA1XTtcblx0Y29uc3QgZ3JpZCA9IEFycmF5LmZyb20oQXJyYXkoc2l6ZSksICgpID0+IG5ldyBBcnJheShzaXplKS5maWxsKC0xKSk7XG5cdGNvbnN0IHNoaXBzID0gW107XG5cdGNvbnN0IHNoaXBDb29yZGluYXRlcyA9IG5ldyBBcnJheShsZW5ndGhzLmxlbmd0aCk7XG5cdGNvbnN0IGhvcml6b250YWxzID0gW107XG5cdGNvbnN0IG1pc3NlZEF0dGFja3MgPSBbXTtcblxuXHRsZW5ndGhzLmZvckVhY2goKGxlbmd0aCwgaW5kZXgpID0+IHtcblx0XHRzaGlwcy5wdXNoKHNoaXAoaW5kZXgsIGxlbmd0aCkpO1xuXHR9KTtcblxuXHRmdW5jdGlvbiBwbGFjZVNoaXAoY29vcmQsIHNoaXBJZCwgaG9yaXpvbnRhbCA9IHRydWUpIHtcblx0XHRjb25zdCByb3cgPSBjb29yZFswXTtcblx0XHRjb25zdCBjb2wgPSBjb29yZFsxXTtcblx0XHRjb25zdCBsZW5ndGggPSBsZW5ndGhzW3NoaXBJZF07XG5cblx0XHQvLyBDb29yZGluYXRlIFZhbGlkYXRpb25cblx0XHRpZiAoaG9yaXpvbnRhbCkge1xuXHRcdFx0aWYgKGNvbCArIGxlbmd0aCA+IHNpemUpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdPdXQgb2YgZ3JpZCBjb2x1bW4gcmFuZ2UnKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHJvdyArIGxlbmd0aCA+IHNpemUpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdPdXQgb2YgZ3JpZCByb3cgcmFuZ2UnKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjbGVhclNoaXAoc2hpcElkKTtcblx0XHRpZiAoaG9yaXpvbnRhbCkge1xuXHRcdFx0Ly8gaG9yaXpvbnRhbFxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAodGhpcy5ncmlkW3Jvd11bY29sICsgaV0gIT0gLTEpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFNoaXA6JHtzaGlwSWR9IG92ZXJsYXBzIFNoaXA6JHt0aGlzLmdyaWRbcm93XVtjb2wgKyBpXX1gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmdyaWRbcm93XVtjb2wgKyBpXSA9IHNoaXBJZDtcblx0XHRcdH1cblx0XHRcdGhvcml6b250YWxzW3NoaXBJZF0gPSB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyB2ZXJ0aWNhbFxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAodGhpcy5ncmlkW3JvdyArIGldW2NvbF0gIT0gLTEpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFNoaXA6JHtzaGlwSWR9IG92ZXJsYXBzIFNoaXA6JHt0aGlzLmdyaWRbcm93ICsgaV1bY29sXX1gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmdyaWRbcm93ICsgaV1bY29sXSA9IHNoaXBJZDtcblx0XHRcdH1cblx0XHRcdGhvcml6b250YWxzW3NoaXBJZF0gPSBmYWxzZTtcblx0XHR9XG5cdFx0c2hpcENvb3JkaW5hdGVzW3NoaXBJZF0gPSBbcm93LCBjb2xdO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2xlYXJTaGlwKHNoaXBJZCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgZ3JpZC5sZW5ndGg7IGkrKykge1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBncmlkLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGlmIChncmlkW2ldW2pdID09IHNoaXBJZCkge1xuXHRcdFx0XHRcdGdyaWRbaV1bal0gPSAtMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soY29vcmQpIHtcblx0XHRjb25zdCByb3cgPSBjb29yZFswXTtcblx0XHRjb25zdCBjb2wgPSBjb29yZFsxXTtcblx0XHRjb25zdCBpZCA9IHRoaXMuZ3JpZFtyb3ddW2NvbF07XG5cdFx0aWYgKGlkID09IC0xKSB7XG5cdFx0XHRtaXNzZWRBdHRhY2tzLnB1c2goY29vcmQpO1xuXHRcdFx0cmV0dXJuIC0xO1xuXHRcdH1cblx0XHRjb25zdCBhdHRhY2tlZFNoaXAgPSBzaGlwc1tpZF07XG5cdFx0Y29uc3QgaGl0UG9zaXRpb24gPSByb3cgLSBzaGlwQ29vcmRpbmF0ZXNbaWRdWzBdICsgY29sIC0gc2hpcENvb3JkaW5hdGVzW2lkXVsxXTtcblx0XHRhdHRhY2tlZFNoaXAuaGl0KGhpdFBvc2l0aW9uKTtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdGZ1bmN0aW9uIGFsbFN1bmsoKSB7XG5cdFx0Y29uc3QgYWZsb2F0ID0gc2hpcHMuc29tZSgoc2hpcCkgPT4gIXNoaXAuaXNTdW5rKCkpO1xuXHRcdGlmIChhZmxvYXQpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRmdW5jdGlvbiBjbGVhcigpIHtcblx0XHR0aGlzLmdyaWQgPSBBcnJheS5mcm9tKEFycmF5KHNpemUpLCAoKSA9PiBuZXcgQXJyYXkoc2l6ZSkuZmlsbCgtMSkpO1xuXHRcdHRoaXMuc2hpcHMgPSBbXTtcblx0XHR0aGlzLm1pc3NlZEF0dGFja3MgPSBbXTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0Z3JpZCxcblx0XHRzaGlwcyxcblx0XHRzaGlwQ29vcmRpbmF0ZXMsXG5cdFx0aG9yaXpvbnRhbHMsXG5cdFx0bGVuZ3Rocyxcblx0XHRwbGFjZVNoaXAsXG5cdFx0cmVjZWl2ZUF0dGFjayxcblx0XHRtaXNzZWRBdHRhY2tzLFxuXHRcdGFsbFN1bmssXG5cdFx0Y2xlYXJcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2FtZUJvYXJkO1xuIiwiaW1wb3J0IGdhbWVCb2FyZCBmcm9tICcuL2dhbWVCb2FyZCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGF5ZXIoaWQsIG5hbWUpIHtcblx0Y29uc3QgYm9hcmRTaXplID0gMTA7XG5cdGNvbnN0IG15Qm9hcmQgPSBnYW1lQm9hcmQoYm9hcmRTaXplKTtcblx0ZnVuY3Rpb24gcGxheVR1cm4oY29vcmQsIG9wcEJvYXJkKSB7XG5cdFx0b3BwQm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZCk7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRpZCxcblx0XHRuYW1lLFxuXHRcdG15Qm9hcmQsXG5cdFx0cGxheVR1cm5cblx0fTtcbn1cblxuZXhwb3J0IHZhciBib3QgPSBPYmplY3QuY3JlYXRlKHBsYXllcigtMSwgJ2JvdCcpLCB7XG5cdGF0dGFja0xvZzoge1xuXHRcdHZhbHVlOiBbXVxuXHR9LFxuXHRwaWNrQ29vcmQ6IHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0Y29uc3QgbWF4ID0gdGhpcy5teUJvYXJkLmdyaWQubGVuZ3RoO1xuXHRcdFx0bGV0IHJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XG5cdFx0XHRsZXQgY29sID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcblx0XHRcdGRvIHtcblx0XHRcdFx0cm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcblx0XHRcdFx0Y29sID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcblx0XHRcdH0gd2hpbGUgKHRoaXMuYXR0YWNrTG9nLmluY2x1ZGVzKFtyb3csIGNvbF0pKTtcblxuXHRcdFx0dGhpcy5hdHRhY2tMb2cucHVzaChbcm93LCBjb2xdKTtcblx0XHRcdHJldHVybiBbcm93LCBjb2xdO1xuXHRcdH1cblx0fSxcblx0cGxheVR1cm46IHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKG9wcEJvYXJkKSB7XG5cdFx0XHRjb25zdCB0YXJnZXQgPSB0aGlzLnBpY2tDb29yZCgpO1xuXHRcdFx0cmV0dXJuIG9wcEJvYXJkLnJlY2VpdmVBdHRhY2sodGFyZ2V0KTtcblx0XHR9XG5cdH1cbn0pO1xuIiwiZnVuY3Rpb24gc2hpcChpZCwgbGVuZ3RoKSB7XG5cdGNvbnN0IGhpdHMgPSBBcnJheShsZW5ndGgpLmZpbGwoMCk7XG5cblx0ZnVuY3Rpb24gaXNTdW5rKCkge1xuXHRcdHJldHVybiBoaXRzLmluY2x1ZGVzKDApID8gZmFsc2UgOiB0cnVlO1xuXHR9XG5cdGZ1bmN0aW9uIGhpdChwb3MpIHtcblx0XHRoaXRzW3Bvc10gPSAxO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpZCxcblx0XHRsZW5ndGgsXG5cdFx0aGl0cyxcblx0XHRoaXQsXG5cdFx0aXNTdW5rXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNoaXA7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBkb21NYW5hZ2VyIGZyb20gJy4vZG9tTWFuYWdlcic7XG5pbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xuXG4vLyBkb21NYW5hZ2VyLmRpc3BsYXlTdGFydCgpO1xuLyogY29uc3QgZGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kaXNwbGF5Jyk7XG5kb21NYW5hZ2VyLmRpc3BsYXlHcmlkKGRpc3BsYXkpOyAqLyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==