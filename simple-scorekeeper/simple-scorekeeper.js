//setup
var h1 = document.querySelector('h1');
var p1 = document.querySelector('p');
var input = document.querySelector('input');
var b1 = document.querySelector('#btn-player1');
var b2 = document.querySelector('#btn-player2');
var b3 = document.querySelector('#btn-reset');

var p1_score = 0;
var p2_score = 0;

h1.textContent = `${p1_score} to ${p2_score}`;
p1.textContent = 'Please enter a valid number of games';
// p1 elements's state
showGameState();

// Click Listeners
b1.addEventListener('click', incrementScore);
b2.addEventListener('click', incrementScore);
input.addEventListener('input', showGameState);
b3.addEventListener('click', resetGame);


//Functions
function incrementScore() {
	let maxGames = input.value
  if(p1_score < maxGames && p2_score < maxGames) {
		if(this.id == b1.getAttribute('id')) {
		p1_score++;
		h1.textContent = `${p1_score} to ${p2_score}`;
	} else if (this.id == b2.getAttribute('id'))  {
		p2_score++;
		h1.textContent = `${p1_score} to ${p2_score}`;
	}
  } else {
  	alert('GAME OVER!');
  }
}

function showGameState() {
  if(input.value === '' || parseInt(input.value) < 1 ) {
    p1.textContent = 'Please enter a valid number of games';
    p1.classList.toggle('highlight'); //turn on yellow
  } else {
  	p1.classList.toggle('highlight'); //turn off yellow
	p1.textContent =`Play to: ${input.value}`;
  }
}  

function resetGame() {
	// p1_score = '0', p2_score = '0';
 //  	h1.textContent = `${p1_score} to ${p2_score}`;
 //  	input.value='';
	// showGameState();
	window.location.reload();
 }