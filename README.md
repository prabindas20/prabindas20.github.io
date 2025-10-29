<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Prabin Store — Demo E‑Commerce (COD)</title>
  <style>
    :root{--accent:#0b6cff;--muted:#666}
    *{box-sizing:border-box}
    body{font-family:Inter,system-ui,Segoe UI,Roboto,'Poppins',sans-serif;margin:0;background:#f4f6fb;color:#111}
    header{background:linear-gradient(90deg,#0b6cff,#6a8cff);color:#fff;padding:18px 20px;display:flex;align-items:center;justify-content:space-between}
    header h1{margin:0;font-size:18px}
    .controls{display:flex;gap:8px;align-items:center}
    button{background:var(--accent);color:white;border:none;padding:8px 12px;border-radius:8px;cursor:pointer}
    .secondary{background:white;color:var(--accent);border:1px solid rgba(11,108,255,0.15)}
    main{padding:18px;max-width:1100px;margin:18px auto}
    .grid{display:grid;grid-template-columns:1fr 320px;gap:20px}
    .products{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
    .card{background:white;border-radius:12px;padding:12px;box-shadow:0 6px 18px rgba(15,15,15,0.06)}
    .card img{width:100%;height:160px;object-fit:cover;border-radius:8px}
    .card h3{margin:8px 0 6px;font-size:16px}
    .price{color:var(--accent);font-weight:700}
    .btn-sm{padding:8px 10px;border-radius:8px}
    .sidebar .box{background:white;padding:12px;border-radius:12px;box-shadow:0 6px 18px rgba(15,15,15,0.06);margin-bottom:16px}
    label{display:block;font-size:13px;margin-bottom:6px;color:var(--muted)}
    input[type=text],input[type=number],textarea{width:100%;padding:8px;border-radius:8px;border:1px solid #e7e7ee}
    input[type=file]{padding:6px}
    small{color:var(--muted)}
    .cart-list{max-height:320px;overflow:auto}
    .cart-item{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f3f8}
    .center{display:flex;align-items:center;gap:8px}
    .admin-bar{display:flex;gap:8px;align-items:center}
    .order-list{max-height:220px;overflow:auto}
    .rating{color:#ffb400}
    .reviews{margin-top:10px}
    .product-detail img{height:240px}
    footer{padding:20px;text-align:center;color:var(--muted)}
    @media (max-width:880px){.grid{grid-template-columns:1fr} .sidebar{order:2}}
  </style>
</head>
<body>
  <header>
    <h1>Prabin Store — Demo E‑Commerce (COD)</h1>
    <div class="controls">
      <div class="admin-bar">
        <button id="admin-toggle">Admin Mode</button>
        <button id="view-orders" class="secondary">View Orders</button>
      </div>
      <button id="open-cart">Cart (<span id="cart-count">0</span>)</button>
    </div>
  </header>

  <main>
    <div class="grid">
      <section>
        <div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:12px">
          <div>
            <h2 style="margin:0">Products</h2>
            <small>Add products (as admin) and let customers add to cart & checkout (COD)</small>
          </div>
          <div class="center">
            <input id="search" type="text" placeholder="Search products..." style="padding:8px;border-radius:8px;border:1px solid #e7e7ee"/>
          </div>
        </div>

        <div id="products" class="products"></div>

        <div id="empty" style="text-align:center;color:var(--muted);padding:28px;display:none">No products yet. Admin can add products.</div>
      </section>

      <aside class="sidebar">
        <div class="box">
          <h3 style="margin:0 0 8px">Cart</h3>
          <div class="cart-list" id="cart-list"></div>
          <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center">
            <strong id="cart-total">Total: ₹0</strong>
            <button id="checkout" class="btn-sm">Checkout (COD)</button>
          </div>
        </div>

        <div class="box">
          <h3 style="margin:0 0 8px">Admin: Add Product</h3>
          <small>Toggle Admin Mode then add product</small>
          <div style="margin-top:8px">
            <label>Title</label>
            <input id="p-title" type="text" placeholder="Product title" />
            <label>Price (₹)</label>
            <input id="p-price" type="number" placeholder="499" />
            <label>Description</label>
            <textarea id="p-desc" rows="3" placeholder="Short description"></textarea>
            <label>Photo (jpg/png)</label>
            <input id="p-photo" type="file" accept="image/*" />
            <div style="margin-top:8px"><button id="add-product" class="secondary" disabled>Add Product</button></div>
          </div>
        </div>

        <div class="box">
          <h3 style="margin:0 0 8px">Recent Orders (Admin)</h3>
          <div class="order-list" id="order-list"></div>
        </div>
      </aside>
    </div>

    <!-- modal area for product detail and cart checkout -->
    <div id="modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);align-items:center;justify-content:center;padding:20px">
      <div id="modal-card" style="background:white;border-radius:12px;padding:18px;max-width:720px;width:100%;max-height:90vh;overflow:auto"></div>
    </div>
  </main>

  <footer>
    Demo client-side store • Data saved in browser only • For production use a backend & real payments
  </footer>

<script>
// Simple client-side e-commerce demo using localStorage
const ADMIN_PASSWORD = 'admin123'; // change if you like
let isAdmin = false;
let products = JSON.parse(localStorage.getItem('ps_products')||'[]');
let cart = JSON.parse(localStorage.getItem('ps_cart')||'[]');
let orders = JSON.parse(localStorage.getItem('ps_orders')||'[]');

// helpers
function saveAll(){localStorage.setItem('ps_products',JSON.stringify(products));localStorage.setItem('ps_cart',JSON.stringify(cart));localStorage.setItem('ps_orders',JSON.stringify(orders));}
function uid(n=6){return Math.random().toString(36).slice(2,2+n)}

// render functions
function renderProducts(filter=''){
  const container=document.getElementById('products');container.innerHTML='';
  const list = products.filter(p=>p.title.toLowerCase().includes(filter.toLowerCase()));
  if(list.length===0){document.getElementById('empty').style.display='block';} else {document.getElementById('empty').style.display='none';}
  list.forEach(p=>{
    const el=document.createElement('div');el.className='card';
    el.innerHTML=`<img src="${p.photo}" alt=""><h3>${escapeHtml(p.title)}</h3><p style=\"min-height:36px\">${escapeHtml(p.description)}</p><div style=\"display:flex;justify-content:space-between;align-items:center\"><div><div class=\"price\">₹${p.price}</div><small class=\"rating\">${renderStars(avgRating(p))} ${avgRating(p)>0?avgRating(p).toFixed(1):''}</small></div><div><button class=\"btn-sm\" onclick=\"openDetail('${p.id}')\">View</button> <button class=\"btn-sm\" onclick=\"addToCart('${p.id}')\">Add to Cart</button> ${isAdmin?'<button class=\\"btn-sm secondary\\" onclick=\\"deleteProduct(\\\''+p.id+'\\')\\">Delete</button>':''}</div></div>`;
    container.appendChild(el);
  });
}

function renderStars(n){ if(!n||n===0) return '☆☆☆☆☆'; let full=Math.floor(n); let out=''; for(let i=0;i<full;i++) out+='★'; for(let i=full;i<5;i++) out+='☆'; return out }
function avgRating(p){ if(!p.reviews||p.reviews.length===0) return 0; return p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length }
function escapeHtml(s){return (s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}

function updateCartUI(){document.getElementById('cart-count').textContent=cart.reduce((s,i)=>s+i.qty,0);
  const list = document.getElementById('cart-list'); list.innerHTML=''; let total=0;
  cart.forEach(item=>{const el=document.createElement('div');el.className='cart-item';el.innerHTML=`<div><strong>${escapeHtml(item.title)}</strong><div style="font-size:13px;color:var(--muted)">Qty: ${item.qty} • ₹${item.price}</div></div><div style="text-align:right"><div>₹${item.price*item.qty}</div><div style="margin-top:6px"><button class=\"secondary\" onclick=\"changeQty('minus','${item.id}')\">-</button> <button onclick=\"changeQty('plus','${item.id}')\">+</button></div></div>`; list.appendChild(el); total += item.price*item.qty; });
  document.getElementById('cart-total').textContent='Total: ₹'+total; document.getElementById('cart-total').dataset.total=total; saveAll();}

function changeQty(op,id){const idx=cart.findIndex(c=>c.id===id); if(idx<0) return; if(op==='plus') cart[idx].qty++; else {cart[idx].qty--; if(cart[idx].qty<=0) cart.splice(idx,1);} updateCartUI();}

function addToCart(pid){const p = products.find(x=>x.id===pid); if(!p) return alert('Product not found'); const existing = cart.find(c=>c.id===pid); if(existing){existing.qty++;} else {cart.push({id:pid,title:p.title,price:parseFloat(p.price),qty:1})} updateCartUI(); alert(p.title + ' added to cart');}

function openDetail(id){const p = products.find(x=>x.id===id); if(!p) return; const modal=document.getElementById('modal'); const card=document.getElementById('modal-card'); card.innerHTML = `
  <div style="display:flex;gap:18px;flex-wrap:wrap">
    <div style="flex:1 1 280px" class="product-detail"><img src='${p.photo}' alt=''><h2>${escapeHtml(p.title)}</h2><p style='color:var(--muted)'>₹${p.price}</p><p>${escapeHtml(p.description)}</p><div><button onclick="addToCart('${p.id}')">Add to Cart</button></div></div>
    <div style="flex:1 1 300px">
      <h3>Reviews</h3>
      <div class='reviews' id='reviews-area'></div>
      <hr>
      <h4>Add a review</h4>
      <label>Name</label><input id='rv-name' type='text' />
      <label>Rating (1-5)</label><input id='rv-rating' type='number' min='1' max='5' value='5' />
      <label>Comment</label><textarea id='rv-comment' rows='3'></textarea>
      <div style='margin-top:8px'><button onclick="submitReview('${p.id}')">Submit Review</button> <button class='secondary' onclick='closeModal()'>Close</button></div>
    </div>
  </div>`;
  modal.style.display='flex'; renderReviews(p.id);
}
function renderReviews(pid){const p=products.find(x=>x.id===pid); const area=document.getElementById('reviews-area'); area.innerHTML=''; if(!p.reviews||p.reviews.length===0) area.innerHTML='<small style="color:var(--muted)">No reviews yet</small>'; else p.reviews.slice().reverse().forEach(r=>{const d=document.createElement('div');d.style.padding='8px 0';d.innerHTML=`<strong>${escapeHtml(r.name)}</strong> <div class='rating'>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div><div style='font-size:13px;color:var(--muted)'>${escapeHtml(r.comment)}</div>`;area.appendChild(d)})}
function submitReview(pid){const name=document.getElementById('rv-name').value||'Anonymous'; const rating=parseInt(document.getElementById('rv-rating').value)||5; const comment=document.getElementById('rv-comment').value||''; const p=products.find(x=>x.id===pid); p.reviews = p.reviews||[]; p.reviews.push({name, rating, comment}); saveAll(); renderReviews(pid); renderProducts(document.getElementById('search').value||''); alert('Review added');}
function closeModal(){document.getElementById('modal').style.display='none';}

// admin functions
function enableAdmin(){const pass = prompt('Enter admin password'); if(pass===ADMIN_PASSWORD){isAdmin=true; document.getElementById('add-product').disabled=false; alert('Admin mode ON'); renderProducts(document.getElementById('search').value||'');} else {alert('Wrong password')}}
function toggleAdmin(){ if(isAdmin){isAdmin=false; document.getElementById('add-product').disabled=true; alert('Admin mode OFF'); } else enableAdmin(); renderProducts(document.getElementById('search').value||''); }

function fileToDataUrl(file){return new Promise((res,rej)=>{const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=()=>rej(); r.readAsDataURL(file);})}

async function addProductFromForm(){const title=document.getElementById('p-title').value.trim(); const price=document.getElementById('p-price').value; const desc=document.getElementById('p-desc').value.trim(); const file=document.getElementById('p-photo').files[0]; if(!title||!price||!file){return alert('Please provide title, price and photo');}
  const dataUrl = await fileToDataUrl(file);
  const p={id:uid(8),title,price:parseFloat(price),description:desc,photo:dataUrl,reviews:[]}; products.push(p); saveAll(); renderProducts(document.getElementById('search').value||''); alert('Product added');
  // clear form
  document.getElementById('p-title').value='';document.getElementById('p-price').value='';document.getElementById('p-desc').value='';document.getElementById('p-photo').value='';
}

function deleteProduct(id){ if(!confirm('Delete product?')) return; products = products.filter(p=>p.id!==id); cart = cart.filter(c=>c.id!==id); saveAll(); renderProducts(document.getElementById('search').value||''); updateCartUI(); }

// checkout (COD)
function checkoutCOD(){ if(cart.length===0) return alert('Cart empty'); const buyer = prompt('Enter your name for order (for delivery)'); if(!buyer) return alert('Order cancelled'); const address = prompt('Enter delivery address'); if(!address) return alert('Order cancelled'); const order = {id:'ORD-'+uid(6).toUpperCase(), buyer, address, items:cart.slice(), total: parseFloat(document.getElementById('cart-total').dataset.total||0), method:'COD', created: new Date().toISOString(), status:'Pending'}; orders.unshift(order); cart=[]; saveAll(); updateCartUI(); renderOrders(); alert('Order placed! Order ID: '+order.id+'\nPay on delivery.'); }

function renderOrders(){ const ol=document.getElementById('order-list'); ol.innerHTML=''; orders.slice(0,10).forEach(o=>{const d=document.createElement('div');d.style.padding='8px 0'; d.innerHTML=`<strong>${o.id}</strong> <div style="font-size:13px;color:var(--muted)">${o.buyer} • ₹${o.total} • ${new Date(o.created).toLocaleString()}</div><div style="font-size:13px">${o.items.map(i=>i.title + ' x'+i.qty).join(', ')}</div><div style="margin-top:6px"><small>${o.address}</small></div>`; ol.appendChild(d)})}

function viewOrdersPage(){ const modal=document.getElementById('modal'); const card=document.getElementById('modal-card'); card.innerHTML = `<h3>All Orders</h3><div style='max-height:60vh;overflow:auto'>${orders.map(o=>`<div style='padding:12px;border-bottom:1px solid #f1f3f8'><strong>${o.id}</strong><div style='font-size:13px;color:var(--muted)'>${o.buyer} • ₹${o.total} • ${new Date(o.created).toLocaleString()}</div><div style='margin-top:6px'>${o.items.map(i=>escapeHtml(i.title)+' x'+i.qty).join(', ')}</div><div style='margin-top:6px'><small>${escapeHtml(o.address)}</small></div></div>`).join('')}</div><div style='margin-top:8px'><button onclick='closeModal()' class='secondary'>Close</button></div>`; modal.style.display='flex'; }

// init
renderProducts(); updateCartUI(); renderOrders();

// UI wiring
document.getElementById('admin-toggle').addEventListener('click',toggleAdmin);
document.getElementById('add-product').addEventListener('click',addProductFromForm);
document.getElementById('open-cart').addEventListener('click',()=>{document.getElementById('modal-card').innerHTML=`<h3>Your Cart</h3><div id='cart-modal-list'></div><div style='margin-top:8px'><strong id='cart-modal-total'></strong><div style='margin-top:8px'><button onclick="checkoutCOD()">Place Order (COD)</button> <button class='secondary' onclick='closeModal()'>Close</button></div></div>`; const listEl=document.getElementById('cart-modal-list'); cart.forEach(i=>{const div=document.createElement('div');div.style.padding='6px 0';div.innerHTML=`<strong>${escapeHtml(i.title)}</strong> <div style='font-size:13px;color:var(--muted)'>Qty: ${i.qty} • ₹${i.price}</div>`; listEl.appendChild(div)}); document.getElementById('cart-modal-total').textContent='Total: ₹'+(cart.reduce((s,i)=>s+i.qty*i.price,0)||0); document.getElementById('modal').style.display='flex';});
document.getElementById('checkout').addEventListener('click',()=>{ if(cart.length===0) return alert('Cart empty'); checkoutCOD();});
document.getElementById('view-orders').addEventListener('click',()=>{ if(!isAdmin) return alert('Admin only'); viewOrdersPage();});
document.getElementById('search').addEventListener('input',(e)=>renderProducts(e.target.value));

</script>
</body>
</html>
