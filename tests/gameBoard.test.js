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

test(`Receive attack: ${coord} on ship0`, () => {
	board.placeShip(coord, 0, true);
	board.receiveAttack(coord);
	expect(board.ships[0].hits).toEqual([1, 0]);
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
		console.log(board.grid[0][2 + i]);
	}
	cons;
	expect(board.allSunk()).toBe(true);
});
