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
		p1View.append(displayGrid(_game__WEBPACK_IMPORTED_MODULE_0__["default"].board2, 'board2', true));
		p1View.append(displayGrid(_game__WEBPACK_IMPORTED_MODULE_0__["default"].board1, 'board1'));

		p2View.append(displayGrid(_game__WEBPACK_IMPORTED_MODULE_0__["default"].board1, 'board1', true));
		p2View.append(displayGrid(_game__WEBPACK_IMPORTED_MODULE_0__["default"].board2, 'board2'));
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
	const player1 = (0,_player__WEBPACK_IMPORTED_MODULE_2__.player)(0, 'p1');
	const player2 = (0,_player__WEBPACK_IMPORTED_MODULE_2__.player)(1, 'p2');

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
	let grid = Array.from(Array(size), () => new Array(size).fill(-1));
	let ships = [];
	let missedAttacks = [];

	function placeShip(coord, length, orientation = true) {
		let row = coord[0];
		let col = coord[1];

		if (row < 0 || col < 0) {
			throw new Error('Out of grid range');
		}

		let battleship = (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(coord, length);

		if (orientation) {
			// horizontal
			if (col + length > size) {
				throw new Error('Out of grid range');
			}
			for (let i = 0; i < length; i++) {
				if (this.grid[row][col + i] != -1) {
					throw new Error(`${battleship.id} overlaps ${this.grid[row][col + i]} ship`);
				}
				this.grid[row][col + i] = battleship.id;
			}
		} else {
			// vertical
			if (row + length > size) {
				throw new Error('Out of grid range');
			}
			for (let i = 0; i < length; i++) {
				if (this.grid[row + i][col] != -1) {
					throw new Error(`${battleship.id} overlaps ${this.grid[row + i][col]} ship`);
				}
				this.grid[row + i][col] = battleship.id;
			}
		}
		ships.push({ shipObj: battleship, orientation });
	}

	function receiveAttack(coord) {
		const row = coord[0];
		const col = coord[1];
		const value = this.grid[row][col];
		if (value == -1) {
			missedAttacks.push(coord);
			return;
		}
		const attackedShip = ships.find((ship) => ship.shipObj.id == value);
		const hitPosition = row - value[0] + col - value[1];
		attackedShip.shipObj.hit(hitPosition);
		return 0;
	}

	function allSunk() {
		const afloat = ships.some((element) => !element.shipObj.isSunk());
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



const menu = document.querySelector('.start-menu');
const content = document.querySelector('.content');
const buttonp1 = document.getElementById('1p-button');
const buttonp2 = document.getElementById('2p-button');
const form = document.querySelector('form');
const modalClose = document.querySelector('.close');
const bgModal = document.querySelector('.bg-modal');
const modal = document.querySelector('.modal');
buttonp1.addEventListener('click', () => {
	menu.style.display = 'none';
	_game__WEBPACK_IMPORTED_MODULE_1__["default"].start(true);
	_domManager__WEBPACK_IMPORTED_MODULE_0__["default"].initDisplay();
	form.style.display = 'flex';
});

buttonp2.addEventListener('click', () => {
	menu.style.display = 'none';
	_game__WEBPACK_IMPORTED_MODULE_1__["default"].start(false);
	_domManager__WEBPACK_IMPORTED_MODULE_0__["default"].initDisplay();
	form.style.display = 'flex';
});

form.addEventListener('submit', (e) => {
	e.preventDefault();

	for (let i = 1; i < 6; i++) {
		let coordInput = document.querySelector(`#ship${i}`).value;
		let orientation = document.querySelector(`#orientation${i}`).checked;
		try {
			_game__WEBPACK_IMPORTED_MODULE_1__["default"].board1.placeShip(translateInput(coordInput), grabLength(i), orientation);
		} catch (error) {
			_game__WEBPACK_IMPORTED_MODULE_1__["default"].board1.clear();
			_domManager__WEBPACK_IMPORTED_MODULE_0__["default"].clearGrid(document.querySelector('.board1'));
			form.reset();
			return;
		}
	}
	_domManager__WEBPACK_IMPORTED_MODULE_0__["default"].displayShips(_game__WEBPACK_IMPORTED_MODULE_1__["default"].board1, document.querySelector('.grid-display.board1'));
	content.style.display = 'flex';
	form.style.display = 'none';
});

// Modal close event
modalClose.addEventListener('click', _domManager__WEBPACK_IMPORTED_MODULE_0__["default"].closeModal); // for X close
bgModal.addEventListener('click', _domManager__WEBPACK_IMPORTED_MODULE_0__["default"].closeModal); // for background close

// Modal content event
modal.addEventListener('click', (e) => {
	e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();
	return false;
});

function grabLength(index) {
	switch (index) {
		case 1:
			return 2;
		case 2:
		case 3:
			return 3;
		case 4:
			return 4;
		case 5:
			return 5;
	}
}

function translateInput(input) {
	const coordinates = [, parseInt(input[1])];
	switch (input[0].toLowerCase()) {
		case 'a':
			coordinates[0] = 0;
			break;
		case 'b':
			coordinates[0] = 1;
			break;
		case 'c':
			coordinates[0] = 2;
			break;
		case 'd':
			coordinates[0] = 3;
			break;
		case 'e':
			coordinates[0] = 4;
			break;
		case 'f':
			coordinates[0] = 5;
			break;
		case 'g':
			coordinates[0] = 6;
			break;
		case 'h':
			coordinates[0] = 7;
			break;
		case 'i':
			coordinates[0] = 8;
			break;
		case 'j':
			coordinates[0] = 9;
			break;
	}
	return coordinates;
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBMEI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELElBQUksVUFBVSxJQUFJO0FBQzFFLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RCxJQUFJLFVBQVUsSUFBSTtBQUMxRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixNQUFNO0FBQ047QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsSUFBSSxHQUFHO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsb0RBQVc7QUFDOUIsa0JBQWtCLG9EQUFXO0FBQzdCO0FBQ0E7QUFDQSxFQUFFLDhEQUFxQjtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRSwwREFBaUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSCxNQUFNLHNEQUFhO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsbUJBQW1CLFVBQVUsMkJBQTJCO0FBQ3hFO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxnQkFBZ0IsMkJBQTJCLFVBQVUsbUJBQW1CO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0EsbURBQW1ELFNBQVMsVUFBVSxTQUFTO0FBQy9FO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLHVCQUF1QjtBQUN6QyxtQkFBbUIsdUJBQXVCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIseUJBQXlCO0FBQzVDO0FBQ0EsaURBQWlELFFBQVEsVUFBVSxZQUFZO0FBQy9FO0FBQ0EsTUFBTTtBQUNOLGlEQUFpRCxZQUFZLFVBQVUsUUFBUTtBQUMvRTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0EsNEJBQTRCLG9EQUFXO0FBQ3ZDLDRCQUE0QixvREFBVzs7QUFFdkMsNEJBQTRCLG9EQUFXO0FBQ3ZDLDRCQUE0QixvREFBVztBQUN2Qzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRCxpRUFBZSxVQUFVLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xMWTtBQUNGO0FBQ0c7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwrQ0FBTTtBQUN2QixpQkFBaUIsK0NBQU07O0FBRXZCLGdCQUFnQixzREFBUztBQUN6QixnQkFBZ0Isc0RBQVM7O0FBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyx3Q0FBRztBQUNWO0FBQ0EsQ0FBQzs7QUFFRCxpRUFBZSxJQUFJLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvQ007O0FBRTFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLGlEQUFJOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0I7QUFDQSx3QkFBd0IsZUFBZSxXQUFXLHlCQUF5QjtBQUMzRTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBLHdCQUF3QixlQUFlLFdBQVcseUJBQXlCO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxrQ0FBa0M7QUFDakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxTQUFTLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZXOztBQUU3QjtBQUNQO0FBQ0EsaUJBQWlCLHNEQUFTO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDeENEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsSUFBSSxFQUFDOzs7Ozs7O1VDbkJwQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05zQztBQUNaOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsbURBQVU7QUFDWCxDQUFDLCtEQUFzQjtBQUN2QjtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUMsbURBQVU7QUFDWCxDQUFDLCtEQUFzQjtBQUN2QjtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQSxpQkFBaUIsT0FBTztBQUN4QixrREFBa0QsRUFBRTtBQUNwRCwwREFBMEQsRUFBRTtBQUM1RDtBQUNBLEdBQUcsOERBQXFCO0FBQ3hCLElBQUk7QUFDSixHQUFHLDBEQUFpQjtBQUNwQixHQUFHLDZEQUFvQjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsZ0VBQXVCLENBQUMsb0RBQVc7QUFDcEM7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQSxxQ0FBcUMsOERBQXFCLEdBQUc7QUFDN0Qsa0NBQWtDLDhEQUFxQixHQUFHOztBQUUxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tTWFuYWdlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZSc7XG5cbmNvbnN0IGRvbU1hbmFnZXIgPSAoZnVuY3Rpb24gKCkge1xuXHRjb25zdCBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnQnKTtcblx0Y29uc3QgcDFWaWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllcjEnKTtcblx0Y29uc3QgcDJWaWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllcjInKTtcblx0Y29uc3QgYmdNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iZy1tb2RhbCcpO1xuXG5cdGZ1bmN0aW9uIGNlbGxFbGVtZW50KHJvdywgY29sLCBvcHBvbmVudCA9IGZhbHNlKSB7XG5cdFx0Y29uc3QgZWxlbWVudCA9IGNvbnRhaW5lcignY2VsbCcpO1xuXHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCdyb3cnLCByb3cpO1xuXHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjb2wnLCBjb2wpO1xuXG5cdFx0aWYgKG9wcG9uZW50KSB7XG5cdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2luZ2xlUGxheWVyQ2VsbCk7XG5cdFx0fVxuXG5cdFx0LyogZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaXQnKSB8fCB0aGlzLmNsYXNzTGlzdC5jb250YWlucygnbWlzcycpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHJvdyA9IHRoaXMuZ2V0QXR0cmlidXRlKCdyb3cnKTtcblx0XHRcdFx0Y29uc3QgY29sID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2NvbCcpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhyb3csIGNvbCk7XG5cblx0XHRcdFx0bGV0IGJvYXJkO1xuXHRcdFx0XHRsZXQgY2VsbHM7XG5cdFx0XHRcdGlmICh0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdib2FyZDEnKSkge1xuXHRcdFx0XHRcdGlmICghZ2FtZS5wbGF5ZXIxVHVybikge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRib2FyZCA9IGdhbWUuYm9hcmQxO1xuXHRcdFx0XHRcdGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmJvYXJkMT5bcm93PVwiJHtyb3d9XCJdW2NvbD1cIiR7Y29sfVwiXWApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChnYW1lLnBsYXllcjFUdXJuKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJvYXJkID0gZ2FtZS5ib2FyZDI7XG5cdFx0XHRcdFx0Y2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuYm9hcmQyPltyb3c9XCIke3Jvd31cIl1bY29sPVwiJHtjb2x9XCJdYCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBhdHRhY2sgPSBib2FyZC5yZWNlaXZlQXR0YWNrKFtyb3csIGNvbF0pO1xuXHRcdFx0XHRpZiAoYXR0YWNrID09IDApIHtcblx0XHRcdFx0XHRjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG5cdFx0XHRcdFx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcblx0XHRcdFx0XHRcdGNlbGwuY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGdhbWUubmV4dFR1cm4oKTtcblx0XHRcdH0pOyAqL1xuXHRcdHJldHVybiBlbGVtZW50O1xuXHR9XG5cblx0ZnVuY3Rpb24gc2luZ2xlUGxheWVyQ2VsbCgpIHtcblx0XHRpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2hpdCcpIHx8IHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdtaXNzJykpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3Qgcm93ID0gcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoJ3JvdycpKTtcblx0XHRjb25zdCBjb2wgPSBwYXJzZUludCh0aGlzLmdldEF0dHJpYnV0ZSgnY29sJykpO1xuXHRcdGNvbnN0IG9wcEJvYXJkID0gZ2FtZS5ib2FyZDI7XG5cdFx0Y29uc3QgbXlCb2FyZCA9IGdhbWUuYm9hcmQxO1xuXHRcdGNvbnN0IG15RGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib2FyZDEnKTtcblx0XHRjb25zdCBvcHBEaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvYXJkMicpO1xuXHRcdGdhbWUucGxheWVyMS5wbGF5VHVybihbcm93LCBjb2xdLCBvcHBCb2FyZCk7XG5cdFx0b3BwRGlzcGxheS5mb3JFYWNoKChkaXNwbGF5KSA9PiB7XG5cdFx0XHRkaXNwbGF5TWlzc2VkQXR0YWNrcyhvcHBCb2FyZCwgZGlzcGxheSk7XG5cdFx0XHRkaXNwbGF5U2hpcEF0dGFja3Mob3BwQm9hcmQsIGRpc3BsYXkpO1xuXHRcdH0pO1xuXHRcdGdhbWUuYm90LnBsYXlUdXJuKG15Qm9hcmQpO1xuXHRcdG15RGlzcGxheS5mb3JFYWNoKChkaXNwbGF5KSA9PiB7XG5cdFx0XHRkaXNwbGF5TWlzc2VkQXR0YWNrcyhteUJvYXJkLCBkaXNwbGF5KTtcblx0XHRcdGRpc3BsYXlTaGlwQXR0YWNrcyhteUJvYXJkLCBkaXNwbGF5KTtcblx0XHR9KTtcblxuXHRcdGlmIChnYW1lLmdhbWVPdmVyKCkpIHtcblx0XHRcdGJnTW9kYWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cdFx0XHRjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lc3NhZ2UnKTtcblx0XHRcdG1lc3NhZ2UudGV4dENvbnRlbnQgPSAnR2FtZSBPdmVyJztcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBjb250YWluZXIoLi4uY2xhc3Nlcykge1xuXHRcdGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGNsYXNzZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4gY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoZWxlbWVudCkpO1xuXHRcdHJldHVybiBjb250YWluZXI7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwbGF5U2hpcEF0dGFja3MoYm9hcmQsIGdyaWREaXNwbGF5KSB7XG5cdFx0Ym9hcmQuc2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuXHRcdFx0c2hpcC5zaGlwT2JqLmhpdHMuZm9yRWFjaCgodmFsdWUsIGluZGV4KSA9PiB7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PSAxKSB7XG5cdFx0XHRcdFx0aWYgKHNoaXAub3JpZW50YXRpb24pIHtcblx0XHRcdFx0XHRcdGNvbnN0IGNlbGwgPSBncmlkRGlzcGxheS5xdWVyeVNlbGVjdG9yKFxuXHRcdFx0XHRcdFx0XHRgW3Jvdz1cIiR7c2hpcC5zaGlwT2JqLmlkWzBdfVwiXVtjb2w9XCIke3NoaXAuc2hpcE9iai5pZFsxXSArIGluZGV4fVwiXWBcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRjZWxsLmNsYXNzTGlzdC50b2dnbGUoJ2hpdCcsIHRydWUpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBjZWxsID0gZ3JpZERpc3BsYXkucXVlcnlTZWxlY3Rvcihcblx0XHRcdFx0XHRcdFx0YFtyb3c9XCIke3NoaXAuc2hpcE9iai5pZFswXSArIGluZGV4fVwiXVtjb2w9XCIke3NoaXAuc2hpcE9iai5pZFsxXX1cIl1gXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0Y2VsbC5jbGFzc0xpc3QudG9nZ2xlKCdoaXQnLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcGxheU1pc3NlZEF0dGFja3MoYm9hcmQsIGdyaWREaXNwbGF5KSB7XG5cdFx0Ym9hcmQubWlzc2VkQXR0YWNrcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuXHRcdFx0Y29uc3QgY2VsbCA9IGdyaWREaXNwbGF5LnF1ZXJ5U2VsZWN0b3IoYFtyb3c9XCIke2Nvb3JkWzBdfVwiXVtjb2w9XCIke2Nvb3JkWzFdfVwiXWApO1xuXHRcdFx0Y2VsbC5jbGFzc0xpc3QudG9nZ2xlKCdtaXNzJywgdHJ1ZSk7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwbGF5R3JpZChib2FyZCwgY2xhc3NOYW1lLCBvcHBvbmVudCA9IGZhbHNlKSB7XG5cdFx0Y29uc3QgZGlzcGxheSA9IGNvbnRhaW5lcignZ3JpZC1kaXNwbGF5JywgY2xhc3NOYW1lKTtcblx0XHRpZiAob3Bwb25lbnQpIHtcblx0XHRcdGRpc3BsYXkuY2xhc3NMaXN0LmFkZCgnb3Bwb25lbnQnKTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmdyaWQubGVuZ3RoOyBpKyspIHtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgYm9hcmQuZ3JpZC5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRjb25zdCBjZWxsID0gY2VsbEVsZW1lbnQoaSwgaiwgb3Bwb25lbnQpO1xuXHRcdFx0XHRkaXNwbGF5LmFwcGVuZChjZWxsKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIW9wcG9uZW50KSB7XG5cdFx0XHRkaXNwbGF5U2hpcHMoYm9hcmQsIGRpc3BsYXkpO1xuXHRcdH1cblx0XHRyZXR1cm4gZGlzcGxheTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc3BsYXlTaGlwcyhib2FyZCwgZGlzcGxheSkge1xuXHRcdGJvYXJkLnNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcblx0XHRcdGNvbnN0IHNoaXBSb3cgPSBzaGlwLnNoaXBPYmouaWRbMF07XG5cdFx0XHRjb25zdCBzaGlwQ29sID0gc2hpcC5zaGlwT2JqLmlkWzFdO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLnNoaXBPYmoubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHNoaXAub3JpZW50YXRpb24pIHtcblx0XHRcdFx0XHRjb25zdCBjZWxsID0gZGlzcGxheS5xdWVyeVNlbGVjdG9yKGBbcm93PVwiJHtzaGlwUm93fVwiXVtjb2w9XCIke3NoaXBDb2wgKyBpfVwiXWApO1xuXHRcdFx0XHRcdGNlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGNlbGwgPSBkaXNwbGF5LnF1ZXJ5U2VsZWN0b3IoYFtyb3c9XCIke3NoaXBSb3cgKyBpfVwiXVtjb2w9XCIke3NoaXBDb2x9XCJdYCk7XG5cdFx0XHRcdFx0Y2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNsZWFyR3JpZChkaXNwbGF5KSB7XG5cdFx0ZGlzcGxheS5jaGlsZE5vZGVzLmZvckVhY2goKGNlbGwpID0+IHtcblx0XHRcdGNlbGwuY2xhc3NMaXN0LnRvZ2dsZSgnc2hpcCcsIGZhbHNlKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXREaXNwbGF5KCkge1xuXHRcdHAxVmlldy5hcHBlbmQoZGlzcGxheUdyaWQoZ2FtZS5ib2FyZDIsICdib2FyZDInLCB0cnVlKSk7XG5cdFx0cDFWaWV3LmFwcGVuZChkaXNwbGF5R3JpZChnYW1lLmJvYXJkMSwgJ2JvYXJkMScpKTtcblxuXHRcdHAyVmlldy5hcHBlbmQoZGlzcGxheUdyaWQoZ2FtZS5ib2FyZDEsICdib2FyZDEnLCB0cnVlKSk7XG5cdFx0cDJWaWV3LmFwcGVuZChkaXNwbGF5R3JpZChnYW1lLmJvYXJkMiwgJ2JvYXJkMicpKTtcblx0fVxuXG5cdGNvbnN0IGNsb3NlTW9kYWwgPSAoKSA9PiB7XG5cdFx0YmdNb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdERpc3BsYXksXG5cdFx0ZGlzcGxheVNoaXBzLFxuXHRcdGNsZWFyR3JpZCxcblx0XHRjbG9zZU1vZGFsXG5cdH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBkb21NYW5hZ2VyO1xuIiwiaW1wb3J0IGRvbU1hbmFnZXIgZnJvbSAnLi9kb21NYW5hZ2VyJztcbmltcG9ydCBnYW1lQm9hcmQgZnJvbSAnLi9nYW1lQm9hcmQnO1xuaW1wb3J0IHsgcGxheWVyLCBib3QgfSBmcm9tICcuL3BsYXllcic7XG5cbmNvbnN0IGdhbWUgPSAoKCkgPT4ge1xuXHRsZXQgcGxheWVyMVR1cm4gPSB0cnVlO1xuXHRjb25zdCBncmlkU2l6ZSA9IDEwO1xuXHRjb25zdCBwbGF5ZXIxID0gcGxheWVyKDAsICdwMScpO1xuXHRjb25zdCBwbGF5ZXIyID0gcGxheWVyKDEsICdwMicpO1xuXG5cdGNvbnN0IGJvYXJkMSA9IGdhbWVCb2FyZChncmlkU2l6ZSk7XG5cdGNvbnN0IGJvYXJkMiA9IGdhbWVCb2FyZChncmlkU2l6ZSk7XG5cblx0ZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG5cdFx0aWYgKGJvYXJkMS5hbGxTdW5rKCkgfHwgYm9hcmQyLmFsbFN1bmsoKSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGZ1bmN0aW9uIG5leHRUdXJuKCkge1xuXHRcdHBsYXllcjFUdXJuID0gIXBsYXllcjFUdXJuO1xuXHR9XG5cblx0ZnVuY3Rpb24gc3RhcnQoc2luZ2xlKSB7XG5cdFx0aWYgKHNpbmdsZSkge1xuXHRcdFx0Ym9hcmQyLnBsYWNlU2hpcChbMCwgMF0sIDIpO1xuXHRcdFx0Ym9hcmQyLnBsYWNlU2hpcChbMSwgMF0sIDMsIGZhbHNlKTtcblx0XHRcdGJvYXJkMi5wbGFjZVNoaXAoWzMsIDNdLCAzKTtcblx0XHRcdGJvYXJkMi5wbGFjZVNoaXAoWzAsIDldLCA0LCBmYWxzZSk7XG5cdFx0XHRib2FyZDIucGxhY2VTaGlwKFs5LCAwXSwgNSk7XG5cdFx0fSBlbHNlIHtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdHBsYXllcjEsXG5cdFx0cGxheWVyMixcblx0XHRib2FyZDEsXG5cdFx0Ym9hcmQyLFxuXHRcdGdhbWVPdmVyLFxuXHRcdG5leHRUdXJuLFxuXHRcdHN0YXJ0LFxuXHRcdGJvdDogYm90XG5cdH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xuIiwiaW1wb3J0IHNoaXAgZnJvbSAnLi9zaGlwJztcblxuZnVuY3Rpb24gZ2FtZUJvYXJkKHNpemUpIHtcblx0bGV0IGdyaWQgPSBBcnJheS5mcm9tKEFycmF5KHNpemUpLCAoKSA9PiBuZXcgQXJyYXkoc2l6ZSkuZmlsbCgtMSkpO1xuXHRsZXQgc2hpcHMgPSBbXTtcblx0bGV0IG1pc3NlZEF0dGFja3MgPSBbXTtcblxuXHRmdW5jdGlvbiBwbGFjZVNoaXAoY29vcmQsIGxlbmd0aCwgb3JpZW50YXRpb24gPSB0cnVlKSB7XG5cdFx0bGV0IHJvdyA9IGNvb3JkWzBdO1xuXHRcdGxldCBjb2wgPSBjb29yZFsxXTtcblxuXHRcdGlmIChyb3cgPCAwIHx8IGNvbCA8IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignT3V0IG9mIGdyaWQgcmFuZ2UnKTtcblx0XHR9XG5cblx0XHRsZXQgYmF0dGxlc2hpcCA9IHNoaXAoY29vcmQsIGxlbmd0aCk7XG5cblx0XHRpZiAob3JpZW50YXRpb24pIHtcblx0XHRcdC8vIGhvcml6b250YWxcblx0XHRcdGlmIChjb2wgKyBsZW5ndGggPiBzaXplKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignT3V0IG9mIGdyaWQgcmFuZ2UnKTtcblx0XHRcdH1cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHRoaXMuZ3JpZFtyb3ddW2NvbCArIGldICE9IC0xKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGAke2JhdHRsZXNoaXAuaWR9IG92ZXJsYXBzICR7dGhpcy5ncmlkW3Jvd11bY29sICsgaV19IHNoaXBgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmdyaWRbcm93XVtjb2wgKyBpXSA9IGJhdHRsZXNoaXAuaWQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHZlcnRpY2FsXG5cdFx0XHRpZiAocm93ICsgbGVuZ3RoID4gc2l6ZSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ091dCBvZiBncmlkIHJhbmdlJyk7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmICh0aGlzLmdyaWRbcm93ICsgaV1bY29sXSAhPSAtMSkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgJHtiYXR0bGVzaGlwLmlkfSBvdmVybGFwcyAke3RoaXMuZ3JpZFtyb3cgKyBpXVtjb2xdfSBzaGlwYCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5ncmlkW3JvdyArIGldW2NvbF0gPSBiYXR0bGVzaGlwLmlkO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRzaGlwcy5wdXNoKHsgc2hpcE9iajogYmF0dGxlc2hpcCwgb3JpZW50YXRpb24gfSk7XG5cdH1cblxuXHRmdW5jdGlvbiByZWNlaXZlQXR0YWNrKGNvb3JkKSB7XG5cdFx0Y29uc3Qgcm93ID0gY29vcmRbMF07XG5cdFx0Y29uc3QgY29sID0gY29vcmRbMV07XG5cdFx0Y29uc3QgdmFsdWUgPSB0aGlzLmdyaWRbcm93XVtjb2xdO1xuXHRcdGlmICh2YWx1ZSA9PSAtMSkge1xuXHRcdFx0bWlzc2VkQXR0YWNrcy5wdXNoKGNvb3JkKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Y29uc3QgYXR0YWNrZWRTaGlwID0gc2hpcHMuZmluZCgoc2hpcCkgPT4gc2hpcC5zaGlwT2JqLmlkID09IHZhbHVlKTtcblx0XHRjb25zdCBoaXRQb3NpdGlvbiA9IHJvdyAtIHZhbHVlWzBdICsgY29sIC0gdmFsdWVbMV07XG5cdFx0YXR0YWNrZWRTaGlwLnNoaXBPYmouaGl0KGhpdFBvc2l0aW9uKTtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdGZ1bmN0aW9uIGFsbFN1bmsoKSB7XG5cdFx0Y29uc3QgYWZsb2F0ID0gc2hpcHMuc29tZSgoZWxlbWVudCkgPT4gIWVsZW1lbnQuc2hpcE9iai5pc1N1bmsoKSk7XG5cdFx0aWYgKGFmbG9hdCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNsZWFyKCkge1xuXHRcdHRoaXMuZ3JpZCA9IEFycmF5LmZyb20oQXJyYXkoc2l6ZSksICgpID0+IG5ldyBBcnJheShzaXplKS5maWxsKC0xKSk7XG5cdFx0dGhpcy5zaGlwcyA9IFtdO1xuXHRcdHRoaXMubWlzc2VkQXR0YWNrcyA9IFtdO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRncmlkLFxuXHRcdHNoaXBzLFxuXHRcdHBsYWNlU2hpcCxcblx0XHRyZWNlaXZlQXR0YWNrLFxuXHRcdG1pc3NlZEF0dGFja3MsXG5cdFx0YWxsU3Vuayxcblx0XHRjbGVhclxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnYW1lQm9hcmQ7XG4iLCJpbXBvcnQgZ2FtZUJvYXJkIGZyb20gJy4vZ2FtZUJvYXJkJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBsYXllcihpZCwgbmFtZSkge1xuXHRjb25zdCBib2FyZFNpemUgPSAxMDtcblx0Y29uc3QgbXlCb2FyZCA9IGdhbWVCb2FyZChib2FyZFNpemUpO1xuXHRmdW5jdGlvbiBwbGF5VHVybihjb29yZCwgb3BwQm9hcmQpIHtcblx0XHRvcHBCb2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkKTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdGlkLFxuXHRcdG5hbWUsXG5cdFx0bXlCb2FyZCxcblx0XHRwbGF5VHVyblxuXHR9O1xufVxuXG5leHBvcnQgdmFyIGJvdCA9IE9iamVjdC5jcmVhdGUocGxheWVyKC0xLCAnYm90JyksIHtcblx0YXR0YWNrTG9nOiB7XG5cdFx0dmFsdWU6IFtdXG5cdH0sXG5cdHBpY2tDb29yZDoge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRjb25zdCBtYXggPSB0aGlzLm15Qm9hcmQuZ3JpZC5sZW5ndGg7XG5cdFx0XHRsZXQgcm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcblx0XHRcdGxldCBjb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuXHRcdFx0ZG8ge1xuXHRcdFx0XHRyb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuXHRcdFx0XHRjb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xuXHRcdFx0fSB3aGlsZSAodGhpcy5hdHRhY2tMb2cuaW5jbHVkZXMoW3JvdywgY29sXSkpO1xuXG5cdFx0XHR0aGlzLmF0dGFja0xvZy5wdXNoKFtyb3csIGNvbF0pO1xuXHRcdFx0cmV0dXJuIFtyb3csIGNvbF07XG5cdFx0fVxuXHR9LFxuXHRwbGF5VHVybjoge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAob3BwQm9hcmQpIHtcblx0XHRcdGNvbnN0IHRhcmdldCA9IHRoaXMucGlja0Nvb3JkKCk7XG5cdFx0XHRyZXR1cm4gb3BwQm9hcmQucmVjZWl2ZUF0dGFjayh0YXJnZXQpO1xuXHRcdH1cblx0fVxufSk7XG4iLCJmdW5jdGlvbiBzaGlwKGlkLCBsZW5ndGgpIHtcblx0Y29uc3QgaGl0cyA9IEFycmF5KGxlbmd0aCkuZmlsbCgwKTtcblxuXHRmdW5jdGlvbiBpc1N1bmsoKSB7XG5cdFx0cmV0dXJuIGhpdHMuaW5jbHVkZXMoMCkgPyBmYWxzZSA6IHRydWU7XG5cdH1cblx0ZnVuY3Rpb24gaGl0KHBvcykge1xuXHRcdGhpdHNbcG9zXSA9IDE7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGlkLFxuXHRcdGxlbmd0aCxcblx0XHRoaXRzLFxuXHRcdGhpdCxcblx0XHRpc1N1bmtcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2hpcDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGRvbU1hbmFnZXIgZnJvbSAnLi9kb21NYW5hZ2VyJztcbmltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZSc7XG5cbmNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnQtbWVudScpO1xuY29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50Jyk7XG5jb25zdCBidXR0b25wMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCcxcC1idXR0b24nKTtcbmNvbnN0IGJ1dHRvbnAyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJzJwLWJ1dHRvbicpO1xuY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcbmNvbnN0IG1vZGFsQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xvc2UnKTtcbmNvbnN0IGJnTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmctbW9kYWwnKTtcbmNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsJyk7XG5idXR0b25wMS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0bWVudS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRnYW1lLnN0YXJ0KHRydWUpO1xuXHRkb21NYW5hZ2VyLmluaXREaXNwbGF5KCk7XG5cdGZvcm0uc3R5bGUuZGlzcGxheSA9ICdmbGV4Jztcbn0pO1xuXG5idXR0b25wMi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0bWVudS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRnYW1lLnN0YXJ0KGZhbHNlKTtcblx0ZG9tTWFuYWdlci5pbml0RGlzcGxheSgpO1xuXHRmb3JtLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG59KTtcblxuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xuXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0Zm9yIChsZXQgaSA9IDE7IGkgPCA2OyBpKyspIHtcblx0XHRsZXQgY29vcmRJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzaGlwJHtpfWApLnZhbHVlO1xuXHRcdGxldCBvcmllbnRhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNvcmllbnRhdGlvbiR7aX1gKS5jaGVja2VkO1xuXHRcdHRyeSB7XG5cdFx0XHRnYW1lLmJvYXJkMS5wbGFjZVNoaXAodHJhbnNsYXRlSW5wdXQoY29vcmRJbnB1dCksIGdyYWJMZW5ndGgoaSksIG9yaWVudGF0aW9uKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0Z2FtZS5ib2FyZDEuY2xlYXIoKTtcblx0XHRcdGRvbU1hbmFnZXIuY2xlYXJHcmlkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib2FyZDEnKSk7XG5cdFx0XHRmb3JtLnJlc2V0KCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cdGRvbU1hbmFnZXIuZGlzcGxheVNoaXBzKGdhbWUuYm9hcmQxLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1kaXNwbGF5LmJvYXJkMScpKTtcblx0Y29udGVudC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuXHRmb3JtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG59KTtcblxuLy8gTW9kYWwgY2xvc2UgZXZlbnRcbm1vZGFsQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkb21NYW5hZ2VyLmNsb3NlTW9kYWwpOyAvLyBmb3IgWCBjbG9zZVxuYmdNb2RhbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRvbU1hbmFnZXIuY2xvc2VNb2RhbCk7IC8vIGZvciBiYWNrZ3JvdW5kIGNsb3NlXG5cbi8vIE1vZGFsIGNvbnRlbnQgZXZlbnRcbm1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRyZXR1cm4gZmFsc2U7XG59KTtcblxuZnVuY3Rpb24gZ3JhYkxlbmd0aChpbmRleCkge1xuXHRzd2l0Y2ggKGluZGV4KSB7XG5cdFx0Y2FzZSAxOlxuXHRcdFx0cmV0dXJuIDI7XG5cdFx0Y2FzZSAyOlxuXHRcdGNhc2UgMzpcblx0XHRcdHJldHVybiAzO1xuXHRcdGNhc2UgNDpcblx0XHRcdHJldHVybiA0O1xuXHRcdGNhc2UgNTpcblx0XHRcdHJldHVybiA1O1xuXHR9XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZUlucHV0KGlucHV0KSB7XG5cdGNvbnN0IGNvb3JkaW5hdGVzID0gWywgcGFyc2VJbnQoaW5wdXRbMV0pXTtcblx0c3dpdGNoIChpbnB1dFswXS50b0xvd2VyQ2FzZSgpKSB7XG5cdFx0Y2FzZSAnYSc6XG5cdFx0XHRjb29yZGluYXRlc1swXSA9IDA7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlICdiJzpcblx0XHRcdGNvb3JkaW5hdGVzWzBdID0gMTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ2MnOlxuXHRcdFx0Y29vcmRpbmF0ZXNbMF0gPSAyO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnZCc6XG5cdFx0XHRjb29yZGluYXRlc1swXSA9IDM7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlICdlJzpcblx0XHRcdGNvb3JkaW5hdGVzWzBdID0gNDtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ2YnOlxuXHRcdFx0Y29vcmRpbmF0ZXNbMF0gPSA1O1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnZyc6XG5cdFx0XHRjb29yZGluYXRlc1swXSA9IDY7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlICdoJzpcblx0XHRcdGNvb3JkaW5hdGVzWzBdID0gNztcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ2knOlxuXHRcdFx0Y29vcmRpbmF0ZXNbMF0gPSA4O1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnaic6XG5cdFx0XHRjb29yZGluYXRlc1swXSA9IDk7XG5cdFx0XHRicmVhaztcblx0fVxuXHRyZXR1cm4gY29vcmRpbmF0ZXM7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=