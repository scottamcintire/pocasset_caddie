// Offline cache for the Pocasset Greens test app. Version changes whenever any file changes.
const CACHE='pocasset-greens-9d90c750c8';
const ASSETS=["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-512.png", "img/hole01.webp", "img/hole02.webp", "img/hole03.webp", "img/hole04.webp", "img/hole05.webp", "img/hole06.webp", "img/hole07.webp", "img/hole08.webp", "img/hole09.webp", "img/hole10.webp", "img/hole11.webp", "img/hole12.webp", "img/hole13.webp", "img/hole14.webp", "img/hole15.webp", "img/hole16.webp", "img/hole17.webp", "img/hole18.webp"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('pocasset-greens-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  // Pages: network first (so updates arrive), fall back to cache when offline. Images and files: cache first.
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))));return
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const c=n.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return n})));
});
