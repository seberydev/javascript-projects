/* DATA CONTROLLER */

const dataController = (function () {
	let data = {
		maxAttempts: 0,
		guesses: [],
		currentAttempts: 0,
		randomNumber: 0,
		low: 0,
		space: 0,
		high: 0,
		range: {
			lowRange: 1,
			highRange: 100,
		},
		guessed: false,
		gifURLS: {
			lowURL: "https://media.giphy.com/media/26CaLKiimsm3ibpE4/giphy.gif",
			highURL: "https://media.giphy.com/media/Zg7clvqHE3CdW/giphy.gif",
			winURL: "https://media.giphy.com/media/emwfDfisjNTB6/giphy.gif",
			loseURL: "https://media.giphy.com/media/1yTgjxf7VFuyblxmDe/giphy.gif",
		},
	};

	return {
		getData: function () {
			return data;
		},
	};
})();

/*UI CONTROLLER*/

const UIController = (function () {
	const DOMStrings = {
		difficultyButtons: ".difficulty-buttons-container button",
		startGAmeSection: ".start-game-section",
		gameSection: ".game-section",
		guessinput: "guessNumber",
		totalGuessesElement: "totalGuesses",
		totalAttemptsElement: "totalAttempts",
		lowElement: "low",
		spaceElement: "space",
		highElement: "high",
		rangeElement: "range",
		guessTitleElement: "guessTitle",
		newGameBtn: "newGame",
		gifElement: "gif",
	};

	const changeRangeText = function (data) {
		if (data.low == 0) {
			document.getElementById(DOMStrings.rangeElement).textContent =
				"1" + " - " + (100 - data.high);
		} else if (data.high == 0) {
			document.getElementById(DOMStrings.rangeElement).textContent =
				data.low + " - " + "100";
		} else {
			document.getElementById(DOMStrings.rangeElement).textContent =
				data.low + " - " + (100 - data.high);
		}
	};

	const resetProgressBar = function () {
		document.getElementById(DOMStrings.lowElement).style.flex = 0;
		document.getElementById(DOMStrings.spaceElement).style.flex = 1;
		document.getElementById(DOMStrings.highElement).style.flex = 0;
	};

	return {
		getDOM: function () {
			return {
				difficultyButtons: document.querySelectorAll(
					DOMStrings.difficultyButtons
				),
				startGAmeSection: document.querySelector(DOMStrings.startGAmeSection),
				gameSection: document.querySelector(DOMStrings.gameSection),
				guessinput: document.getElementById(DOMStrings.guessinput),
				totalGuessesElement: document.getElementById(
					DOMStrings.totalGuessesElement
				),
				totalAttemptsElement: document.getElementById(
					DOMStrings.totalAttemptsElement
				),
				guessTitleElement: document.getElementById(
					DOMStrings.guessTitleElement
				),
				newGameBtn: document.getElementById(DOMStrings.newGameBtn),
				gifElement: document.getElementById(DOMStrings.gifElement),
			};
		},
		changeProgressBar: function (data, guess) {
			if (guess < data.randomNumber) {
				data.low = guess;
				data.space = 100 - data.low - data.high;
				data.range.lowRange = guess;
				document.getElementById(DOMStrings.guessTitleElement).textContent =
					"😅Your guess is too low!";
				document
					.getElementById(DOMStrings.gifElement)
					.setAttribute("src", data.gifURLS.lowURL);
			} else if (guess > data.randomNumber) {
				data.high = 100 - guess;
				data.space = 100 - data.low - data.high;
				data.range.highRange = guess;
				document.getElementById(DOMStrings.guessTitleElement).textContent =
					"😝Your guess is too high!";
				document
					.getElementById(DOMStrings.gifElement)
					.setAttribute("src", data.gifURLS.highURL);
			} else {
				document.getElementById(DOMStrings.guessTitleElement).textContent =
					"😱You guessed the number!";
				data.guessed = true;
				document
					.getElementById(DOMStrings.gifElement)
					.setAttribute("src", data.gifURLS.winURL);
				resetProgressBar();
			}

			document.getElementById(DOMStrings.lowElement).style.flex = data.low;
			document.getElementById(DOMStrings.spaceElement).style.flex = data.space;
			document.getElementById(DOMStrings.highElement).style.flex = data.high;
			changeRangeText(data);
		},
		resetProgress: function () {
			resetProgressBar();
		},
	};
})();

/* CONTROLLER */

const controller = (function (UI, dataCon) {
	const DOMElements = UI.getDOM();
	const allData = dataCon.getData();

	const startGame = function () {
		DOMElements.guessinput.addEventListener("keydown", function (event) {
			let number = parseInt(DOMElements.guessinput.value);
			if (
				!isNaN(number) &&
				event.key === "Enter" &&
				number <= allData.range.highRange &&
				number >= allData.range.lowRange
			) {
				allData.guesses.push(" " + number);
				allData.currentAttempts++;
				DOMElements.totalAttemptsElement.textContent = allData.currentAttempts;
				DOMElements.totalGuessesElement.textContent = allData.guesses;
				UI.changeProgressBar(allData, number);
				DOMElements.guessinput.value = "";

				if (allData.guessed || allData.currentAttempts >= allData.maxAttempts) {
					if (
						allData.currentAttempts >= allData.maxAttempts &&
						!allData.guessed
					) {
						DOMElements.guessTitleElement.textContent = "😥You lose the game!";
						DOMElements.gifElement.setAttribute("src", allData.gifURLS.loseURL);
					}
					finishGame();
				}
			}
		});
	};

	const finishGame = function () {
		UI.resetProgress();
		DOMElements.guessinput.readOnly = true;
		DOMElements.newGameBtn.style.display = "inline-block";
		newGame();
	};

	const newGame = function () {
		DOMElements.newGameBtn.addEventListener("click", function () {
			location.reload();
		});
	};

	const addEvents = function () {
		/* DIFFICULTY BUTTONS */
		let buttons = Array.prototype.slice.call(DOMElements.difficultyButtons);
		buttons.forEach(function (curr) {
			curr.addEventListener("click", function () {
				switch (curr.id) {
					case "easy":
						allData.maxAttempts = 10;
						break;
					case "hard":
						allData.maxAttempts = 5;
						break;
					case "crazy":
						allData.maxAttempts = 1;
						break;
				}
				DOMElements.startGAmeSection.style.display = "none";
				DOMElements.gameSection.style.display = "block";
				DOMElements.guessinput.focus();
				startGame();
			});
		});
	};

	return {
		init: function () {
			allData.randomNumber = Math.floor(Math.random() * 100) + 1;
			addEvents();
		},
	};
})(UIController, dataController);

controller.init();
