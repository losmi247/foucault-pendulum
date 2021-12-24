"use strict";

var PI = Math.PI;
var latitude = PI/4; /// latitude from -PI/2 to PI/2
var omegaE = 0.00007*1000; /// this is constant - the speed of the Earth's rotation
var omega = omegaE*Math.sin(latitude); /// depends on the latitude
var length = 60; /// the length ofthe cable
var g = 9.81; /// the acceleration due to gravity
var omega0 = Math.sqrt(g/length); /// the pendulum's own frequency
var gamma1 = -omega+Math.sqrt(omega*omega+omega0*omega0); /// gamma1 / i
var gamma2 = -omega-Math.sqrt(omega*omega+omega0*omega0); /// gamma2 / i
/// maybe add a table to tune the latitude ?, or even for the speed of earth's rotation

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
  
  stopped = 0;
  
  C1r = 40;
  C1i = 0;
  C2r = 40;
  C2i = 0;
  document.getElementById("realc1").value = C1r;
  document.getElementById("imaginaryc1").value = C1i;
  document.getElementById("realc2").value = C2r;
  document.getElementById("imaginaryc2").value = C2i;
  update();
  
  time = 0;
  draw();
  time = 0;
  document.getElementById("timer").innerHTML = "t = "+time.toPrecision(3)+" s";
}

function update(){
	//update the values of C1 and C2
  var c1r = document.getElementById("realc1").value;
  var c1i = document.getElementById("imaginaryc1").value;
  var c2r = document.getElementById("realc2").value;
  var c2i = document.getElementById("imaginaryc2").value;
  C1r = c1r;
  C1i = c1i;
 	C2r = c2r;
  C2i = c2i;
  
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
  
  time -= dt*1e-3;
  draw();
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
}

let id = null;
var stopped = 0;

function stop(){
  stopped = 1;
  window.clearInterval(id);
}

function play(){
  if(stopped == 0 || (stopped == 1 && time > 10)) time = 0;
  stopped = 0;
 
  window.clearInterval(id);
  id = window.setInterval(draw,dt);
}

function draw(){
  var cnv = document.getElementById('cnv1');
  var ctx = cnv.getContext('2d');
  ctx.clearRect(0,0,cnv.width,cnv.height);
  drawaxes();
  
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
 
  var xval = parseFloat(C1r)*Math.cos(gamma1*time)-parseFloat(C1i)*Math.sin(gamma1*time)+
  parseFloat(C2r)*Math.cos(gamma2*time)-parseFloat(C2i)*Math.sin(gamma2*time);
  var yval = parseFloat(C1r)*Math.sin(gamma1*time)+parseFloat(C1i)*Math.cos(gamma1*time)+
  parseFloat(C2r)*Math.sin(gamma2*time)+parseFloat(C2i)*Math.cos(gamma2*time);
  /*ctx.fillStyle = 'red';
  ctx.fillRect(cnv.width/2+xval,cnv.height/2-yval,4,4);*/
  ctx.beginPath();
  ctx.fillStyle = 'blue';
	ctx.arc(cnv.width/2+xval,cnv.height/2-yval,5,0,2*PI);
	ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = 'red';
  ctx.arc(cnv.width/2+xval,cnv.height/2-yval,3,0,2*PI);
  ctx.fill();

  
  
  time += dt*1e-3;
  document.getElementById("timer").innerHTML = "t = "+time.toPrecision(3)+" s";
  
  if(time > 20){
    window.clearInterval(id);
    return;
  }
}
