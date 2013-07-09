

var FaceStub = function(svg) {
	this.svg = svg;
}

FaceStub.prototype.draw = function() {
	this.circ = this.svg.append('circle')
		.attr('r',1.2)
		.attr('cx',this.x)
		.attr('cy',this.y)
		.attr('stroke-width',0)
		.style('fill', 'black')
};

FaceStub.prototype.transformStubData = function(data) {
	this.x = data[0] + Math.random() * data[1];
	this.y = data[2];
	if (typeof data[4] === 'object')
		if (this.x > data[4][0] && this.x < data[4][1])
			this.transformStubData(data);
}

var color = d3.scale.category10();

$(document).ready(function() {
	initFace();
})

function initFace() {
	var w = 200,
	    h = 250;

	var svg = d3.select("#face").append("svg:svg")
	    .attr("width", w)
	    .attr("height", h);	

	// [startX, endX, Y, num]
	var stubData = [
		[30, 140, 185, 20],
		[35, 135, 190, 20,[75, 135]],
		[35, 130, 195, 20,[70, 140]],
		[35, 128, 200, 20,[75, 135]],
		[40, 125, 205, 20,[80, 130]],
		[45, 115, 210, 20,[85, 125]],
		[45, 110, 215, 20],
		[55, 95, 220, 20],
		[53, 90, 225, 20],
		[60, 80, 230, 20],
		[65, 70, 235, 20],
		[75, 50, 240, 20],
		[80, 45, 245, 20]
	]

	function growStubRow(a, i, full) {
		var fs = new FaceStub(svg);
		for (var i=0; i<a[3];i++) {
			fs.transformStubData(a);
			fs.draw()		
		}
	}

	stubData.forEach(growStubRow)


}

function initFace2() {
	var w = 400,
	    h = 400,
	    color = d3.scale.category10();

	var force = d3.layout.force()
	    .gravity(0)
	    .charge(-10)
	    .linkStrength(0)
	    .size([w, h]);

	var links = force.links(),
	    nodes = force.nodes(),
	    centers = [
	      {type: 0, x: 3 * w / 6, y: 2 * h / 6, fixed: true},
	      {type: 1, x: 4 * w / 6, y: 4 * h / 6, fixed: true}
	    ];

	var svg = d3.select("#face").append("svg:svg")
	    .attr("width", w)
	    .attr("height", h);

	svg.selectAll("circle")
	    .data(centers)
	  .enter().append("svg:circle")
	    .attr("r", 12)
	    .attr("cx", function(d) { return d.x; })
	    .attr("cy", function(d) { return d.y; })
	    .style("fill", fill)
	    .call(force.drag);

	force.on("tick", function(e) {
	  var k = e.alpha * .1;
	  nodes.forEach(function(node) {
	    var center = centers[node.type];
	    node.x += (center.x - node.x) * k;
	    node.y += (center.y - node.y) * k;
	  });

	  svg.selectAll("circle")
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });

	  svg.selectAll("line")
	      .attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });
	});

	var p0;

	svg.on("mousemove", function() {
	  var p1 = d3.svg.mouse(this),
	      a = {type: 0, x: p1[0], y: p1[1], px: (p0 || (p0 = p1))[0], py: p0[1]},
	      b = {type: 1, x: centers[1].x, y: centers[1].y, fixed:true},
	      link = {source: a, target: b};

	  p0 = p1;

	  svg.selectAll()
	      .data([a, b])
	    .enter().append("svg:circle")
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; })
	      .attr("r", 4.5)
	      .style("fill", fill)
	    .transition()
	      .delay(3000)
	      .attr("r", 1e-6)
	      .remove();

	  svg.insert("svg:line", "circle")
	      .data([link])
	    .transition()
	      .delay(3000)
	      .each("end", function() {
	        nodes.splice(nodes.indexOf(a), 1);
	        nodes.splice(nodes.indexOf(b), 1);
	        links.splice(links.indexOf(link), 1);
	      })
	      .remove();

	  nodes.push(a, b);
	  links.push(link);
	  force.start();
	});

	function fill(d) {
	  return color(d.type);
	}
}
