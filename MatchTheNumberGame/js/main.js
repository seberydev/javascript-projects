/* DATA CONTROLLER */
const dataController = (function () {
	const images = [
		{
			imageUrl: "colors.jpg",
			numberItems: 4,
		},
		{
			imageUrl: "dollars.jpg",
			numberItems: 5,
		},
		{
			imageUrl: "horses.jpg",
			numberItems: 2,
		},
		{
			imageUrl: "letters.jpg",
			numberItems: 7,
		},
		{
			imageUrl: "numbers.jpg",
			numberItems: 1,
		},
		{
			imageUrl: "pens.jpg",
			numberItems: 1,
		},
		{
			imageUrl: "petals.jpg",
			numberItems: 6,
		},
		{
			imageUrl: "rings.jpg",
			numberItems: 2,
		},
		{
			imageUrl: "words.jpg",
			numberItems: 3,
		},
		{
			imageUrl: "yellow colors.jpg",
			numberItems: 2,
		},
	];

	let data = {
		eachTime: 10000,
		currentScore: 0,
		totalScore: images.length,
		currentAnswer: false,
	};

	return {
		getData: function () {
			return data;
		},
		getImages: function () {
			return images;
		},
	};
})();

/* UI CONTROLLER */
const UIController = (function () {
	const DOMStrings = {
		secondsText: "secondsLimit",
		startBtn: "startBtn",
		welcomeContainer: ".welcome-section-container",
		statsBtnContainer: ".score-buttons-container",
		imageContainer: ".game-section-container",
		scoreTexts: ".score-content-container h3",
		img: "image",
		currentScoreText: "currentScore",
		totalScoreText: "totalScore",
		itemNumberText: "itemImageNumber",
		imageNameText: "imageName",
		endContainer: ".end-section-container",
		lastScoreText: "lastScore",
		endTotalText: "endTotalScore",
		selectTrueBtn: "trueBtn",
		selectFalseBtn: "falseBtn",
	};

	return {
		getDOMStrings: function () {
			return DOMStrings;
		},
		changeImage: function (obj, randomImage) {
			let randomNumber = randomImage();
			document
				.getElementById(DOMStrings.img)
				.setAttribute("src", `img/${obj[randomNumber].imageUrl}`);
			return randomNumber;
		},
		changeStats: function (obj, numberItems, name) {
			document.getElementById(DOMStrings.currentScoreText).textContent =
				obj.currentScore;
			document.getElementById(DOMStrings.totalScoreText).textContent =
				obj.totalScore;
			document.getElementById(
				DOMStrings.itemNumberText
			).textContent = numberItems;
			document.getElementById(DOMStrings.imageNameText).textContent = name;
		},
	};
})();

/* CONTROLLER */

const controller = (function (UI, dataCon) {
	let DOM = UI.getDOMStrings();
	let allData = dataCon.getData();
	let imgData = dataCon.getImages();
	let click = false;

	const addEvents = function () {
		document
			.getElementById(DOM.selectTrueBtn)
			.addEventListener("click", selectAnswer);
		document
			.getElementById(DOM.selectFalseBtn)
			.addEventListener("click", selectAnswer);

		document
			.getElementById(DOM.startBtn)
			.addEventListener("click", function () {
				let scoreText = document.querySelectorAll(DOM.scoreTexts);
				scoreText[0].style.visibility = "visible";
				scoreText[1].style.visibility = "visible";
				document.querySelector(DOM.welcomeContainer).style.display = "none";
				document.querySelector(DOM.imageContainer).style.display = "flex";
				document.querySelector(DOM.statsBtnContainer).style.visibility =
					"visible";
				startGame();
			});
	};

	const selectAnswer = function (e) {
		if (!click) {
			click = true;
		}
		target = e.target.id;

		if ((target == "trueBtn" && click) || (target == "trueIcon" && click)) {
			if (allData.currentAnswer) {
				allData.currentScore++;
			} else {
				allData.currentScore--;
			}
		} else if (
			(target == "falseBtn" && click) ||
			(target == "falseIcon" && click)
		) {
			if (!allData.currentAnswer) {
				allData.currentScore++;
			} else {
				allData.currentScore--;
			}
		}
	};

	const startGame = function () {
		let random, name;
		random = UI.changeImage(imgData, getImageNumber);
		name = imgData[random].imageUrl.split(".");
		UI.changeStats(
			allData,
			randomItemNumber(imgData[random].numberItems),
			name[0]
		);
		imgData.splice(random, 1);

		const interval = setInterval(function () {
			if (imgData.length == 0) {
				clearInterval(interval);
				finishGame();
			} else {
				click = false;
				random = UI.changeImage(imgData, getImageNumber);
				name = imgData[random].imageUrl.split(".");
				console.log(randomItemNumber(5));
				UI.changeStats(
					allData,
					randomItemNumber(imgData[random].numberItems),
					name[0]
				);
				imgData.splice(random, 1);
			}
		}, allData.eachTime);
	};

	const finishGame = function () {
		document.querySelector(DOM.imageContainer).style.display = "none";
		document.querySelector(DOM.endContainer).style.display = "flex";
		document.getElementById(DOM.lastScoreText).textContent =
			allData.currentScore;
		document.getElementById(DOM.endTotalText).textContent = allData.totalScore;
		document.querySelector(DOM.statsBtnContainer).style.visibility = "hidden";
		let scoreText = document.querySelectorAll(DOM.scoreTexts);
		scoreText[0].style.visibility = "hidden";
		scoreText[1].style.visibility = "hidden";
	};

	const getImageNumber = function () {
		let randomNumber;
		randomNumber = Math.floor(Math.random() * imgData.length);
		return randomNumber;
	};

	const randomItemNumber = function (num) {
		let randomRange, number;
		randomRange = Math.floor(Math.random() * 3);

		switch (randomRange) {
			case 0:
				number = num;
				allData.currentAnswer = true;
				break;
			case 1:
				number = ++num;
				allData.currentAnswer = false;
				break;
			case 2:
				number = --num;
				allData.currentAnswer = false;
				break;
		}

		return number;
	};

	return {
		init: function () {
			addEvents();
			document.getElementById(DOM.secondsText).textContent =
				allData.eachTime / 1000;
		},
	};
})(UIController, dataController);

controller.init();
