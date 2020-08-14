/* DATA CONTROLLER */
const dataController = (function () {
	let data = {
		runType: "m",
		goal: 0,
		unitsToday: [],
		total: 0,
		averageDistance: 0,
		weeksHigh: 0,
		percentage: 0,
	};

	const sumArray = function (arr) {
		let total = arr.reduce(function (total, curr) {
			return Number(total) + Number(curr);
		});

		return total;
	};

	const checkIsNan = function (num) {
		if (isNaN(num)) {
			return 0;
		}
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

	const toM = function (lastValue) {
		let multiplyValue;
		switch (lastValue) {
			case "km":
				multiplyValue = 1000;
				break;
			case "mi":
				multiplyValue = 1609;
				break;
		}

		data.unitsToday.forEach(function (curr) {
			curr = (curr * multiplyValue).toFixed(2);
		});
		data.goal = (data.goal * multiplyValue).toFixed(2);
		data.total = (data.total * multiplyValue).toFixed(2);
		data.averageDistance = (data.averageDistance * multiplyValue).toFixed(2);
		data.weeksHigh = (data.weeksHigh * multiplyValue).toFixed(2);
	};

	const toKM = function (lastValue) {
		switch (lastValue) {
			case "m":
				data.goal = (data.goal / 1000).toFixed(2);
				data.total = (data.total / 1000).toFixed(2);
				data.averageDistance = (data.averageDistance / 1000).toFixed(2);
				data.weeksHigh = (data.weeksHigh / 1000).toFixed(2);
				data.unitsToday.forEach(function (curr) {
					curr = (curr / 1000).toFixed(2);
				});
				break;
			case "mi":
				data.goal = (data.goal * 1.609).toFixed(2);
				data.total = (data.total * 1.609).toFixed(2);
				data.averageDistance = (data.averageDistance * 1.609).toFixed(2);
				data.weeksHigh = (data.weeksHigh * 1.609).toFixed(2);
				data.unitsToday.forEach(function (curr) {
					curr = (curr * 1.609).toFixed(2);
				});
				break;
		}
	};

	const toMI = function (lastValue) {
		switch (lastValue) {
			case "m":
				data.goal = (data.goal / 1609).toFixed(2);
				data.total = (data.total / 1609).toFixed(2);
				data.averageDistance = (data.averageDistance / 1609).toFixed(2);
				data.weeksHigh = (data.weeksHigh / 1609).toFixed(2);
				data.unitsToday.forEach(function (curr) {
					curr = (curr / 1609).toFixed(2);
				});
				break;
			case "km":
				data.goal = (data.goal / 1.609).toFixed(2);
				data.total = (data.total / 1.609).toFixed(2);
				data.averageDistance = (data.averageDistance / 1.609).toFixed(2);
				data.weeksHigh = (data.weeksHigh / 1.609).toFixed(2);
				data.unitsToday.forEach(function (curr) {
					curr = (curr / 1.609).toFixed(2);
				});
				break;
		}
	};

	return {
		getData: function () {
			return data;
		},
		calculateData: function (onlyData, dataChange) {
			switch (dataChange) {
				case "runType":
					data.runType = onlyData;
					break;
				case "goal":
					data.goal = Number(onlyData).toFixed(2);
					break;
				case "unitsToday":
					data.unitsToday.push(Number(onlyData).toFixed(2));
					data.total = Number(sumArray(data.unitsToday)).toFixed(2);
					data.averageDistance = Math.max(...data.unitsToday).toFixed(2);
					data.weeksHigh = calcHigh(data.unitsToday).toFixed(2);
					break;
			}

			data.percentage = 100 * (data.total / data.goal);
			data.percentage > 100 ? (data.percentage = 100) : 100;
		},
		changeUnits: function (lastValue, runType) {
			switch (runType) {
				case "m":
					toM(lastValue);
					break;
				case "km":
					toKM(lastValue);
					break;
				case "mi":
					toMI(lastValue);
					break;
			}

			data.percentage = 100 * (data.total / data.goal);
			data.percentage > 100 ? (data.percentage = 100) : 100;

			isNaN(data.goal) ? (data.goal = 0) : 10;
			isNaN(data.total) ? (data.total = 0) : 10;
			isNaN(data.averageDistance) ? (data.averageDistance = 0) : 10;
			isNaN(data.weeksHigh) ? (data.gweeksHigh = 0) : 10;
			data.unitsToday.forEach(function (curr) {
				isNaN(curr) ? (curr = 0) : 10;
			});
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
		daysContainerElement: "days-container",
		percentageBarElement: "progress-bar",
	};

	const addNewDay = function (item, runType) {
		let container = document.getElementById(DOMStrings.daysContainerElement);
		let newElement = document.createElement("li");
		newElement.textContent = item + runType;
		container.removeChild(container.firstElementChild);
		container.appendChild(newElement);
	};

	return {
		getDOMStrings: function () {
			return DOMStrings;
		},
		getInputData: function (calculate, dataChange, dataObj) {
			let allData, runType, goal, unitsToday;
			let selectElement = document.getElementById(DOMStrings.selectTypeElement);

			switch (dataChange) {
				case "runType":
					runType = selectElement.options[selectElement.selectedIndex].text;
					calculate(runType, dataChange);
					break;
				case "goal":
					goal = document.getElementById(DOMStrings.changeInput).value;
					calculate(goal, dataChange);
					break;
				case "unitsToday":
					unitsToday = document.getElementById(DOMStrings.unitTodayInput).value;
					calculate(unitsToday, dataChange);
					addNewDay(
						dataObj.unitsToday[dataObj.unitsToday.length - 1],
						dataObj.runType
					);
					break;
			}
		},
		displayData: function (data) {
			let runUnit;
			data.runType === "m"
				? (runUnit = "Meters")
				: data.runType === "km"
				? (runUnit = "Kilometers")
				: (runUnit = "Miles");

			/* DATA RUNTYPE PLACEHOLDER */
			document.getElementById(DOMStrings.unitTodayInput).placeholder =
				runUnit + " Today";

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

			/* DATA PERCENTAGE */
			document.getElementById(DOMStrings.percentageBarElement).style.width =
				data.percentage + "%";
		},
		resetDisplayData: function () {
			/* DATA TOTAL */
			document.getElementById(DOMStrings.totalRunElement).textContent =
				(0).toFixed(2) + "m";

			/* DATA TOTAL */
			document.getElementById(DOMStrings.totalElement).textContent =
				(0).toFixed(2) + "m";

			/* DATA GOAL */
			document.getElementById(DOMStrings.goalElement).textContent =
				(0).toFixed(2) + "m";

			/* DATA AVERAGE DISTANCE */
			document.getElementById(DOMStrings.averageDistance).textContent =
				(0).toFixed(2) + "m";

			/* DATA WEEKS HIGH */
			document.getElementById(DOMStrings.weeksHighElement).textContent =
				(0).toFixed(2) + "m";
		},
	};
})();

/* CONTROLLER */
const controller = (function (UI, dataCon) {
	/* ADD EVENT LISTENERS TO GET THE INPUT DATA */
	const addEventListeners = function () {
		let DOM = UI.getDOMStrings();
		let allData = dataCon.getData();
		let lastValue;

		document
			.getElementById(DOM.unitFormElement)
			.addEventListener("change", function () {
				lastValue = allData.runType;
				UI.getInputData(dataCon.calculateData, "runType", allData);
				dataCon.changeUnits(lastValue, allData.runType);
				UI.displayData(allData);
			});

		inputEvents(DOM.changeGoalElement, allData, "goal");
		inputEvents(DOM.unitToday, allData, "unitsToday");
	};

	/* SAME INPUT EVENTS FUNCTION */
	const inputEvents = function (id, data, type) {
		document.getElementById(id).addEventListener("submit", function (e) {
			e.preventDefault();
			UI.getInputData(dataCon.calculateData, type, data);
			UI.displayData(data);
		});
	};

	/* RETURN THE INIT MAIN FUNCTION TO START THE APPLICATION */
	return {
		init: function () {
			UI.resetDisplayData();
			addEventListeners();
		},
	};
})(UIController, dataController);

controller.init();
