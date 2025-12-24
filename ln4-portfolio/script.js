const menu = document.querySelector("[data-menu]");
const backdrop = document.querySelector("[data-menu-backdrop]");
const openBtn = document.querySelector("[data-menu-button]");
const closeBtn = document.querySelector("[data-menu-close]");
const themeBtn = document.querySelector("[data-theme-toggle]");

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

function openMenu() {
  menu.hidden = false;
  document.body.classList.add("menu-open");
  openBtn.setAttribute("aria-expanded", "true");
  openBtn.setAttribute("aria-label", "Close menu");
  // Prevent background scroll
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  menu.hidden = true;
  document.body.classList.remove("menu-open");
  openBtn.setAttribute("aria-expanded", "false");
  openBtn.setAttribute("aria-label", "Open menu");
  document.body.style.overflow = "";
}

openBtn.addEventListener("click", () => {
  const isOpen = openBtn.getAttribute("aria-expanded") === "true";
  isOpen ? closeMenu() : openMenu();
});

if (closeBtn) closeBtn.addEventListener("click", closeMenu);
if (backdrop) backdrop.addEventListener("click", closeMenu);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !menu.hidden) closeMenu();
});

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  // Optional: persist
  localStorage.setItem("theme", next);
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

// Close menu when clicking a menu link (nice UX)
document.querySelectorAll(".menu-link").forEach((a) => {
  a.addEventListener("click", () => {
    if (!menu.hidden) closeMenu();
  });
});