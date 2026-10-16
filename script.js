/* ==========================================================
   Moms Touch — script.js

   ১) নিচের SHOP অংশে দোকানের আসল তথ্য বসান
   ২) তার নিচের products তালিকায় নিজের পণ্য বসান
   বাকি কোড ছোঁয়ার দরকার নেই।
   ========================================================== */

const SHOP = {
  // অর্ডার বাটন কোন মাধ্যমে খুলবে: "whatsapp" অথবা "messenger"
  orderVia: "whatsapp",

  // WhatsApp নম্বর: দেশের কোডসহ, + ছাড়া। যেমন: 8801712345678
  whatsapp: "8801948341487",

  // Facebook পেজের username (facebook.com/ এর পরের অংশ)। যেমন: momstouch.bd
  messenger: "YOUR_PAGE_NAME",

  // ফোন নম্বর। যেমন: 01712345678 (ফাঁকা রাখলে "ফোন করুন" বাটন লুকানো থাকবে)
  phone: "",

  // ঠিকানা ও খোলার সময় (ফাঁকা রাখলে সাইটে দেখাবে না)
  address: "",
  hours: "",
};

// পণ্যের বিভাগ। key ইংরেজিতে, label বাংলায়।
const categories = [
  { key: "all", label: "সব" },
  { key: "baby", label: "শিশুর যত্ন" },
  { key: "mom", label: "মায়ের যত্ন" },
  { key: "feeding", label: "ফিডিং" },
  { key: "toys", label: "খেলনা" },
  { key: "clothes", label: "পোশাক" },
];

// এগুলো নমুনা পণ্য। নিজের পণ্য ও দাম দিয়ে বদলান।
// sample: true লাইনটা মুছে দিলে কার্ড থেকে "নমুনা" লেখা সরে যাবে।
// ছবি থাকলে emoji এর বদলে image: "images/lotion.jpg" লিখুন।
const products = [
  { name: "বেবি লোশন", cat: "baby", emoji: "🧴", desc: "রোজকার যত্নের জন্য।", price: 350, sample: true },
  { name: "বেবি বাথ সেট", cat: "baby", emoji: "🛁", desc: "গোসলের দরকারি জিনিস এক সেটে।", price: 650, sample: true },
  { name: "ফিডিং বোতল", cat: "feeding", emoji: "🍼", desc: "সহজে ধরা যায়, সহজে পরিষ্কার হয়।", price: 420, sample: true },
  { name: "নরম খেলনা ভালুক", cat: "toys", emoji: "🧸", desc: "ছোট্ট হাতের আদরের সঙ্গী।", price: 550, sample: true },
  { name: "শিশুর জামার সেট", cat: "clothes", emoji: "👕", desc: "নরম কাপড়ের আরামদায়ক সেট।", price: 780, sample: true },
  { name: "মোজা ও টুপি সেট", cat: "clothes", emoji: "🧦", desc: "ঠান্ডার দিনের জন্য।", price: 320, sample: true },
  { name: "মায়ের কেয়ার ক্রিম", cat: "mom", emoji: "🌸", desc: "মায়ের নিজের যত্নের জন্য।", price: 480, sample: true },
  { name: "শিশুর খেলার ঝুনঝুনি", cat: "toys", emoji: "🪀", desc: "রঙিন ও হালকা।", price: 220, sample: true },
];

/* ---------- ছোট ছোট সাহায্যকারী function ---------- */

// ইংরেজি অঙ্ক বাংলায় বদলায়: 1200 → ১,২০০
function toBn(n) {
  return n.toLocaleString("en-US").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
}

// দোকানের নম্বর/পেজ বসানো হয়েছে কিনা দেখে
function isReady(via) {
  if (via === "messenger") {
    return SHOP.messenger !== "" && !SHOP.messenger.includes("YOUR");
  }
  return SHOP.whatsapp !== "" && !/X/i.test(SHOP.whatsapp);
}

