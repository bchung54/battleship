import gameBoard from '../src/gameBoard';

const board = gameBoard(10);
const coord = [0, 2];
const length = 5;
const coord2 = [1, 2];
const length2 = 4;

test('Board properties: placeShips, receiveAttack, missedAttacks, allSunk', () => {
	expect(board).toHaveProperty('placeShip');
	expect(board).toHaveProperty('receiveAttack');
	expect(board).toHaveProperty('missedAttacks');
	expect(board).toHaveProperty('allSunk');
});

/* Place Ship Tests */

test('Place ship: horizontal', () => {
	const row = coord[0];
	const col = coord[1];
	board.placeShip(coord, length);
	for (let i = 0; i < length; i++) {
		expect(board.grid[row][col + i]).toBe(0);
	}

	expect(board.grid[row][col + length + 1]).toBe(-1);
});

test('Place ship: vertical', () => {
	const row = coord2[0];
	const col = coord2[1];
	board.placeShip(coord2, length2, false);
	for (let i = 0; i < length2; i++) {
		expect(board.grid[row + i][col]).toBe(1);
	}

	expect(board.grid[row + length2][col]).toBe(-1);
});

test('Place ship: out of range', () => {
	expect(() => board.placeShip([-1, 5], 2)).toThrow('Out of grid range');
	expect(() => board.placeShip([0, 1], 11)).toThrow('Out of grid range');
	expect(() => board.placeShip([0, 1], 11, false)).toThrow('Out of grid range');
});

test('Place ship: wrong coordinate inputs', () => {
	expect(() => board.placeShip([0], 2)).toThrow('Coordinates must be two number values');
	expect(() => board.placeShip(['cheese', 'beef'], 2)).toThrow(
		'Coordinates must be two number values'
	);
	expect(() => board.placeShip(2, 2)).toThrow('Coordinates must be an array');
});

test(`Receive attack: ${coord} on ship0`, () => {
	board.receiveAttack(coord);
	expect(board.ships[0].shipObj.hits).toEqual([1, 0, 0, 0, 0]);
});

test(`Missed attack: [0, 1]`, () => {
	const row = 0;
	const col = 1;
	board.receiveAttack([row, col]);
	expect(board.missedAttacks).toContainEqual([0, 1]);
});

test(`Missed attack: [9, 9]`, () => {
	const row = 9;
	const col = 9;
	board.receiveAttack([row, col]);
	expect(board.missedAttacks).toContainEqual([9, 9]);
});

test(`All sunk: false`, () => {
	expect(board.allSunk()).toBe(false);
});

test(`All sunk: true`, () => {
	for (let i = 0; i < length; i++) {
		board.receiveAttack([0, 2 + i]);
		board.receiveAttack([1 + i, 2]);
	}
	expect(board.allSunk()).toBe(true);
});
