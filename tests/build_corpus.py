#!/usr/bin/env python3
"""Dovetail oracle: independent python recompute of every layout."""
import json, os
IN = 25.4
def to_mm(v, u): return v*IN if u=='in' else v
CASES = [
    {'name':'drawer-side','unit':'mm','boardW':150,'boardT':12,'tails':4,'pinW':6,'ratio':8},
    {'name':'blanket-chest','unit':'mm','boardW':420,'boardT':19,'tails':9,'pinW':10,'ratio':6},
    {'name':'inches-box','unit':'in','boardW':6,'boardT':0.5,'tails':3,'pinW':0.25,'ratio':8},
    {'name':'one-tail','unit':'mm','boardW':80,'boardT':15,'tails':1,'pinW':8,'ratio':7},
    {'name':'too-many-tails','unit':'mm','boardW':50,'boardT':12,'tails':10,'pinW':6,'ratio':8},
    {'name':'steep-slope-thick','unit':'mm','boardW':120,'boardT':30,'tails':3,'pinW':6,'ratio':4},
    {'name':'thin-pins','unit':'mm','boardW':200,'boardT':12,'tails':5,'pinW':2,'ratio':8},
]
def oracle(o):
    u=o['unit'];W=to_mm(o['boardW'],u);T=round(o['tails']);p=to_mm(o['pinW'],u)
    N=o['ratio'];th=to_mm(o['boardT'],u)
    warns=[]
    if not T>=1: warns.append('at least one tail'); T=1
    if not p>0: warns.append('pin positive'); p=1
    h=p/2
    t=(W-2*h-(T-1)*p)/T
    tt=t-2*th/N
    if t<=0: warns.append('no tail width')
    if tt<=0: warns.append('slope eats tail')
    if p<3: warns.append('fragile pins')
    marks=[0.0];x=0.0
    x+=h;marks.append(x)
    for i in range(T):
        x+=t;marks.append(x)
        if i<T-1: x+=p;marks.append(x)
    x+=h;marks.append(x)
    return {'halfPin':h,'tailBase':t,'tailTop':tt,'pin':p,'marks':marks,'warnings':warns}
items=[{'name':c['name'],'input':c,'oracle':oracle(c)} for c in CASES]
out=os.path.join(os.path.dirname(os.path.abspath(__file__)),'expected.json')
json.dump({'items':items},open(out,'w'))
print('cases:',len(items))