// অর্ডার বাটনের লিংক বানায়
function orderLink(productName) {
  if (SHOP.orderVia === "messenger") {
    return "https://m.me/" + SHOP.messenger;
  }
  const text = productName
    ? `আসসালামু আলাইকুম, আমি "${productName}" অর্ডার করতে চাই।`
    : "আসসালামু আলাইকুম, আমি পণ্য সম্পর্কে জানতে চাই।";
  return "https://wa.me/" + SHOP.whatsapp + "?text=" + encodeURIComponent(text);
}

/* ---------- পণ্যের তালিকা ও ফিল্টার ---------- */

const grid = document.getElementById("productGrid");
const filters = document.getElementById("filters");

function renderProducts(filter) {
  const list = filter === "all" ? products : products.filter((p) => p.cat === filter);

  if (list.length === 0) {
    grid.innerHTML = '<p class="empty">এই বিভাগে এখন কোনো পণ্য নেই। অন্য বিভাগ দেখুন।</p>';
    return;
  }

  grid.innerHTML = list
    .map((p) => {
      const art = p.image
        ? `<img src="${p.image}" alt="${p.name}">`
        : `<span aria-hidden="true">${p.emoji}</span>`;
      const tag = p.sample ? '<span class="sample-tag">নমুনা</span>' : "";

      return `
        <article class="patch" data-cat="${p.cat}">
          ${tag}
          <div class="patch-art">${art}</div>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="patch-foot">
            <span class="price">৳ ${toBn(p.price)}</span>
            <a class="btn btn-warm btn-order" href="${orderLink(p.name)}"
               data-via="${SHOP.orderVia}" target="_blank" rel="noopener">অর্ডার করুন</a>
          </div>
        </article>`;
    })
    .join("");
}

function renderFilters() {
  // যে বিভাগে কোনো পণ্য নেই, সেই বিভাগের বাটন দেখানো হয় না
  const usable = categories.filter(
    (c) => c.key === "all" || products.some((p) => p.cat === c.key)
  );

  filters.innerHTML = usable
    .map(
      (c, i) =>
        `<button class="chip" type="button" data-filter="${c.key}" aria-pressed="${i === 0}">${c.label}</button>`
    )
    .join("");
}

filters.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  filters.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
  btn.setAttribute("aria-pressed", "true");
  renderProducts(btn.dataset.filter);
});

/* ---------- মোবাইল মেনু ---------- */

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("siteNav");

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

/* ---------- যোগাযোগের অংশ ---------- */

function setupContact() {
  const heroOrder = document.getElementById("heroOrder");
  heroOrder.href = orderLink("");
  heroOrder.dataset.via = SHOP.orderVia;
  heroOrder.target = "_blank";
  heroOrder.rel = "noopener";

  const messenger = document.getElementById("contactMessenger");
  messenger.href = "https://m.me/" + SHOP.messenger;
  messenger.target = "_blank";
  messenger.rel = "noopener";

  const whatsapp = document.getElementById("contactWhatsapp");
  whatsapp.href = "https://wa.me/" + SHOP.whatsapp;
  whatsapp.target = "_blank";
  whatsapp.rel = "noopener";

  const call = document.getElementById("contactCall");
  if (SHOP.phone) {
    call.href = "tel:" + SHOP.phone;
    call.hidden = false;
  }

  const info = document.getElementById("contactInfo");
  const lines = [];
  if (SHOP.address) lines.push("ঠিকানা: " + SHOP.address);
  if (SHOP.hours) lines.push("খোলা থাকে: " + SHOP.hours);
  lines.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    info.appendChild(li);
  });
}

// মেসেজের নম্বর বা পেজ এখনো না বসালে, ক্লিকে ভুল লিংকে না গিয়ে সতর্ক করে।
// (সব data-via লাগানো বাটনের জন্য একটাই listener, একে event delegation বলে)
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-via]");
  if (!el) return;
  if (!isReady(el.dataset.via)) {
    e.preventDefault();
    alert("দোকানের মেসেজ তথ্য এখনো বসানো হয়নি। script.js ফাইলের উপরের SHOP অংশে নিজের তথ্য বসান।");
  }
});

/* ---------- শুরু ---------- */

renderFilters();
renderProducts("all");
setupContact();
document.getElementById("year").textContent = toBn(new Date().getFullYear()).replace(",", "");
