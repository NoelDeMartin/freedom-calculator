if(!self.define){let e,n={};const i=(i,r)=>(i=new URL(i+".js",r).href,n[i]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=n,document.head.appendChild(e)}else e=i,importScripts(i),n()})).then((()=>{let e=n[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,s)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(n[o])return;let l={};const t=e=>i(e,o),d={module:{uri:o},exports:l,require:t};n[o]=Promise.all(r.map((e=>d[e]||t(e)))).then((e=>(s(...e),l)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-Bvwxw3zc.css",revision:null},{url:"assets/index-DOxh655U.js",revision:null},{url:"index.html",revision:"221857041e4bdd811e695fe688b4db8f"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{revision:null,url:"/apple-touch-icon.png"},{revision:null,url:"/favicon-32x32.png"},{revision:null,url:"/favicon-16x16.png"},{revision:null,url:"/safari-pinned-tab.svg"},{url:"android-chrome-192x192.png",revision:"c9d676361846c24acf453091678596af"},{url:"android-chrome-512x512.png",revision:"f8fc6073721b64814d24c502a1d8772d"},{url:"manifest.webmanifest",revision:"1597da9a056fec712f665af9a44d5c75"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));