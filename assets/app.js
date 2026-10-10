"use strict";
const drinks = [
    { id: 1, name: "Classic Espresso", description: "Bold, rich, beautifully simple", category: "Hot", price: 2.5, background: "#ead7c2", color: "#533322", badge: "The classic" },
    { id: 2, name: "Velvet Latte", description: "Espresso meets silky milk", category: "Hot", price: 4.5, background: "#e7dcca", color: "#cfa779", badge: "Most loved" },
    { id: 3, name: "Iced Caramel", description: "Cool coffee, a caramel swirl", category: "Iced", price: 5, background: "#ead5bc", color: "#b77e53", badge: "" },
    { id: 4, name: "Cloud Cappuccino", description: "A soft, foamy morning favorite", category: "Hot", price: 4, background: "#dedfce", color: "#eadac0", badge: "" },
    { id: 5, name: "Cold Brew", description: "Slow steeped, smooth finish", category: "Iced", price: 4.25, background: "#ded5cc", color: "#644132", badge: "Stay cool" },
    { id: 6, name: "Honey Oat Latte", description: "Oat milk with a golden touch", category: "Special", price: 5.5, background: "#e7d4b0", color: "#d6b684", badge: "Something special" }
];
function element(id) { return document.getElementById(id); }
const money = (n) => "$" + n.toFixed(2);
let category = "All";
const cart = {};
try {
    const saved = JSON.parse(localStorage.getItem("slow-cup-cart") || "{}");
    for (const drink of drinks) {
        const quantity = saved[drink.id];
        if (typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0 && quantity <= 99)
            cart[drink.id] = quantity;
    }
}
catch { }
function renderMenu() {
    element("products").innerHTML = drinks.filter(d => category === "All" || d.category === category).map(d => `<article><div class="drink-art ${d.category === "Iced" ? "iced" : ""}" style="--bg:${d.background};--drink:${d.color}" role="img" aria-label="Illustration of ${d.name}">${d.badge ? `<span class="badge">${d.badge}</span>` : ""}<div class="mini-cup"><span>slow<br>cup.</span></div></div><div class="info"><div><h3>${d.name}</h3><p>${d.description}</p></div><button class="add" data-add="${d.id}" aria-label="Add ${d.name}">+</button></div><span class="price">${money(d.price)}</span></article>`).join("");
}
function renderCart() {
    const selected = drinks.filter(d => cart[d.id]);
    element("count").textContent = String(selected.reduce((n, d) => n + cart[d.id], 0));
    element("total").textContent = money(selected.reduce((n, d) => n + cart[d.id] * d.price, 0));
    element("items").innerHTML = selected.length ? selected.map(d => `<div class="row"><div><h3>${d.name}</h3><p>${money(d.price)} each</p></div><div class="controls"><button data-id="${d.id}" data-delta="-1" aria-label="Decrease ${d.name} quantity">−</button><span>${cart[d.id]}</span><button data-id="${d.id}" data-delta="1" aria-label="Increase ${d.name} quantity">+</button><button data-remove="${d.id}" aria-label="Remove ${d.name}">✕</button></div></div>`).join("") : "<p>Your bag is empty. Pick a little pick-me-up.</p>";
    element("checkout").disabled = selected.length === 0;
    element("message").textContent = "";
    try {
        localStorage.setItem("slow-cup-cart", JSON.stringify(cart));
    }
    catch { }
}
let timer;
document.addEventListener("click", (event) => {
    const target = event.target;
    const add = target.closest("[data-add]");
    if (add) {
        const id = Number(add.dataset.add);
        cart[id] = Math.min(99, (cart[id] || 0) + 1);
        renderCart();
        element("toast").textContent = "A little happiness added to your bag";
        element("toast").classList.add("visible");
        window.clearTimeout(timer);
        timer = window.setTimeout(() => element("toast").classList.remove("visible"), 2000);
    }
    const filter = target.closest("[data-category]");
    if (filter) {
        category = filter.dataset.category;
        document.querySelectorAll("[data-category]").forEach(b => b.classList.toggle("active", b === filter));
        renderMenu();
    }
    const change = target.closest("[data-delta]");
    if (change) {
        const id = Number(change.dataset.id);
        cart[id] = Math.min(99, cart[id] + Number(change.dataset.delta));
        if (cart[id] <= 0)
            delete cart[id];
        renderCart();
    }
    const remove = target.closest("[data-remove]");
    if (remove) {
        delete cart[Number(remove.dataset.remove)];
        renderCart();
    }
});
element("open-cart").addEventListener("click", () => element("cart").showModal());
element("close-cart").addEventListener("click", () => element("cart").close());
element("checkout").addEventListener("click", () => { element("message").textContent = "Your demo order is ready to review. No order has been submitted and no payment has been taken."; });
renderMenu();
renderCart();
