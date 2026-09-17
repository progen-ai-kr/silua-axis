document.documentElement.classList.add("js");

const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav-menu");

function closeMenu() {
  if (!toggle || !menu) return;
  menu.classList.remove("open");
  toggle.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "메뉴 열기");
  document.body.classList.remove("menu-open");
}

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const open = !menu.classList.contains("open");
    menu.classList.toggle("open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    document.body.classList.toggle("menu-open", open);
  });
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const page = window.location.pathname.split("/").pop() || "index.html";
if (menu) {
  const activePage = page === "product.html" ? "products.html" : page;
  menu.querySelectorAll("a").forEach((link) => {
    const target = new URL(link.href, window.location.href);
    const linkedPage = target.pathname.split("/").pop();
    let isCurrent = linkedPage === activePage;
    if (activePage === "contact.html") {
      isCurrent = isCurrent && (window.location.hash === "#reservation"
        ? target.hash === "#reservation"
        : target.hash !== "#reservation");
    }
    if (isCurrent) link.setAttribute("aria-current", "page");
  });
}

const nav = document.querySelector(".nav");
function updateNav() {
  nav?.classList.toggle("is-scrolled", window.scrollY > 24);
}
updateNav();
window.addEventListener("scroll", updateNav, { passive: true });

if (!document.querySelector(".floating-book")) {
  const bookingLink = document.createElement("a");
  bookingLink.className = "floating-book";
  bookingLink.href = "contact.html#reservation";
  bookingLink.innerHTML = '<span aria-hidden="true">＋</span> 1:1 CONSULTATION';
  bookingLink.setAttribute("aria-label", "1대1 스타일링 상담 예약");
  document.body.appendChild(bookingLink);
}

const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const heroVideo = document.querySelector("[data-hero-video]");
if (heroVideo) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const syncHeroMotion = () => {
    if (reducedMotion.matches) {
      heroVideo.pause();
      heroVideo.currentTime = 0;
    } else {
      heroVideo.play().catch(() => {});
    }
  };
  syncHeroMotion();
  reducedMotion.addEventListener?.("change", syncHeroMotion);
}
