import ship from './ship';

function gameBoard(size) {
	const grid = Array.from(Array(size), () => new Array(size).fill(-1));
	const ships = [];
	const missedAttacks = [];
	function placeShip(coord, length, horizontal = true) {
		if (!Array.isArray(coord)) {
			throw new Error('Coordinates must be an array');
		}

		if (coord.length != 2 || typeof coord[0] != 'number' || typeof coord[1] != 'number') {
			throw new Error('Coordinates must be two number values');
		}

		const row = coord[0];
		const col = coord[1];

		if (row < 0 || col < 0) {
			throw new Error('Out of grid range');
		}

		const battleship = ship(ships.length, length);

		if (horizontal) {
			if (col + length > size) {
				throw new Error('Out of grid range');
			}
			for (let i = 0; i < length; i++) {
				grid[row][col + i] = battleship.id;
			}
		} else {
			if (row + length > size) {
				throw new Error('Out of grid range');
			}
			for (let i = 0; i < length; i++) {
				grid[row + i][col] = battleship.id;
			}
		}
		ships.push({ shipObj: battleship, coord });
	}

	function receiveAttack(coord) {
		const row = coord[0];
		const col = coord[1];
		const value = grid[row][col];
		if (value == -1) {
			missedAttacks.push(coord);
			return;
		}
		const attackedShip = ships[value];
		const hitPosition = row - attackedShip.coord[0] + col - attackedShip.coord[1];
		attackedShip.shipObj.hit(hitPosition);
	}

	function allSunk() {
		const afloat = ships.some((element) => !element.shipObj.isSunk());
		if (afloat) {
			return false;
		}
		return true;
	}

	return {
		grid,
		ships,
		placeShip,
		receiveAttack,
		missedAttacks,
		allSunk
	};
}

export default gameBoard;
