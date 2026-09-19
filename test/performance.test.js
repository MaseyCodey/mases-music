'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),request=require('supertest');
process.env.NODE_ENV='test';
process.env.JWT_SECRET='performance-test-only-secret-long-enough';
process.env.ADMIN_EMAIL='admin@example.com';
process.env.ADMIN_PASSWORD_HASH='$2b$12$rS1JcyJx6T8hCjCSUzYbAOOqTiKSqj9WMZPzpjYvNLitCF0ng7V3K';
process.env.DATABASE_URL='postgresql://test:test@localhost/test';
process.env.GITHUB_REPOSITORY='example/music';
process.env.AUDIO_BASE_URL='https://media.example.com';
const app=require('../server');
test('catalog is usable without any database requests and concurrent loads share one GitHub read',async t=>{
  let calls=0;
  t.mock.method(globalThis,'fetch',async url=>{
    assert.ok(String(url).startsWith('https://api.github.com/repos/example/music/contents/'));
    calls++;
    await new Promise(resolve=>setTimeout(resolve,20));
    return new Response(JSON.stringify({content:Buffer.from(JSON.stringify([
      {id:1,title:'Song',artist:'Artist',path:'music/song.mp3'},
      {id:2,title:'Odd name',artist:'Artist',path:'music/original.mp3',audioPath:'music/Song (320 Kbps) (7).mp3'}
    ])).toString('base64')}),{status:200});
  });
  const responses=await Promise.all(Array.from({length:8},()=>request(app).get('/api/tracks').expect(200)));
  assert.equal(calls,1);
  for(const response of responses){assert.equal(response.body.tracks[0].title,'Song');assert.equal(response.body.tracks[0].audioUrl,'https://media.example.com/music/song.mp3');assert.equal(response.body.tracks[0].liked,false);assert.equal(response.body.tracks[1].audioUrl,'https://media.example.com/music/Song%20(320%20Kbps)%20(7).mp3')}
  await request(app).get('/api/tracks').expect(200);
  assert.equal(calls,1);
});
