app.run(function(scalaEval){
	CodeMirror.commands.autocomplete = function(cm) {
		var i;
		scalaEval.autocomplete(cm.getDoc().getValue(), cm.getDoc().indexFromPos(cm.getCursor())).then(function(data){

			if(angular.isString(data.completions)) {
				CodeMirror.showHint(cm, function(){
					return {from: cm.getCursor(), to: cm.getCursor(), list: [ " /*" + data.completions + "*/ "] };
				});
				return;
			}

			CodeMirror.showHint(cm, function(cm, options){
				var i;
				var curFrom = cm.getCursor();
				var curTo = cm.getCursor();
				var currentLine = cm.getDoc().getValue().split("\n")[curFrom.line];

				function delimiter(c){
					return  /^[a-zA-Z0-9\_]$/.test(c);
				}

				for (i = curFrom.ch-1; i >= 0 && delimiter(currentLine[i]); i--){
					curFrom.ch = i;
				}
				for (i = curTo.ch; i < currentLine.length && delimiter(currentLine[i]); i++){
					curTo.ch = i+1;
				}

				var term = currentLine.substr(curFrom.ch, curTo.ch - curFrom.ch);

				var completions = data.completions.filter(function(c){
					return c.name.toLowerCase().indexOf(term.toLowerCase()) != -1;
				}).map(function(c){ return {
					text: c.name,
					completion: c,
					alignWithWord: true,
					render: function(el, _, _1){
						$(el).text(c.signature);
					},
				}});
				return {from: curFrom, to: curTo, list: completions};
			});
		})
	};
});