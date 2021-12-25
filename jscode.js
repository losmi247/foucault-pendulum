"use strict";

var tl;
var PI;
var latitude;
var constantfactor;
var omegaE;
var omega;
var length;
var g;
var omega0;

var gamma1,gamma2;

var stopped;

var time,dt;
var scale;

var C1r,C1i,C2r,C2i;

var xp,yp,v0x,v0y,a0x,a0y;

function init(){
  time = 0;
  dt = 30;
  scale = 5;
  document.getElementById("timer").innerHTML = "t = 0.00s";
  
  stopped = 1;
  
  
  
  tl = 100;
  PI = Math.PI;
  latitude = PI/4; /// latitude from -PI/2 to PI/2
  constantfactor = 1000;
  omegaE = 0.00007; /// this is constant - the speed of the Earth's rotation
  omega = (constantfactor*omegaE)*Math.sin(latitude); /// depends on the latitude
  length = 60; /// the length of the cable
  g = 9.81; /// the acceleration due to gravity
  omega0 = Math.sqrt(g/length); /// the pendulum's own frequency
  gamma1 = -omega+Math.sqrt(omega*omega+omega0*omega0); /// gamma1 / i
  gamma2 = -omega-Math.sqrt(omega*omega+omega0*omega0); /// gamma2 / i
  
  
  
  C1r = 40;
  C1i = 0;
  C2r = 40;
  C2i = 0;
  document.getElementById("realc1").value = C1r;
  document.getElementById("imaginaryc1").value = C1i;
  document.getElementById("realc2").value = C2r;
  document.getElementById("imaginaryc2").value = C2i;
  latitude = PI/4;
  document.getElementById("lat").value = (latitude/PI)*180;
  constantfactor = 1000;
  document.getElementById("const").value = constantfactor;
  update();
  
  time = 0;
  drawaxes();
  draw();
  time = 0;
  document.getElementById("timer").innerHTML = "t = "+time.toPrecision(3)+" s";
}

function update(){
	// restart the animation
  time = 0;
  stop();
  stopped = /*0*/1;
  var cnv = document.getElementById('cnv1');
  var ctx = cnv.getContext('2d');
  ctx.clearRect(0,0,cnv.width,cnv.height);
  
  
	//update the values of C1 and C2
  var c1r = document.getElementById("realc1").value;
  var c1i = document.getElementById("imaginaryc1").value;
  var c2r = document.getElementById("realc2").value;
  var c2i = document.getElementById("imaginaryc2").value;
  C1r = c1r;
  C1i = c1i;
 	C2r = c2r;
  C2i = c2i;
  var lat1deg = document.getElementById("lat").value;
  latitude = (lat1deg/180)*PI;
  var con1 = document.getElementById("const").value;
  constantfactor = con1;
  
  ///update the fixed values
  document.getElementById("omegaearth").innerHTML = omegaE.toPrecision(3);
  document.getElementById("length").innerHTML = length.toPrecision(3);
  document.getElementById("gravity").innerHTML = g.toPrecision(3);
  document.getElementById("ownfrequency").innerHTML = omega0.toPrecision(3);
  
  var omeganew = (constantfactor*omegaE)*Math.sin(latitude); /// depends on the latitude
  omega = omeganew;
	var gamma1new = -omega+Math.sqrt(omega*omega+omega0*omega0); /// gamma1 / i
	var gamma2new = -omega-Math.sqrt(omega*omega+omega0*omega0); /// gamma2 / i
  gamma1 = gamma1new;
  gamma2 = gamma2new;
  
  //update the initial conditions: positions, speeds and accelerations 
  xp = parseFloat(C1r)+parseFloat(C2r);
  yp = parseFloat(C1i)+parseFloat(C2i);
  document.getElementById("x0").innerHTML = xp.toPrecision(3);
  document.getElementById("y0").innerHTML = yp.toPrecision(3);
  v0x = -parseFloat(C1i)*gamma1-parseFloat(C2i)*gamma2;
  v0y = parseFloat(C1r)*gamma1+parseFloat(C2r)*gamma2;
  document.getElementById("v0x").innerHTML = v0x.toPrecision(3);
  document.getElementById("v0y").innerHTML = v0y.toPrecision(3);
  a0x = -parseFloat(C1r)*gamma1*gamma1-parseFloat(C2r)*gamma2*gamma2;
  a0y = -parseFloat(C1i)*gamma1*gamma1-parseFloat(C2i)*gamma2*gamma2;
  document.getElementById("a0x").innerHTML = a0x.toPrecision(3);
  document.getElementById("a0y").innerHTML = a0y.toPrecision(3);
  
  
  time = 0;
  drawaxes();
  drawaxes();
  draw();
  time = 0;
  document.getElementById("timer").innerHTML = "t = "+time.toPrecision(3)+" s";
}

