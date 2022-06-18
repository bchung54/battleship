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

export default ship;
