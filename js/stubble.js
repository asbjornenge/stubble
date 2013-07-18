

var FaceStub = function() {
}

FaceStub.prototype.draw = function() {
	this.div = $('<div class="stub"></div>');
	this.div.css('top', this.y);
	this.div.css('left',this.x);
	$('#face').append(this.div);
};

FaceStub.prototype.transformStubData = function(data) {
	this.x = data[0] + Math.random() * data[1];
	this.y = data[2] + Math.random() * 2;
	if (typeof data[4] === 'object')
		if (this.x > data[4][0] && this.x < data[4][1])
			this.transformStubData(data);
}
FaceStub.prototype.growStub = function(factor) {
	var stub = this;
	setTimeout(function() {
		stub.div.css('opacity',1);
	},factor)
}

$(document).ready(function() {
	initFace();
	$('code').addClass('prettyprint');
	prettyPrint();
})

// [startX, endX, Y, num]
var stubData = [
	[30, 140, 160, 6, [35, 170]],
	[30, 140, 170, 8, [40, 165]],
	[30, 140, 175, 10,[50, 160]],
	[30, 140, 180, 10],
	[30, 140, 187, 20],
	[30, 140, 183, 20],
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

function initFace() {
	var w = 200,
	    h = 350;

	var faceStubs = [];
	function growStubRow(a, i, full) {
		for (var i=0; i<a[3];i++) {
			var fs = new FaceStub();
			fs.transformStubData(a);
			fs.draw()
			faceStubs.push(fs);	
		}
	}
	stubData.forEach(growStubRow)
	faceStubs.forEach(function(s,i,f) { s.growStub(10000+Math.random()*5*1000); })

}
