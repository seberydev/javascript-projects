/* DATA CONTROLLER */
const dataController = (function () {
	data = {
		currentSong: "",
		volume: 50,
	};

	return {
		getData: function () {
			return data;
		},
	};
})();

/* UI CONTROLLER */
const UIController = (function () {
	const DOMStrings = {
		songElements: ".band-container ul > li",
		sourceElement: "source",
		audioElement: "audio",
		currentSongElement: "currentSong",
		stopElement: "stopBtn",
		playElement: "playBtn",
		volumeRange: "rangeInput",
		songProgress: "playerProgress",
	};

	let audioElement = document.querySelector(DOMStrings.audioElement);

	const setSong = function (name) {
		let sourceElement;
		sourceElement = document.querySelector(DOMStrings.sourceElement);
		sourceElement.src = `music/${name}.mp3`;
		audioElement.load();
		audioElement.play();
	};

	const setTitleText = function (name) {
		document.getElementById(DOMStrings.currentSongElement).textContent = name;
	};

	const setSongProgress = function () {
		let value;
		if (audioElement.currentTime > 0) {
			value = (audioElement.currentTime / audioElement.duration) * 100;
			document.getElementById(DOMStrings.songProgress).value = value;
		}
	};

	const controlSong = function (state) {
		if (state == "pause") {
			audioElement.pause();
		} else if (state == "play") {
			if (audioElement.readyState) {
				audioElement.play();
			}
		}
	};

	const setVolume = function (volume) {
		audioElement.volume = volume;
	};

	return {
		addEvents: function (data) {
			let songElements;
			songElements = Array.from(
				document.querySelectorAll(DOMStrings.songElements)
			);
			songElements.forEach(function (curr) {
				curr.addEventListener("click", function () {
					let songName = curr.textContent.split("- ");
					data.currentSong = songName[1];
					setSong(data.currentSong);
					setTitleText(data.currentSong);
				});
			});

			document
				.querySelector(DOMStrings.audioElement)
				.addEventListener("timeupdate", setSongProgress);

			document
				.getElementById(DOMStrings.stopElement)
				.addEventListener("click", function () {
					controlSong("pause");
				});

			document
				.getElementById(DOMStrings.playElement)
				.addEventListener("click", function () {
					controlSong("play");
				});

			document
				.getElementById(DOMStrings.volumeRange)
				.addEventListener("change", function (curr) {
					setVolume(curr.target.value / 100);
				});
		},
	};
})();

/* CONTROLLER */
const controller = (function (UI, data) {
	let allData = data.getData();
	return {
		init: function () {
			console.log("App has started...");
			UI.addEvents(allData);
		},
	};
})(UIController, dataController);

controller.init();
