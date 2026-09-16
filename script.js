// 모바일 메뉴(햄버거 ☰) 열고 닫기
const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav-menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => menu.classList.toggle("open"));
  // 메뉴 항목을 누르면 자동으로 닫히게
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => menu.classList.remove("open"));
  });
}

// 컬렉션 쿼리와 예약 앵커에 맞춰 현재 메뉴를 표시합니다.
const pageParams = new URLSearchParams(window.location.search);
const currentCollection = pageParams.get("collection");

if (menu && currentCollection) {
  menu.querySelectorAll("a.active").forEach((link) => link.classList.remove("active"));
  const collectionLink = menu.querySelector(`[data-collection="${CSS.escape(currentCollection)}"]`);
  if (collectionLink) collectionLink.classList.add("active");
}

if (menu && window.location.hash === "#reservation") {
  menu.querySelectorAll("a.active").forEach((link) => link.classList.remove("active"));
  const reservationLink = menu.querySelector("[data-reservation-link]");
  if (reservationLink) reservationLink.classList.add("active");
}

// INTRODUCE·컬렉션·RESERVATION 메뉴에 대여/맞춤제작 하위 메뉴를 만듭니다.
const currentService = pageParams.get("service");
const serviceLabels = { rental: "대여", custom: "맞춤제작" };

if (menu) {
  const serviceMenuLinks = Array.from(menu.querySelectorAll(
    'a[href="about.html"], a[data-collection], a[data-reservation-link]'
  ));

  serviceMenuLinks.forEach((link) => {
    const item = document.createElement("div");
    const submenu = document.createElement("div");
    const submenuToggle = document.createElement("button");
    const label = link.textContent.trim();

    item.className = "nav-item has-submenu";
    link.classList.add("nav-primary-link");
    submenu.className = "nav-submenu";
    submenu.setAttribute("aria-label", label + " 서비스");

    submenuToggle.className = "nav-submenu-toggle";
    submenuToggle.type = "button";
    submenuToggle.setAttribute("aria-label", label + " 하위 메뉴 열기");
    submenuToggle.setAttribute("aria-expanded", "false");
    submenuToggle.textContent = "⌄";

    Object.entries(serviceLabels).forEach(([service, serviceLabel]) => {
      const serviceLink = document.createElement("a");
      const target = new URL(link.href, window.location.href);
      target.searchParams.set("service", service);
      serviceLink.href = target.pathname + target.search + target.hash;
      serviceLink.textContent = serviceLabel;
      if (currentService === service && link.classList.contains("active")) {
        serviceLink.classList.add("active");
      }
      serviceLink.addEventListener("click", () => menu.classList.remove("open"));
      submenu.appendChild(serviceLink);
    });

    link.before(item);
    item.append(link, submenuToggle, submenu);

    submenuToggle.addEventListener("click", () => {
      const willOpen = !item.classList.contains("submenu-open");
      menu.querySelectorAll(".submenu-open").forEach((openItem) => {
        openItem.classList.remove("submenu-open");
        openItem.querySelector(".nav-submenu-toggle")?.setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("submenu-open", willOpen);
      submenuToggle.setAttribute("aria-expanded", String(willOpen));
    });
  });
}

if (currentService && serviceLabels[currentService]) {
  const pageHead = document.querySelector(".page-head");
  if (pageHead) {
    const serviceLabel = document.createElement("p");
    serviceLabel.className = "service-label";
    serviceLabel.textContent = serviceLabels[currentService];
    pageHead.prepend(serviceLabel);
  }
}

// 여기에 다른 동작을 추가할 수 있습니다.
// 예: Codex에게 "스크롤하면 메뉴 배경을 진하게 해줘" 처럼 말하면 코드가 채워집니다.
