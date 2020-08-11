document.getElementById("start").addEventListener("click", function () {
	document.querySelector("header").classList.add("start");
});

//MAIN CONTROLLER
const controller = (function () {
	//ADD EVENT LISTENERS
	const addEventListeners = function () {
		console.log("hi");
	};

	//RETURN INIT FUNCTION OF THE APP
	return {
		init: function () {
			addEventListeners();
		},
	};
})();

controller.init();
