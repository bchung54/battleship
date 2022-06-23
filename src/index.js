import domManager from './domManager';
import game from './game';

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
	game.start(true);
	domManager.initDisplay();
	form.style.display = 'flex';
});

buttonp2.addEventListener('click', () => {
	menu.style.display = 'none';
	game.start(false);
	domManager.initDisplay();
	form.style.display = 'flex';
});

form.addEventListener('submit', (e) => {
	e.preventDefault();

	for (let i = 1; i < 6; i++) {
		let coordInput = document.querySelector(`#ship${i}`).value;
		let orientation = document.querySelector(`#orientation${i}`).checked;
		try {
			game.board1.placeShip(translateInput(coordInput), grabLength(i), orientation);
		} catch (error) {
			game.board1.clear();
			domManager.clearGrid(document.querySelector('.board1'));
			form.reset();
			return;
		}
	}
	domManager.displayShips(game.board1, document.querySelector('.grid-display.board1'));
	content.style.display = 'flex';
	form.style.display = 'none';
});

// Modal close event
modalClose.addEventListener('click', domManager.closeModal); // for X close
bgModal.addEventListener('click', domManager.closeModal); // for background close

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
