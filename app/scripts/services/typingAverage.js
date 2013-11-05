
app.factory('typingAverage', ['$q', '$rootScope', function($q, $rootScope) {
	var defer = $q.defer();

	var average = 1000;
	var variance = 500;

	var cummulValues = [];
	var totalTime = 0;

	var timeoutHandle = null;

	var _timeToWaitConst = 500; // even the fastest will always have to wait at least 0.5 second
	var $data = null;

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
		}
		cummulValues = [];
	}

	function sendDataInner() {
		timeoutHandle = null;
		cummulValues = [];

		console.log('average: ' + average);
		console.log('variance: ' + variance);

		defer.resolve($data);	
		defer = $q.defer();
	}

	(function(){
		// at each 1 second, we recalculate the values of the typing.
		window.setInterval(calculateAverage, 1000);
	})();

	return {
		onKeyPressed: function(data) {
			cummulValues.push(new Date().getTime());
			console.log("cummulValues.length:  " + cummulValues.length);

			$data = data;
			console.log('new $data == ' + $data);

			defer.notify($data);

			if (timeoutHandle !== null) {
				window.clearTimeout(timeoutHandle);
			}
			timeoutHandle = window.setTimeout(sendDataInner, _timeToWaitConst + average + 2 * variance);

			return defer.promise;
		}
	};
}]);