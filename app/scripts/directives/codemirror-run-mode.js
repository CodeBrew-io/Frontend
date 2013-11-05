/*global angular, CodeMirror, Error*/
/**
 * Binds a CodeMirror widget to a <textarea> element.
 */
app.directive('syntaxhighlight', function($timeout) {
'use strict';

  return {
    restrict: 'E',
    require: '?ngModel',
    template: '<pre class=\"cm-s-solarized cm-s-light\"></pre>',
    link: function (scope, elm, attrs, ngModel) {

      $timeout(function() {
        var value = ngModel.$modelValue;
        var a_output = elm.find('pre');

        if (value){
          CodeMirror.runMode(value, attrs.syntaxtype , a_output[0]); 
        }
          
      });

      }
    }
  }
);
