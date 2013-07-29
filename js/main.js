/* 
* Leap Motion test - Richard England - 2013
*/
window.Salts = (function(){

	'use strict';

	//cross browser requestAnimationFrame
	if ( !window.requestAnimationFrame ) {
 
		window.requestAnimationFrame = ( function() {
	 
			return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
				window.setTimeout( callback, 1000 / 60 );
	 			
			};
		} )();
	}

	//vars
	var version = '0.1',
	Salts = {},
	mouseX,
	mouseY,
	mouseZ,
	doScroll = true,
	winWidth = $(window).width(),
	targetX = 0,
	mouseX = (winWidth/2)+200,
	currLeft = 0,
	speedRate = 25,
	maxSpeed = 25,
	pano = $('.pano1 div.scroller'),
	parallax = $('.parallax'),
	parallax2 = $('.parallax2'),
	parallax3 = $('.parallax3'),
	pano1Blur = $('#pano-01-01-blur'),
	pano2Blur = $('#pano-02-01-blur'),
	pano3Blur = $('#pano-03-01-blur'),
	panoContainer = $(".slides section.panoContainer"),
	filterStrength = 20,
	frameTime = 0, lastLoop = new Date, thisLoop,
	// Report the fps only every second, to only lightly affect measurements
	fpsOut = document.getElementById('fps'),

	/* check for translate3d support */
	has3d = function() {
	    return ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
	},
	
	//animate
	render = function(){
			winWidth = $(window).width();
		    
		    var xDiff = (winWidth/2)-mouseX,
		    xPerc = xDiff/(winWidth/2),
		    xSpeed = parseInt(-maxSpeed*xPerc),
		    opacity = xSpeed/15;

		    //console.log(xSpeed)
		    var middle = parseInt(maxSpeed/4);
		    if(xSpeed > -middle && xSpeed < middle) xSpeed = 0;
		    if(xSpeed >= middle) xSpeed-=middle;
		    if(xSpeed <= -middle) xSpeed+=middle;

		    panoContainer.css('width', winWidth); 
		    panoContainer.css('left', -winWidth/2); 

		   	//currLeft = (has3d) ?  parseInt(pano.css('left')) : currLeft;
		    targetX-=xSpeed;

		    if(doScroll) currLeft += parseInt((targetX-currLeft)/8);

		    if(currLeft < -(7216*4)+winWidth) {
		    	currLeft = (-7216*4)+winWidth;
		    	targetX = currLeft;
		    }
		    if(currLeft > 0) {
		    	currLeft = 0;
		    	targetX = currLeft;
		    }

		    //opacity = Math.abs(opacity);
		    var dist = Math.abs(targetX-currLeft);
		    if( dist > 250) {
		    	opacity = (dist-80)/20;
		    	pano1Blur.css("opacity", 0);
		    } else {
		    	pano1Blur.css("opacity", 0);
		    }

		    if(doScroll){
			    if(has3d){
			    	//gfx accceleration
			    	pano.css('transform', 'translate3d('+parseInt(currLeft)+'px,0,0)');
			    	parallax.css('transform', 'translate3d('+parseInt(currLeft*1.25)+'px,0,0)');
			    	parallax2.css('transform', 'translate3d('+parseInt(currLeft*1.5)+'px,0,0)');
			    	parallax3.css('transform', 'translate3d('+parseInt(currLeft*3)+'px,0,0)');
			    } else {
			    	//the old fashioned way
			    	pano.css('left', currLeft);
			    }
			}

			var thisFrameTime = (thisLoop=new Date) - lastLoop;
			frameTime+= (thisFrameTime - frameTime) / filterStrength;
			lastLoop = thisLoop;

	},

	// kick off!
	// usage:
	// instead of setInterval(render, 16) ....
	animloop = function(){

	  requestAnimationFrame(animloop);
	  render();

	},

	//get mouse pos and save as vars
	onMouseMove = function(event) {

		mouseX = event.clientX;
		mouseY = event.clientY;

		if(doScroll){
			//console.log(mouseX);
			if(mouseY < 50 || mouseY > 650) mouseX = winWidth/2;
		}
		//console.log(mouseX,mouseY);
	},

	//set mouse pos externally
	setMousePos = function(x, y, z) {

		if(doScroll){
			mouseX = (x+0.5) * winWidth;
			mouseY = y;
			mouseZ = z;
		}

	},

	randomScroll = function(){
		var t = Math.random()*22000;
		console.log(t);
		targetX = -t;;
	}

	$(".slides section.panoContainer").css('width', winWidth); 
	//pano.css('left', '-21645px');

	//test scroller
	$('.testscroll').click( function(){
		randomScroll();
	})
	.css("cursor", "pointer");

	var msg = ["reflexarc.co.uk...", "Leap motion test", "Salts Mill", "richardengland.co.uk", "jonathanwilkinson.co.uk"];
	for(var i = 0; i < 50; i++){
		var n;
		var e = $("<span>"+msg[parseInt(Math.random()*msg.length)]+"</span>");
		e.css({'position': 'absolute', 'top':10+Math.random()*450, 'left':Math.random()*50000, width: 10000});
		parallax.append(e);
	}

	for(var i = 0; i < 25; i++){
		var e = $("<span>"+msg[parseInt(Math.random()*msg.length)]+"</span>");
		e.css({'position': 'absolute', 'top':10+Math.random()*450, 'left':Math.random()*50000, width: 10000});
		parallax2.append(e);
	}

	for(var i = 0; i < 10; i++){
		var e = $("<span>"+msg[parseInt(Math.random()*msg.length)]+"</span>");
		e.css({'position': 'absolute', 'top':50+Math.random()*400, 'left':Math.random()*50000, width: 10000});
		parallax3.append(e);
	}

	//FPS 
	setInterval(function(){
	  fpsOut.innerHTML = (1000/frameTime).toFixed(1) + " fps";
	},1000);

	$(document.body).on( 'mousemove', onMouseMove );

	animloop();

	Salts.setMousePos = setMousePos;
	Salts.randomScroll = randomScroll;
	Salts.scrollToEnd = function(){
		targetX = -24000;
	}
	Salts.scrollToBeginning = function(){
		targetX = 0;
	}
	Salts.swipeHorizontal = function( swipeStrength ){
		targetX+= swipeStrength;
	}
	Salts.largeSwipeHorizontal = function( swipeStrength ){
		targetX+= 100 * swipeStrength;
	}
	Salts.pano1 = function(){
		if(doScroll)  {
			window.location.assign("#/");
			setTimeout(function() { doScroll = true; } , 1000  );
			doScroll = false;
		}
	}
	Salts.pano2 = function(){
		
		
		if(doScroll)  {
			window.location.assign("#/0/1");
			setTimeout(function() { doScroll = true; } , 1000  );
			doScroll = false;
		}
	}


	return Salts;

})();
