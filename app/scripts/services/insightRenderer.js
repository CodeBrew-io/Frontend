app.factory('insightRenderer', function() {
	var widgets = [];

	function renderCode(cm, cmMode, code, insight){
		var currentLine = code[insight.line - 1];
		var pre = document.createElement("pre");
		pre.className = "cm-s-solarized insight";
		pre.attributes["ng-class"] = "cm-s-{snippets.getThemeShort()}";
	  	CodeMirror.runMode(insight.result, cmMode, pre);
		cm.addWidget({line: (insight.line - 1), ch: currentLine.length}, pre, false, "over");
		return {
			clear: function(){ pre.parentElement.removeChild(pre); }
		}
	}

	function graph(cm, insight){
		var result = JSON.parse(insight.result);
		var data = result.data;
		var width = 200;
		var height = 200;

		var xf = function(v){ return v[0] };
		var yf = function(v){ return v[1] };

		var minX = d3.min(data, xf);
		var minY = d3.min(data, yf);
		var maxX = d3.max(data, xf);
		var maxY = d3.max(data, yf);

		var scaleX = d3.scale.linear().
			domain([minX, maxX]).
			range([0, width])

		var scaleY = d3.scale.linear().
			domain([minY, maxY]).
			range([height, 0])

		var line = d3.svg.line().
	    	x(function(v){ return scaleX(xf(v)); }).
	    	y(function(v){ return scaleY(yf(v)); })

	    var node = document.createElement("div");
	    node.className = "plot";
		var svg =  d3.select(node).append("svg").
	                attr("width", width).
	                attr("height", height);

		var plot = svg.append("path").
	        attr("d", line(result.data)).
	        attr("stroke", "blue").
	        attr("stroke-width", 2).
	        attr("fill", "none");

		return cm.addLineWidget(insight.line - 1, node);
	}
	function apply(cm, cmOptions, code, insight){
		if(insight.type == "CODE") {
			return renderCode(cm, cmOptions, code, insight);
		} else if (insight.type == "JSON") {
			return renderGraph(cm, insight);
		}
	}
	return {
		clear: function(){
			// clear insight
			widgets.forEach(function(w){ 
				w.clear();
			});
			widgets = [];
		},
		render: function(cm, cmOptions, code, insights){
			widgets = insights.map(function(insight){
				return apply(cm, cmOptions, code, insight);
			});
		}
	}
});