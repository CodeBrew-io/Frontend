/*global angular, CodeMirror, Error*/
/**
 * Binds a CodeMirror widget to a <textarea> element.
 */
app.directive('syntaxhighlight', function($timeout) {
'use strict';


  
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function (scope, elm, attrs, ngModel) {

      $timeout(function() {
        var value = ngModel.$modelValue;

        if (value) {
          var accum = [], gutter = [], size = 0;

          CodeMirror.runMode(value, attrs.syntaxtype , function(string, style) {
            
              if (string == "\n") {
                  accum.push("<br>");
                  gutter.push('<pre>'+(++size)+'</pre>');
              }
              else if (style)
                  accum.push("<span class=\"cm-" + (style) + "\">" + (string) + "</span>");
              else
                  accum.push((string));

              elm.html(accum.join(''));
          });
        

          
         // numbers.innerHTML = gutter.join('');
        }

      });
    }
  }
});
