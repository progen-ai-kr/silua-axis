document.documentElement.classList.add("js");

const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav-menu");

function closeMenu() {
  if (!toggle || !menu) return;
  menu.classList.remove("open");
  menu.querySelectorAll(".nav-item.submenu-open").forEach((item) => item.classList.remove("submenu-open"));
  menu.querySelectorAll(".nav-dropdown-trigger").forEach((button) => button.setAttribute("aria-expanded", "false"));
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
  bookingLink.href = "contact.html?program=fitting#reservation-form";
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

// 모바일에서는 탭, 데스크톱에서는 hover/focus로 같은 드롭다운을 사용합니다.
document.querySelectorAll(".nav-dropdown-trigger").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".nav-item");
    if (!item) return;
    const open = !item.classList.contains("submenu-open");
    menu?.querySelectorAll(".nav-item.submenu-open").forEach((other) => {
      if (other === item) return;
      other.classList.remove("submenu-open");
      other.querySelector(".nav-dropdown-trigger")?.setAttribute("aria-expanded", "false");
    });
    item.classList.toggle("submenu-open", open);
    button.setAttribute("aria-expanded", String(open));
  });
});

// 참고 이미지 속 네 의상을 원본 그대로 보여주는 자동 히어로 슬라이드입니다.
const heroSlideshow = document.querySelector("[data-hero-slideshow]");
if (heroSlideshow) {
  const heroSlides = Array.from(heroSlideshow.querySelectorAll(".hero-slide"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeSlide = 0;
  let slideTimer;

  const showSlide = (index) => {
    heroSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });
  };

  const stopSlideshow = () => {
    window.clearInterval(slideTimer);
    slideTimer = undefined;
  };

  const startSlideshow = () => {
    stopSlideshow();
    if (heroSlides.length < 2 || reducedMotion.matches || document.hidden) return;
    slideTimer = window.setInterval(() => {
      activeSlide = (activeSlide + 1) % heroSlides.length;
      showSlide(activeSlide);
    }, 5000);
  };

  showSlide(activeSlide);
  startSlideshow();
  reducedMotion.addEventListener?.("change", startSlideshow);
  document.addEventListener("visibilitychange", startSlideshow);
}

// 정적 사이트에서도 예약 내용을 빠짐없이 정리해 바로 접수할 수 있게 돕습니다.
const reservationForm = document.querySelector("[data-reservation-form]");
if (reservationForm) {
  const params = new URLSearchParams(window.location.search);
  const programs = {
    "fitting": {
      eyebrow: "FITTING",
      title: "피팅 예약",
      description: "방문 예정일과 시간을 남겨주세요. SILUA 확인 연락 후 예약이 확정됩니다.",
      label: "피팅"
    },
    "personal-color": {
      eyebrow: "PERSONAL COLOR",
      title: "퍼스널컬러 예약",
      description: "가장 자연스럽게 빛나는 색감을 찾는 상담입니다. 방문 가능 시간을 선택해 주세요.",
      label: "퍼스널컬러"
    },
    "body-type": {
      eyebrow: "BODY TYPE",
      title: "체형진단 예약",
      description: "비례와 선을 살리는 스타일링 상담입니다. 방문 가능 시간을 선택해 주세요.",
      label: "체형진단"
    },
    "accessory-workshop": {
      eyebrow: "ACCESSORY WORKSHOP",
      title: "소품공방 예약",
      description: "구두, 가방, 부케 등 특별한 순간을 위한 디테일을 상담합니다.",
      label: "소품공방"
    }
  };
  const programKey = programs[params.get("program")] ? params.get("program") : "fitting";
  const program = programs[programKey];
  const productField = reservationForm.elements.product;
  const programField = reservationForm.elements.program;
  const accessoryChoice = reservationForm.querySelector("[data-accessory-choice]");
  const dateFields = reservationForm.querySelectorAll('input[type="date"]');
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateFields.forEach((field) => { field.min = localToday; });
  if (productField) productField.value = params.get("product") || "";
  if (programField) programField.value = program.label;
  document.querySelector("[data-program-eyebrow]") && (document.querySelector("[data-program-eyebrow]").textContent = program.eyebrow);
  document.querySelector("[data-program-title]") && (document.querySelector("[data-program-title]").textContent = program.title);
  document.querySelector("[data-program-description]") && (document.querySelector("[data-program-description]").textContent = program.description);
  document.querySelectorAll("[data-program-card]").forEach((card) => {
    card.setAttribute("aria-current", String(card.dataset.programCard === programKey));
  });
  if (accessoryChoice) {
    const showAccessoryChoice = programKey === "accessory-workshop";
    accessoryChoice.hidden = !showAccessoryChoice;
    accessoryChoice.querySelectorAll("input").forEach((input, index) => {
      input.required = showAccessoryChoice;
      input.checked = showAccessoryChoice && index === 0;
    });
  }

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!reservationForm.reportValidity()) return;
    const data = new FormData(reservationForm);
    const product = data.get("product") || "지정 상품 없음";
    const lines = [
      "[SILUA 예약 요청]",
      "성함: " + data.get("name"),
      "연락처: " + data.get("phone"),
      "예약 프로그램: " + data.get("program"),
      "소품 선택: " + (data.get("workshopItem") || "해당 없음"),
      "관심 상품: " + product,
      "방문 희망: " + data.get("date") + " " + data.get("time"),
      "문의 내용: " + (data.get("message") || "없음")
    ];
    const result = reservationForm.querySelector("[data-reservation-result]");
    const subject = encodeURIComponent("SILUA 예약 요청 - " + data.get("name"));
    const body = encodeURIComponent(lines.join("\n"));
    result.hidden = false;
    result.innerHTML = '<strong>예약 요청서가 준비되었습니다.</strong><p>아래 방법으로 보내주시면 SILUA 확인 연락 후 예약이 확정됩니다.</p><a href="mailto:siluadress@naver.com?subject=' + subject + '&body=' + body + '">이메일로 접수하기 →</a><a href="tel:070-4571-9545">전화로 접수하기 →</a>';
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}
