var i=(l,a,r)=>new Promise((u,s)=>{var h=e=>{try{t(r.next(e))}catch(n){s(n)}},o=e=>{try{t(r.throw(e))}catch(n){s(n)}},t=e=>e.done?u(e.value):Promise.resolve(e.value).then(h,o);t((r=r.apply(l,a)).next())});import{W as v}from"./index-0eaac4fb.js";class b extends v{canShare(){return i(this,null,function*(){return typeof navigator=="undefined"||!navigator.share?{value:!1}:{value:!0}})}share(a){return i(this,null,function*(){if(typeof navigator=="undefined"||!navigator.share)throw this.unavailable("Share API not available in this browser");return yield navigator.share({title:a.title,text:a.text,url:a.url}),{}})}}export{b as ShareWeb};