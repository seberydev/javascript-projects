/* FILTER CONTROLLER */
const filterController = (function () {
	const greyScaleFilter = function (i, data) {
		const grey = data[i] * 0.21 + data[i + 1] * 0.71 + data[i + 2] * 0.07;
		data[i] = grey;
		data[i + 1] = grey;
		data[i + 2] = grey;
	};

	const sepiaFilter = function (i, data) {
		const grey = data[i] * 0.21 + data[i + 1] * 0.71 + data[i + 2] * 0.07;
		data[i] = grey + 95;
		data[i + 1] = grey + 58;
		data[i + 2] = grey;
	};

	const invertFilter = function (i, data) {
		data[i] = 255 - data[i];
		data[i + 1] = 255 - data[i + 1];
		data[i + 2] = 255 - data[i + 2];
	};

	const RBGFilter = function (i, data) {
		let green = data[i + 2];
		data[i] = data[i];
		data[i + 1] = data[i + 2];
		data[i + 2] = green;
	};

	const BGRFilter = function (i, data) {
		let green = data[i];
		data[i] = data[i + 2];
		data[i + 1] = data[i + 1];
		data[i + 2] = green;
	};

	const GBRFilter = function (i, data) {
		let green = data[i];
		data[i] = data[i + 1];
		data[i + 1] = data[i + 2];
		data[i + 2] = green;
	};

	const GRBFilter = function (i, data) {
		let green = data[i];
		data[i] = data[i + 1];
		data[i + 1] = green;
		data[i + 2] = data[i + 2];
	};

	return {
		filterImage: function (imgData, context, type) {
			let data;
			if (imgData) {
				data = imgData.data;

				for (let i = 0; i < data.length; i += 4) {
					switch (type) {
						case "greyscale":
							greyScaleFilter(i, data);
							break;
						case "sepia":
							sepiaFilter(i, data);
							break;
						case "invert":
							invertFilter(i, data);
							break;
						case "rbg":
							RBGFilter(i, data);
							break;
						case "bgr":
							BGRFilter(i, data);
							break;
						case "gbr":
							GBRFilter(i, data);
							break;
						case "grb":
							GRBFilter(i, data);
							break;
					}
				}

				context.putImageData(imgData, 0, 0);
			}
		},
		resetFilter: function (img, reader) {
			img.src = reader.result;
		},
	};
})();

/* UI CONTROLLER */
const UIController = (function () {
	const DOMStrings = {
		inputElement: "file",
		canvasElement: "canvas",
		filterBtns: ".effects-buttons-container > button",
	};

	return {
		getFile: function () {
			return document.getElementById(DOMStrings.inputElement).files[0];
		},
		getDOM: function () {
			return DOMStrings;
		},
		getCanvas: function () {
			let canvas = document.getElementById(DOMStrings.canvasElement);
			let ctx = canvas.getContext("2d");

			return {
				canvas: canvas,
				ctx: ctx,
			};
		},
	};
})();

/* MAIN CONTROLLER */

const controller = (function (UI, filterC) {
	let DOM = UI.getDOM();
	let canvas = UI.getCanvas().canvas;
	let ctx = UI.getCanvas().ctx;
	let imgData;
	const filterButtons = document.querySelectorAll(DOM.filterBtns);
	let img;
	let reader;

	const addEvents = function () {
		document
			.getElementById(DOM.inputElement)
			.addEventListener("change", function (e) {
				let file;
				file = e.target.files[0];
				reader = new FileReader();
				img = new Image();

				reader.onload = function () {
					img.onload = function () {
						canvas.width = img.width;
						canvas.height = img.height;
						ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
						imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
					};
					img.src = reader.result;
				};

				reader.readAsDataURL(file);
			});

		/* GRAYSCALE BUTTON */
		filterButtons[0].addEventListener("click", function () {
			filterC.filterImage(imgData, ctx, "greyscale");
		});

		filterButtons[1].addEventListener("click", function () {
			filterC.filterImage(imgData, ctx, "sepia");
		});

		filterButtons[2].addEventListener("click", function () {
			filterC.filterImage(imgData, ctx, "invert");
		});

		filterButtons[3].addEventListener("click", function () {
			filterC.filterImage(imgData, ctx, "rbg");
		});

		filterButtons[4].addEventListener("click", function () {
			filterC.filterImage(imgData, ctx, "bgr");
		});

		filterButtons[5].addEventListener("click", function () {
			filterC.filterImage(imgData, ctx, "gbr");
		});

		filterButtons[0].addEventListener("click", function () {
			filterC.filterImage(imgData, ctx, "grb");
		});
	};

	const resetFilter = function () {
		img.src = reader.result;
	};

	return {
		init: function () {
			addEvents();
		},
	};
})(UIController, filterController);

controller.init();
