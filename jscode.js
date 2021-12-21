"use strict";

var time,dt;
var scale;

function init(){
  time = 0;
  dt = 30;
  scale = 5;
  //draw();
  time = 0;
  document.getElementById("timer").innerHTML = "t = 0.00s";
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

function draw(){
  time += dt*1e-3;
  //document.getElementById("timer").innerHTML = "t = "+time.toPrecision(3)+" s";
  
  var cnv = document.getElementById('cnv1');
  var ctx = cnv.getContext('2d');
  ctx.clearRect(0,0,cnv.width,cnv.height);
  drawaxes();
  
  ctx.beginPath();
  var dx = 0.01;
  var len = Math.round((cnv.width/2)/dx);
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 3;
  for(var i = -len+1; i <= len-1; i++){
    var x = 0;
    var y = 0;
    if(i == -len+1) ctx.moveTo(cnv.width/2+x,cnv.height/2-y);
    else ctx.lineTo(cnv.width/2+x,cnv.height/2-y);
  }
  ctx.stroke();
}