function drawaxes(){
  var cnv = document.getElementById('cnv1');
  var ctx = cnv.getContext('2d');  
  
  var w = cnv.width,h = cnv.height;
  
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(0, h/2);
  ctx.lineTo(w, h/2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w/2,0);
  ctx.lineTo(w/2,h);
  ctx.stroke();
  
  /// the labels
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.strokeText("X",480,265);
  
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.strokeText("Y",260,20);
}

let id = null;
var stopped;

function stop(){
  stopped = 1;
  window.clearInterval(id);
}

function play(){
	if(stopped){
  	if(time >= tl){
    	time = 0;
      stop();
      stopped = 0;
      var cnv = document.getElementById('cnv1');
  		var ctx = cnv.getContext('2d');
  		ctx.clearRect(0,0,cnv.width,cnv.height);
    	time = 0;
   	 	drawaxes();
      drawaxes();
   	 	draw();
    	time = 0;
    	window.clearInterval(id);
    	id = window.setInterval(draw,dt);
    }
    else{
    	stopped = 0;
    	window.clearInterval(id);
  		id = window.setInterval(draw,dt);
     }
  }
  else{
  	var cnv = document.getElementById('cnv1');
  	var ctx = cnv.getContext('2d');
  	ctx.clearRect(0,0,cnv.width,cnv.height);
    time = 0;
    drawaxes();
    drawaxes();
    draw();
    time = 0;
    window.clearInterval(id);
    id = window.setInterval(draw,dt);
  }

  /*if(stopped == 0 || (stopped == 1 && time > 20)) time = 0;
  var wasstopped = stopped;
  stopped = 0;
  
  var cnv = document.getElementById('cnv1');
  var ctx = cnv.getContext('2d');
  ctx.clearRect(0,0,cnv.width,cnv.height);
  drawaxes();
  draw();
 	if(wasstopped) time = 0;
 
  window.clearInterval(id);
  id = window.setInterval(draw,dt);*/
}

function xnow(now){
	return parseFloat(C1r)*Math.cos(gamma1*now)-parseFloat(C1i)*Math.sin(gamma1*now)+
  parseFloat(C2r)*Math.cos(gamma2*now)-parseFloat(C2i)*Math.sin(gamma2*now);
}
function ynow(now){
	return parseFloat(C1r)*Math.sin(gamma1*now)+parseFloat(C1i)*Math.cos(gamma1*now)+
  parseFloat(C2r)*Math.sin(gamma2*now)+parseFloat(C2i)*Math.cos(gamma2*now);
}

function draw(){
  var cnv = document.getElementById('cnv1');
  var ctx = cnv.getContext('2d');
  //ctx.clearRect(0,0,cnv.width,cnv.height);
  
  /*ctx.beginPath();
  var dx = 0.01;
  var len = Math.round((cnv.width/2)/dx);
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 3;
  for(var i = -len+1; i <= len-1; i++){
    var x = i*dx;
    var y = 20;
    if(i == -len+1) ctx.moveTo(cnv.width/2+x,cnv.height/2-y);
    else ctx.lineTo(cnv.width/2+x,cnv.height/2-y);
  }
  ctx.stroke();*/
 
  var xval = xnow(time);
  var yval = ynow(time);
  /*ctx.fillStyle = 'red';
  ctx.fillRect(cnv.width/2+xval,cnv.height/2-yval,4,4);*/ 
  /*ctx.beginPath();
  ctx.fillStyle = 'blue';
	ctx.arc(cnv.width/2+xval,cnv.height/2-yval,5,0,2*PI);
	ctx.fill();*/
  ctx.beginPath();
  ctx.fillStyle = 'red';
  ctx.arc(cnv.width/2+xval,cnv.height/2-yval,2,0,2*PI);
  ctx.fill();
  
  /*if(!stopped){
  	ctx.clearRect(cnv.width/2+xval-3,cnv.height/2-yval-3,6,6,cnv.height);
  	drawaxes();  
  }

  if(time > 0){
  	var xprev = xnow(time-dt*1e-3),yprev = ynow(time-dt*1e-3);
    ctx.beginPath();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 5;
    ctx.moveTo(cnv.width/2+xval,cnv.height/2-yval);
    ctx.lineTo(cnv.width/2+xprev,cnv.height/2-yprev);
    ctx.stroke();
  }*/
  
  
  time += dt*1e-3;
  document.getElementById("timer").innerHTML = "t = "+time.toPrecision(3)+" s";
  
  if(time > tl){
  	stopped = 1;
    window.clearInterval(id);
    return;
  }
}

