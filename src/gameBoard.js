import domManager from './domManager';
import ship from './ship';

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
			ships.push(ship(index, length));
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

export default gameBoard;
