/* DATA CONTROLLER */
const dataController = (function () {
	let data = {
		runType: "m",
		goal: 0,
		unitsToday: [],
		total: 0,
		averageDistance: 0,
		weeksHigh: 0,
	};

	const sumArray = function (arr) {
		let total = arr.reduce(function (total, curr) {
			return Number(total) + Number(curr);
		});

		return total;
	};

	const calcHigh = function (arr) {
		let high, lastItem;
		high = [];
		arr.length >= 8 ? (lastItem = 8) : (lastItem = arr.length);

		for (let i = 0; i < lastItem; i++) {
			high.push(arr[i]);
		}

		return Math.max(...high);
	};

	return {
		getData: function () {
			return data;
		},
		calculateData: function (runType, goal, unitsToday) {
			data.runType = runType;
			data.goal = Number(goal).toFixed(1);
			data.unitsToday.push(Number(unitsToday).toFixed(1));
			data.total = Number(sumArray(data.unitsToday)).toFixed(1);
			data.averageDistance = Math.max(...data.unitsToday).toFixed(1);
			data.weeksHigh = (calcHigh(data.unitsToday)).toFixed(1);
		},
	};
})();

/* UI CONTROLLER */
const UIController = (function () {
	let DOMStrings = {
		unitFormElement: "units",
		selectTypeElement: "select-type",
		changeGoalElement: "change-goal",
		changeInput: "change-input",
		unitToday: "add-unit",
		unitTodayInput: "units-today",
		totalRunElement: "total-run",
		goalElement: "goal",
		totalElement: "total",
		averageDistance: "average-distance",
		weeksHighElement: "this-weeks",
	};

	return {
		getDOMStrings: function () {
			return DOMStrings;
		},
		getInputData: function (calculate) {
			let allData, runType, goal, unitsToday;
			let selectElement = document.getElementById(DOMStrings.selectTypeElement);
			runType = selectElement.options[selectElement.selectedIndex].text;
			goal = document.getElementById(DOMStrings.changeInput).value;
			unitsToday = document.getElementById(DOMStrings.unitTodayInput).value;
			calculate(runType, goal, unitsToday);
		},
		displayData: function (data) {
			/* DATA TOTAL */
			document.getElementById(DOMStrings.totalRunElement).textContent =
				data.total + data.runType;

			/* DATA TOTAL */
			document.getElementById(DOMStrings.totalElement).textContent =
				data.total + data.runType;

			/* DATA GOAL */
			document.getElementById(DOMStrings.goalElement).textContent =
				data.goal + data.runType;

			/* DATA AVERAGE DISTANCE */
			document.getElementById(DOMStrings.averageDistance).textContent =
				data.averageDistance + data.runType;

			/* DATA WEEKS HIGH */
			document.getElementById(DOMStrings.weeksHighElement).textContent =
				data.weeksHigh + data.runType;
		},
	};
})();

/* CONTROLLER */
const controller = (function (UI, dataCon) {
	/* ADD EVENT LISTENERS TO GET THE INPUT DATA */
	const addEventListeners = function () {
		let DOM = UI.getDOMStrings();
		let allData = dataCon.getData();

		document
			.getElementById(DOM.unitFormElement)
			.addEventListener("change", function () {
				UI.getInputData(dataCon.calculateData);
				UI.displayData();
			});

		inputEvents(DOM.changeGoalElement, allData);
		inputEvents(DOM.unitToday, allData);
	};

	/* SAME INPUT EVENTS FUNCTION */
	const inputEvents = function (id, data) {
		document.getElementById(id).addEventListener("submit", function (e) {
			e.preventDefault();
			UI.getInputData(dataCon.calculateData);
			UI.displayData(data);
		});
	};

	/* RETURN THE INIT MAIN FUNCTION TO START THE APPLICATION */
	return {
		init: function () {
			addEventListeners();
		},
	};
})(UIController, dataController);

controller.init();
