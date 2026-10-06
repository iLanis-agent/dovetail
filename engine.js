/* Dovetail engine: tail/pin layout for through dovetails.
   Board layout alternates half-pin, tail, pin, tail, ..., half-pin.
   All math internally in millimeters. Pure JS, browser + Node. */
(function(root,factory){
  if(typeof module==='object'&&module.exports){module.exports=factory();}
  else{root.Dovetail=factory();}
})(typeof self!=='undefined'?self:this,function(){
'use strict';
var IN=25.4;
function toMm(v,u){return u==='in'?v*IN:v;}
function fromMm(v,u){return u==='in'?v/IN:v;}
/* o: {unit, boardW, boardT, tails, pinW, ratio}  ratio = slope 1:N */
function compute(o){
  var u=o.unit||'mm';
  var W=toMm(o.boardW,u),T=Math.round(o.tails),p=toMm(o.pinW,u);
  var N=o.ratio,th=toMm(o.boardT,u);
  var warnings=[];
  if(!(T>=1)){warnings.push('need at least one tail');T=1;}
  if(!(p>0)){warnings.push('pin width must be positive');p=1;}
  var h=p/2; // half pins at edges
  var t=(W-2*h-(T-1)*p)/T; // tail base width (wide face)
  var tailTop=t-2*th/N;    // narrow face width after slope through thickness
  if(t<=0)warnings.push('tails have no width: remove tails or widen the board');
  if(tailTop<=0)warnings.push('slope eats the tail: the narrow face goes negative (wider tails, gentler ratio, or thinner stock)');
  if(p<toMm(3,'mm'))warnings.push('pins under 3mm are fragile - chisel tips barely fit');
  // boundary marks from the left edge of the wide face
  var marks=[0],x=0,i;
  x+=h;marks.push(x);
  for(i=0;i<T;i++){
    x+=t;marks.push(x);
    if(i<T-1){x+=p;marks.push(x);}
  }
  x+=h;marks.push(x);
  return {unit:u,halfPin:h,tailBase:t,tailTop:tailTop,pin:p,marks:marks,warnings:warnings};
}
function fmt(v,u){
  var x=fromMm(v,u);
  return u==='in'?(Math.round(x*1000)/1000).toFixed(3):(Math.round(x*100)/100).toFixed(2);
}
return {compute:compute,fmt:fmt,toMm:toMm,fromMm:fromMm};
});
