'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),app=require('../server');

test('live schedules use one voice line per song and respect station assignment',()=>{
  const tracks=Array.from({length:8},(_,i)=>({id:i+1,duration:180}));
  const voices=[{id:'global',station:'all-stations',duration:5},{id:'main',station:'all',duration:5},{id:'top',station:'top',duration:5},{id:'fresh',station:'fresh',duration:5}];
  const plays=new Map(tracks.map((track,i)=>[String(track.id),100-i]));
  for(const [station,allowed] of [['all',new Set(['global','main'])],['top',new Set(['global','top'])],['fresh',new Set(['global','fresh'])]]){
    const schedule=app.locals.buildRadioSchedule(station,'2026-09-20',tracks,voices,plays);
    const songs=schedule.filter(item=>item.kind==='track'),lines=schedule.filter(item=>item.kind==='voice');
    assert.ok(songs.length>0);assert.equal(lines.length,songs.length);
    assert.ok(lines.every(line=>allowed.has(line.id)));
  }
});
