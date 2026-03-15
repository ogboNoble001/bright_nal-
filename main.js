'use strict';
const PRODS=[
  {id:1,name:'Woven Aso-oke Gown',cat:'Traditional',f:'traditional',price:89000,orig:null,badge:'new',img:'https://images.unsplash.com/photo-1547070855-e3f4cc43bcdb?w=600&h=750&fit=crop',sold:214},
  {id:2,name:'Contemporary Ankara Blouse',cat:'Contemporary',f:'casual',price:38000,orig:55000,badge:'sale',img:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=750&fit=crop&crop=top',sold:487},
  {id:3,name:'Embroidered Agbada Set',cat:'Menswear',f:'traditional',price:145000,orig:null,badge:'limited',img:'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=750&fit=crop',sold:62},
  {id:4,name:'Evening Wrap Dress',cat:'Dresses',f:'dresses',price:65000,orig:null,badge:'new',img:'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=750&fit=crop',sold:173},
  {id:5,name:'Silk Kaftan Set',cat:'Traditional',f:'traditional',price:72000,orig:90000,badge:'sale',img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=750&fit=crop',sold:305},
  {id:6,name:'Tailored Ankara Blazer',cat:'Outerwear',f:'outerwear',price:55000,orig:null,badge:null,img:'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&h=750&fit=crop',sold:119},
  {id:7,name:'Lace A-Line Skirt Set',cat:'Dresses',f:'dresses',price:32000,orig:null,badge:null,img:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=750&fit=crop',sold:244},
  {id:8,name:'Ankara Printed Co-ord',cat:'Casual',f:'casual',price:48000,orig:60000,badge:'sale',img:'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=750&fit=crop',sold:388},
];
let cart=[];
const fmt=n=>'&#8358;'+n.toLocaleString('en-NG');
const $=id=>document.getElementById(id);

function renderProds(f='all'){
  const list=f==='all'?PRODS:PRODS.filter(p=>p.f===f);
  $('prodGrid').innerHTML=list.map(p=>`
    <div class="pc">
      <div class="pc-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        ${p.badge?`<span class="pc-badge b-${p.badge}">${p.badge==='new'?'New':p.badge==='sale'?'Sale':'Limited'}</span>`:''}
        <div class="pc-acts">
          <button class="pc-ab" onclick="doWish(${p.id})" title="Save"><i data-lucide="bookmark" style="width:13px;height:13px;"></i></button>
          <button class="pc-ab" onclick="doQv(${p.id})" title="Quick view"><i data-lucide="eye" style="width:13px;height:13px;"></i></button>
        </div>
      </div>
      <div class="pc-body">
        <div class="pc-cat">${p.cat}</div>
        <div class="pc-name">${p.name}</div>
        <div class="pc-pr"><span class="pc-price">${fmt(p.price)}</span>${p.orig?`<span class="pc-orig">${fmt(p.orig)}</span>`:''}</div>
        <div class="pc-ft">
          <span class="pc-sold"><i data-lucide="users" style="width:10px;height:10px;"></i>&nbsp;${p.sold} purchases</span>
          <button class="pc-add" onclick="addCart(${p.id})">Add to Bag</button>
        </div>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

function addCart(id){
  const p=PRODS.find(x=>x.id===id),e=cart.find(x=>x.id===id);
  if(e)e.qty++;else cart.push({...p,qty:1});
  updCart();showToast(`Added: ${p.name}`);
}
function rmCart(id){cart=cart.filter(x=>x.id!==id);updCart();}
function updCart(){
  const tot=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cnt=cart.reduce((s,i)=>s+i.qty,0);
  const b=$('cartCount');b.textContent=cnt;b.style.display=cnt>0?'flex':'none';
  $('cpTotal').innerHTML=fmt(tot);
  $('cpSub').textContent=cnt>0?`\u00B7 ${cnt} item${cnt>1?'s':''}`:'';
  const body=$('cpBody');
  if(!cart.length){
    body.innerHTML=`<div class="cp-empty"><div class="cp-empty-ic"><i data-lucide="shopping-bag" style="width:20px;height:20px;"></i></div><div class="cp-empty-t">Your bag is empty</div><div class="cp-empty-s">Browse our collections and add pieces you love.</div></div>`;
  }else{
    body.innerHTML=cart.map(i=>`
      <div class="ci">
        <div class="ci-img"><img src="${i.img}" alt="${i.name}"/></div>
        <div class="ci-info">
          <div class="ci-name">${i.name}</div>
          <div class="ci-cat">${i.cat} &middot; Qty ${i.qty}</div>
          <div class="ci-row"><span class="ci-price">${fmt(i.price*i.qty)}</span><button class="ci-rm" onclick="rmCart(${i.id})">Remove</button></div>
        </div>
      </div>
    `).join('');
  }
  lucide.createIcons();
}
function doCheckout(){if(!cart.length){showToast('Your bag is empty');return;}showToast('Order placed \u2014 thank you!');cart=[];updCart();toggleCart();}
function toggleCart(){const o=$('cp').classList.toggle('open');$('cv').classList.toggle('open');document.body.style.overflow=o?'hidden':'';}
function doWish(id){showToast(`Saved: ${PRODS.find(x=>x.id===id).name}`);}
function doQv(id){const p=PRODS.find(x=>x.id===id);showToast(`${p.name} \u2014 ${p.price.toLocaleString('en-NG')} NGN`);}

let tT;
function showToast(msg){$('toastMsg').textContent=msg;$('toast').classList.add('show');clearTimeout(tT);tT=setTimeout(()=>$('toast').classList.remove('show'),2800);}

window.addEventListener('scroll',()=>{$('nav').classList.toggle('scrolled',window.scrollY>40);},{passive:true});

function openDrw(){$('drw').classList.add('open');$('dbg').classList.add('open');document.body.style.overflow='hidden';}
function closeDrw(){$('drw').classList.remove('open');$('dbg').classList.remove('open');document.body.style.overflow='';}
$('ham').addEventListener('click',openDrw);

document.querySelectorAll('.filt-btn').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.filt-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');renderProds(b.dataset.f);
  });
});

function handleNl(e){e.preventDefault();showToast('Subscribed! Welcome to the family.');e.target.reset();}

lucide.createIcons();
renderProds();
updCart();