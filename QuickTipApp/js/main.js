//DATA CONTROLLER
const dataController = (function () {
	let data = {
		bill: 0,
		tip: 0,
		split: 0,
		totalTip: 0,
		totalBill: 0,
		billEach: 0,
		tipEach: 0,
	};

	const calculateData = function () {
		data.totalTip = parseFloat(data.bill * (data.tip / 100)).toFixed(2);
		data.totalBill = (Number(data.bill) + Number(data.totalTip)).toFixed(2);
		/*data.totalBill = parseFloat(data.totalTip + parseFloat(data.bill)).toFixed(
			2
		); */
		data.billEach = (data.totalBill / data.split).toFixed(2);
		data.tipEach = (data.totalTip / data.split).toFixed(2);
	};

	return {
		setData: function (inputData) {
			data.bill = parseFloat(inputData.billData).toFixed(2);
			data.tip = parseInt(inputData.tipData);
			data.split = parseInt(inputData.splitData);

			calculateData();
		},
		getData: function () {
			return data;
		},
	};
})();

//UI CONTROLLER
const UIController = (function () {
	const DOMStrings = {
		startBtn: "start",
		headerContainer: "header",
		startAnim: "start",
		mainContainer: "main",
		inputBill: "bill",
		inputTip: "tip",
		inputSplit: "split",
		tipElement: "tip-percentage",
		totalTipElement: "total-tip",
		totalBillElement: "total-bill",
		splitElement: "split-text",
		billEachElement: "bill-each",
		tipEachElement: "tip-each",
	};

	return {
		getDOMElements: function () {
			return {
				startBtn: document.getElementById(DOMStrings.startBtn),
				headerContainer: document.querySelector(DOMStrings.headerContainer),
				mainContainer: document.querySelector(DOMStrings.mainContainer),
			};
		},
		getDOMStrings: function () {
			return DOMStrings;
		},
		getInputData: function () {
			return {
				billData: document.getElementById(DOMStrings.inputBill).value,
				tipData: document.getElementById(DOMStrings.inputTip).value,
				splitData: document.getElementById(DOMStrings.inputSplit).value,
			};
		},
		setInputData: function (data) {
			document.getElementById(DOMStrings.tipElement).textContent =
				data.tip + "%";
			document.getElementById(DOMStrings.totalTipElement).textContent = isNaN(
				data.totalTip
			)
				? "$ 0.00"
				: "$ " + data.totalTip;
			document.getElementById(DOMStrings.totalBillElement).textContent = isNaN(
				data.totalBill
			)
				? "$ 0.00"
				: "$ " + data.totalBill;
			document.getElementById(DOMStrings.splitElement).textContent =
				data.split > 1 ? data.split + " People" : data.split + " Person";
			document.getElementById(DOMStrings.billEachElement).textContent = isNaN(
				data.billEach
			)
				? "$ 0.00"
				: "$ " + data.billEach;
			document.getElementById(DOMStrings.tipEachElement).textContent = isNaN(
				data.tipEach
			)
				? "$ 0.00"
				: "$ " + data.tipEach;
		},
		resetInputData: function () {
			document.getElementById(DOMStrings.tipElement).textContent = "0%";
			document.getElementById(DOMStrings.totalTipElement).textContent =
				"$ 0.00";
			document.getElementById(DOMStrings.totalBillElement).textContent =
				"$ 0.00";
			document.getElementById(DOMStrings.splitElement).textContent = "1 Person";
			document.getElementById(DOMStrings.billEachElement).textContent =
				"$ 0.00";
			document.getElementById(DOMStrings.tipEachElement).textContent = "$ 0.00";
		},
	};
})();

//MAIN CONTROLLER
const controller = (function (UI, data) {
	let DOMElements, DOM;

	//ADD EVENT LISTENERS
	const addEventListeners = function () {
		DOMElements.startBtn.addEventListener("click", function () {
			DOMElements.headerContainer.classList.add(DOM.startAnim);
		});

		DOMElements.mainContainer.addEventListener("input", function () {
			data.setData(UI.getInputData());
			UI.setInputData(data.getData());
		});
	};

	//RETURN INIT FUNCTION OF THE APP
	return {
		init: function () {
			DOMElements = UI.getDOMElements();
			DOM = UI.getDOMStrings();
			UI.resetInputData();
			addEventListeners();
		},
	};
})(UIController, dataController);

controller.init();
