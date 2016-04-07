var app = angular.module("searchTutorial", []); 

app.controller("searchController", ["$scope", "$http", function($scope, $http) {

	var BASE_URL = "http://localhost:3000";
	var PDF_URL = BASE_URL + "/pdf/";
	var IMG_URL = BASE_URL + "/img/";
    var API_URL = BASE_URL + "/api/";
    var ELASTIC_URL = "http://localhost:9200/arxiv/file/_search";
    var CLOUD_CONTAINER = "#cloud";

	function searchRequestJSON(searchRequest) {

		return { "_source" : ["name"], "query" : { "match" : { "text" : searchRequest }} };
	}

	function transformSearchResponse(searchResponse) {
		hits = searchResponse.hits.hits;
		return hits.map(function(ele) { 
			source = ele._source;
			source.src = IMG_URL + source.name + ".png";
			pdf = source.name + ".pdf";
			source.file = pdf;
			source.href = PDF_URL + pdf;
			return source;
		});
	}

	$scope.search = function(searchRequest) {

		if (!searchRequest) return;

		d3.select(CLOUD_CONTAINER).selectAll("*").remove();

		$http.post(ELASTIC_URL, searchRequestJSON(searchRequest))
			.success(function(response) {

				$scope.hits = transformSearchResponse(response);
			});
	};

	var lastFile = "";

	$scope.callModel = function(file) {

		if (file === lastFile) return;
		lastFile = file;

		$http.get(API_URL + "?file=" + file)
			.success(function(response) {
				console.log(response)

				d3.select(CLOUD_CONTAINER).selectAll("*").remove();

				topics = response.response;
				topics.sort(function(x, y){return d3.descending(x.weight, y.weight);});
				topics.map(function(ele) {

					word2weight = ele.words;
					words = [];
					for (var word in word2weight) {
						words.push({ "text" : word, "size" : word2weight[word]*ele.weight });
					}
					renderWordCloud(CLOUD_CONTAINER, words, 400, 400);
				});
			});
	};

	function renderWordCloud(id, words, height, width) {

		var fontFamily = "Helvetica Neue";
		var fill = d3.scale.category20();

		var fontScale = d3.scale.linear()
			.domain([0, 0.01])
			.range([0, 100]);

		d3.layout.cloud()
			.size([width, height])
			.words(words)
			.font(fontFamily)
			.fontSize(function(d) { return fontScale(d.size); })
			.rotate(0)
			.on("end", draw)
			.start();

		function draw(words) {
			d3.select(id).append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g")
					.attr("transform", "translate(" + [width/2, height/2] + ")")
					.selectAll("text")
					.data(words)
					.enter()
					.append("text")
						.style("font-weight", "lighter")
						.style("font-family", function(d) { return d.font; })
						.style("font-size", function(d) { return d.size; })
						.style("fill", function(d, i) { return fill(i); })
						.attr("text-anchor", "middle")
						.attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")";})
						.text(function(d) { return d.text; })
		}
	}

}]);