function Path(self) {
	var me = this;

	me.vertices = [];
	me.cost = null;

	self.addVertex = function (v) {
		me.vertices.push(v);
	};

	self.getVertices = function () {
		return me.vertices;
	}

	self.setVertices = function (vertices) {
		me.vertices = vertices;
	};

	self.setCost = function (cost) {
		me.cost = cost;
	};

	self.getCost = function () {
		return me.cost;
	};

	self.getLastVertex = function () {
		return me.vertices[me.vertices.length - 1];
	};

	self.clone = function () {
		var newPath = new Path({});
		for (var i = 0; i < me.vertices.length; i++) {
			newPath.addVertex(me.vertices[i]);
		}
		newPath.setCost(me.cost);

		return newPath;
	};

	self.isGoingBack = function () {
		var check = {};
		for (var i = 0; i < me.vertices.length; i++) {
			if (check[me.vertices[i].getId()] === true) return true;
			
			check[me.vertices[i].getId()] = true;
		}
		return false;
	}

	self.toString = function () {
		var ids = []
		for (var i = 0; i < me.vertices.length; i++) {
			ids.push(me.vertices[i].getId());
		}
		return "[ " + ids.toString() + " = " + me.cost + " ]";
	};

	return self;
}

function Vertex(self, id, name) {

	var me = this;

	me.name = name;
	me.id = id;

	self.setName = function (name) {
		me.name = name;
	};

	self.getName = function () {
		return me.name;
	};

	self.setId = function (id) {
		me.id = id;
	};

	self.getId = function () {
		return me.id;
	};

	self.toString = function () {
		return me.id;
	};

	return self;
}

function Edge (self, v1, v2, value) {
	var me = this;
	me.v1 = v1;
	me.v2 = v2;
	me.value = value;

	self.getV1 = function () {
		return me.v1;
	};

	self.getV2 = function () {
		return me.v2;
	};

	self.getValue = function () {
		return me.value;
	};

	return self;
}

function Graph (self) {
	var me = this;
	me.edges = {};
	me.edgesCheck = {};

	self.addEdge = function (v1, v2, value) {

		if (me.edges[v1] == undefined) me.edges[v1] = [];
		var edgeId = v1.getId() + "-" + v2.getId();
		if (me.edgesCheck[edgeId] === true) {
			return false;
		}

		me.edgesCheck[edgeId] = true;
		
		var e = new Edge({}, v1, v2, value);
		me.edges[v1].push(e);


		return e;
	};

	self.getNeighbors = function (v) {
		return me.edges[v];
	};

	return self;
	
}

function BranchAndBound (self) {
	var me = this;
	self.pathFind = function (graph, v1, v2) {

		var path_queue = [];
		var start_path = new Path({});
		start_path.addVertex(new Vertex({}, v1));

		path_queue.splice(0, 0, start_path);
		var  k = 0;
		var visiteds = {};

		while (path_queue.length > 0) {
			var removedPath = path_queue.splice(0, 1)[0];
			console.log("REMOVED ", removedPath.toString());
			var lastVertex = removedPath.getLastVertex();

			if (lastVertex.getId() == v2) {
				return removedPath;
			}

			if (visiteds[lastVertex.getId()] === true) {
				continue;
			}

			visiteds[lastVertex.getId()] = true;

			currentNeighbors = graph.getNeighbors(lastVertex.getId());
			
			console.log("QUEUE STATE ", path_queue.toString());

			for (var i = 0; i < currentNeighbors.length; i++) {
				var neighborData = currentNeighbors[i];

				var path = removedPath.clone();
				path.addVertex(new Vertex({}, neighborData.getV2()));
				path.setCost(removedPath.getCost() + parseFloat(neighborData.getValue()));

				if (path.isGoingBack()) continue;

				var index = path_queue.length;
				for (var t=0; t<path_queue.length; t++) {

					if (path.getCost() <= path_queue[t].getCost()) {
						index = t;
						break;
					}
				}
				path_queue.splice(index, 0, path);

				console.log("ADDED ", path.toString());

			}

			console.log("QUEUE STATE ", path_queue.toString());
			
		}
		return null;
	};

	return self;

}