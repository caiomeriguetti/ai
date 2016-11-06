function create_inputs(n) {
	var namesElement = $("<ul></ul>");
	$("#origin, #dest").children().remove();
	$("#origin").append("<option >Origin</option>");
	$("#dest").append("<option >Destination</option>");

	for (var i = 1; i <= n; i++) {
		namesElement.append($('<li>'+(i)+' = <input type="text" data-num="'+(i)+'"></input></li>'))
		$("#origin").append("<option value='"+i+"' data-namefor='"+i+"'>"+i+"</option>");
		$("#dest").append("<option value='"+i+"' data-namefor='"+i+"'>"+i+"</option>");
	}

	$('.names').children().remove();
	$('.names').append(namesElement);

	var table = $("<table><thead></thead><tbody></tbody></table>");
	var thead = $("<tr></tr>");
	table.find('thead').append(thead);
	thead.append("<th></th>");
	for (var i = 1; i <= n; i++) {
		thead.append("<th data-namefor='"+i+"'>"+i+"</th>");
	}
	 
	for (var i = 1; i <= n; i++) {
		var line = $("<tr></tr>");
		line.append("<td data-namefor='"+i+"'>"+i+"</td>");
		for (var j = 1; j <= n; j++) {
			var col = $("<td></td>");
			var input = $("<input class='edge-input' type='text' data-edge='"+i+"-"+j+"'/>");
			if (i==j) {
				input.prop("readonly", true);
				input.prop("disabled", true);
			}
			col.append(input);
			line.append(col);
		}
		
		table.find("tbody").append(line);
	}

	$(".adj-matrix").html(table);

}

var graph;
function calculate_neighbors () {
	graph = new Graph({});
	$("[data-edge]").each(function (index, item) {
		
		var edge = $(item).data('edge').split('-');
		var val = $(item).val();

		if (val != "") {
			graph.addEdge(new Vertex({}, edge[0]), new Vertex({}, edge[1]), val);
			graph.addEdge(new Vertex({}, edge[1]), new Vertex({}, edge[0]), val);
		}

	});
}

function find_path (orig, dest) {
	calculate_neighbors();
	var bb = new BranchAndBound({});

	var path = bb.pathFind(graph, orig, dest);
	var vertices = path.getVertices();
	var names = [];
	for (var i = 0; i < vertices.length; i++) {
		var vid = vertices[i].getId();
		var val = $('[data-num="'+vid+'"]').val();

		if (!val) {
			val = vid;
		}
		
		names.push(val);
	}

	$(".result").html(names.join(",") + " = " + path.getCost());
}

function test_data() {
	create_inputs(8);
	$('[data-num="1"]').val("A");
	$('[data-num="2"]').val("B");
	$('[data-num="3"]').val("C");
	$('[data-num="4"]').val("D");
	$('[data-num="5"]').val("E");
	$('[data-num="6"]').val("F");
	$('[data-num="7"]').val("G");
	$('[data-num="8"]').val("S");
	$('[data-num]').trigger('keyup');

	$("[data-edge='8-1'],[data-edge='1-8']").val(3);
	$("[data-edge='8-4'],[data-edge='4-8']").val(4);
	$("[data-edge='1-4'],[data-edge='4-1']").val(5);
	$("[data-edge='1-2'],[data-edge='2-1']").val(4);
	$("[data-edge='2-5'],[data-edge='5-2']").val(5);
	$("[data-edge='4-5'],[data-edge='5-4']").val(2);
	$("[data-edge='2-3'],[data-edge='3-2']").val(4);
	$("[data-edge='6-5'],[data-edge='5-6']").val(4);
	$("[data-edge='6-7'],[data-edge='7-6']").val(3);

}

$(function () {

	$("#create-inputs").click(function () {
		create_inputs($("#num-vertices").val());
	});

	$("#test-data").click(function () {
		test_data();
	});

	$(document).on("keyup", "[data-num]", function (){
		var num = $(this).data("num");
		var name = $(this).val();
		if (name != "") {
			$('body [data-namefor="'+num+'"]').html(name);
		}
	});

	$("#find-path").click(function () {
		find_path($("#origin").val(), $("#dest").val());
	});

	

});
