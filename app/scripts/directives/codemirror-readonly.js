app.directive('syntaxhighlight', function($timeout) {
'use strict';
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function (scope, elm, attrs, ngModel) {

		    var code = elm.html();

		    elm.empty();

		    var myCodeMirror = CodeMirror(elm, {
		        value: code,
		        mode: 'text/x-scala',
		        lineNumbers: elm.is('.inline'),
		        readOnly: true
		    });
		}
  }
});