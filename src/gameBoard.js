import ship from './ship';

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

		let battleship = ship(coord, length);

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

export default gameBoard;
