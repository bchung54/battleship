import ship from '../src/ship';

const battleship = ship(0, 4);

test('Battleship properties (length, hit positions, sunk) and functions (hit, isSunk)', () => {
	expect(battleship).toHaveLength(4);
	expect(battleship).toHaveProperty('hits');
	expect(battleship).toHaveProperty('isSunk');
});

test('Send correct length: 5', () => {
	const longship = ship(1, 5);
	expect(longship.length).toBe(5);
});

test('Send correct hit positions: 0, 2', () => {
	battleship.hit(0);
	battleship.hit(2);
	expect(battleship.hits).toEqual([1, 0, 1, 0]);
});

test('Send that ship is not sunk correctly', () => {
	expect(battleship.isSunk()).toBeFalsy();
});

test('Send that ship is sunk correctly', () => {
	battleship.hit(1);
	battleship.hit(3);
	expect(battleship.isSunk()).toBeTruthy();
});
