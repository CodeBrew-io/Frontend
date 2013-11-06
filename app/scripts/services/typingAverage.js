
app.factory('typingAverage', ['$q', function($q) {
	var defer = $q.defer();

	var average = 1000;
	var variance = 500;

	var cummulValues = [];
	var totalPromise = -1;

	var timeoutHandle = null;
	
	var _timeToWaitConst = 500; // even the fastest will always have to wait at least 0.5 second
	
	// This function will calculate the new average with the new variance.
	function calculateAverage() {
		var diffSum = 0;
		var previousTime = 0;
		var size = cummulValues.length;

		// we need more than 1 value to be able to have a good average.
		if (size > 1) {
			previousTime = cummulValues[0];

			var diffList = [];
			for (var i = 1; i < size; i++) {
				var diff = cummulValues[i] - previousTime
				diffSum += diff;
				previousTime = cummulValues[i];

				diffList.push(diff);
			}

			average = diffSum / (size - 1);

			size = diffList.length;
			var cummulVariance = 0;
			for (var j = 0; j < size; j++) {
				var tmpValue = diffList[j] - average;

				cummulVariance += tmpValue * tmpValue;
			}

			variance = Math.sqrt(cummulVariance / size);
			cummulValues = [];
		}
	}

	// this function resets the data, and resolve the defer.
	function sendDataInner() {
		timeoutHandle = null;
		cummulValues = [];

		defer.resolve(totalPromise);
	}

	(function(){
		// at each 1 second, we recalculate the values of the typing.
		intervalHandle = window.setInterval(calculateAverage, 1000);
	})();

	return {
		onKeyPressed: function() {
			totalPromise += 1;
			cummulValues.push(new Date().getTime());

			// if we already have a timeout of setted, we clear it.
			if (timeoutHandle !== null) {
				window.clearTimeout(timeoutHandle);
			}
			// assign the new timeout before sending the data.
			timeoutHandle = window.setTimeout(sendDataInner, _timeToWaitConst + average + 2 * variance);

			if (totalPromise == 0) {
				return defer.promise;
			} else {
				return null;
			}
		},

		reset: function() {
			totalPromise = -1;
		}
	};
}]);