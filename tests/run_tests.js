/* Dovetail tests: engine layout vs tests/expected.json (python oracle). */
'use strict';
const fs=require('fs'),path=require('path');
const D=require(path.join(__dirname,'..','engine.js'));
const items=JSON.parse(fs.readFileSync(path.join(__dirname,'expected.json'),'utf8')).items;
let pass=0,fail=0;
const EPS=1e-9;
function close(l,a,b){if(Math.abs(a-b)<EPS)pass++;else{fail++;console.log('FAIL '+l+': got '+a+' want '+b);}}
function eq(l,a,b){if(a===b)pass++;else{fail++;console.log('FAIL '+l+': got '+a+' want '+b);}}
const FRAG={'at least one tail':'at least one','pin positive':'positive','no tail width':'no width','slope eats tail':'slope eats','fragile pins':'fragile'};
for(const it of items){
  const T=it.name+' ';
  const r=D.compute(it.input),o=it.oracle;
  close(T+'halfPin',r.halfPin,o.halfPin);
  close(T+'tailBase',r.tailBase,o.tailBase);
  close(T+'tailTop',r.tailTop,o.tailTop);
  close(T+'pin',r.pin,o.pin);
  eq(T+'marks len',r.marks.length,o.marks.length);
  for(let i=0;i<o.marks.length;i++)close(T+'mark'+i,r.marks[i],o.marks[i]);
  for(const w of o.warnings){
    if(r.warnings.some(m=>m.indexOf(FRAG[w])>=0))pass++;
    else{fail++;console.log('FAIL '+T+'missing warning '+w+' in '+JSON.stringify(r.warnings));}
  }
  if(!o.warnings.length)eq(T+'no warnings',r.warnings.length,0);
  // layout always ends at board width
  const W=D.toMm(it.input.boardW,it.input.unit||'mm');
  close(T+'span',r.marks[r.marks.length-1],W);
}
// sanity: marks strictly increase
const r=D.compute({unit:'mm',boardW:150,boardT:12,tails:4,pinW:6,ratio:8});
let inc=true;for(let i=1;i<r.marks.length;i++)if(r.marks[i]<=r.marks[i-1])inc=false;
eq('increasing',inc,true);
close('in->mm',D.toMm(1,'in'),25.4);
console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
