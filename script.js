document.querySelectorAll("#year").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

document.querySelectorAll(".site-nav a[href], .header-cta[href]").forEach((link) => {
  const target = new URL(link.href, window.location.href);
  if (target.pathname === window.location.pathname) {
    link.setAttribute("aria-current", "page");
  } else {
    link.removeAttribute("aria-current");
  }
});

const quoteForm = document.getElementById("quote-form");
if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!quoteForm.reportValidity()) return;

    const data = new FormData(quoteForm);
    const lines = [
      "Quotation request for Salmit Zambia",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
    ];
    if (data.get("organization")) lines.push(`Organization: ${data.get("organization")}`);
    if (data.get("email")) lines.push(`Email: ${data.get("email")}`);
    if (data.get("quantity")) lines.push(`Quantity / users: ${data.get("quantity")}`);
    if (data.get("timeframe")) lines.push(`Preferred timeframe: ${data.get("timeframe")}`);
    lines.push(`Service: ${data.get("service")}`, `Project details: ${data.get("details")}`);

    const whatsappUrl = `https://wa.me/260770336134?text=${encodeURIComponent(lines.join("\n"))}`;
    const status = document.getElementById("quote-status");
    const opened = window.open(whatsappUrl, "_blank");
    if (opened) {
      opened.opener = null;
      status.textContent = "WhatsApp is ready with your request. Review the details and press send to submit it.";
      return;
    }

    const message = document.createTextNode("Your request is ready. ");
    const link = document.createElement("a");
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open your WhatsApp message";
    status.replaceChildren(message, link, document.createTextNode(" and press send to submit."));
  });
}
