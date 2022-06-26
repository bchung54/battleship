import { player, bot } from '../src/player';
import gameBoard from '../src/gameBoard';

const player1 = player(0, 'player1');

test('Player properties: id, name, myBoard, oppBoard, playTurn', () => {
	expect(player1).toHaveProperty('id');
	expect(player1).toHaveProperty('name');
	expect(player1).toHaveProperty('myBoard');
	expect(player1).toHaveProperty('playTurn');
});

test('PlayTurn: hit on [2,3]', () => {
	const oppBoard = gameBoard(10);
	player1.playTurn([2, 3], oppBoard);
	const testBoard = gameBoard(10);
	testBoard.missedAttacks.push([2, 3]);
	expect(oppBoard.missedAttacks).toEqual(testBoard.missedAttacks);
});

test('Bot: make move', () => {
	const newBoard = gameBoard(10);
	bot.playTurn(newBoard);
	expect(bot.attackLog).toBeTruthy();
	console.log(bot.attackLog);
});
