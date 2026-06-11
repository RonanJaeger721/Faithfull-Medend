const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartItems = document.querySelector("[data-cart-items]");
const cartCount = document.querySelector("[data-cart-count]");
const cartSummary = document.querySelector("[data-cart-summary]");
const checkout = document.querySelector("[data-whatsapp-checkout]");
const sourceLink = "https://www.alibaba.com/x/B21Psy?ck=pdp";
const phone = "263788160528";
const cart = new Map();

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const openCart = () => document.body.classList.add("cart-open");
const closeCart = () => document.body.classList.remove("cart-open");

const cartTotal = () => [...cart.values()].reduce((sum, item) => sum + item.qty, 0);

const checkoutMessage = () => {
  const lines = [...cart.values()].map((item, index) => `${index + 1}. ${item.name} x${item.qty} - ${item.price}`);
  return [
    "Hello Faithfull Medend, I would like to order these clothing items:",
    ...lines,
    "",
    `Alibaba sourcing reference: ${sourceLink}`,
    "Please confirm availability, sizes, and prices.",
    "Pickup/contact address: 29050 Chegutu"
  ].join("\n");
};

const renderCart = () => {
  const total = cartTotal();
  cartCount.textContent = total;
  cartSummary.textContent = total === 1 ? "1 item" : `${total} items`;

  if (!total) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add clothing items to start.</p>';
    checkout.classList.add("disabled");
    checkout.href = "#";
    return;
  }

  cartItems.innerHTML = [...cart.values()].map((item) => `
    <div class="cart-line">
      <div>
        <strong>${item.name}</strong>
        <span>${item.price} | Quantity ${item.qty}</span>
      </div>
      <button type="button" aria-label="Remove ${item.name}" data-remove="${item.name}">x</button>
    </div>
  `).join("");

  checkout.classList.remove("disabled");
  checkout.href = `https://wa.me/${phone}?text=${encodeURIComponent(checkoutMessage())}`;
};

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest("[data-product]");
    const name = card.dataset.name;
    const existing = cart.get(name);
    cart.set(name, {
      name,
      price: card.dataset.price,
      qty: existing ? existing.qty + 1 : 1
    });
    button.textContent = "Added";
    window.setTimeout(() => {
      button.textContent = "+ Add to cart";
    }, 900);
    renderCart();
    openCart();
  });
});

cartItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");
  if (!removeButton) return;
  cart.delete(removeButton.dataset.remove);
  renderCart();
});

document.querySelectorAll("[data-cart-open]").forEach((button) => {
  button.addEventListener("click", openCart);
});

document.querySelector("[data-cart-close]").addEventListener("click", closeCart);
document.querySelector("[data-cart-backdrop]").addEventListener("click", closeCart);

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

setHeaderState();
renderCart();
window.addEventListener("scroll", setHeaderState, { passive: true });
