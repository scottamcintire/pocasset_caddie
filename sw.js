// Offline cache for the main Pocasset Caddie app (V2.3). Version changes whenever any file changes.
// Only this app's own files are handled; other pages on the site (greens-test, hold2-test, v2.2.1) are left alone.
const CACHE='pocasset-caddie-d2d40f8b30';
const ASSETS=["./", "index.html", "greens/icon-180.png", "greens/hole01.webp", "greens/hole02.webp", "greens/hole03.webp", "greens/hole04.webp", "greens/hole05.webp", "greens/hole06.webp", "greens/hole07.webp", "greens/hole08.webp", "greens/hole09.webp", "greens/hole10.webp", "greens/hole11.webp", "greens/hole12.webp", "greens/hole13.webp", "greens/hole14.webp", "greens/hole15.webp", "greens/hole16.webp", "greens/hole17.webp", "greens/hole18.webp"];
const BASE=new URL('./',self.location).pathname;
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('pocasset-caddie-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  const p=u.pathname;
  if(p===BASE||p===BASE+'index.html'){
    // The app page: network first so updates arrive, cached copy when there is no signal.
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put('./',c))}return r}).catch(()=>caches.match('./')));return
  }
  if(p.startsWith(BASE+'greens/')){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const c=n.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return n})));
  }
});
