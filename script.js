const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll(".site-nav a[href]").forEach((link) => {
  const target = new URL(link.href, window.location.href);
  if (target.pathname === window.location.pathname) {
    link.setAttribute("aria-current", "page");
  }
});
