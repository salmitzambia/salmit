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

const GA4_MEASUREMENT_ID = "";
const ANALYTICS_CONSENT_KEY = "salmit-analytics-consent";

if (/^G-[A-Z0-9]+$/.test(GA4_MEASUREMENT_ID)) {
  let analyticsBanner;
  let consentChoice = null;
  try {
    consentChoice = localStorage.getItem(ANALYTICS_CONSENT_KEY);
  } catch {
    consentChoice = null;
  }

  const startAnalytics = () => {
    if (window.salmitAnalyticsStarted) return;
    window.salmitAnalyticsStarted = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", GA4_MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const analyticsScript = document.createElement("script");
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_MEASUREMENT_ID)}`;
    document.head.appendChild(analyticsScript);
  };

  const saveConsent = (choice) => {
    try {
      localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
    } catch {
      // Keep the choice for this visit if browser storage is unavailable.
    }
    if (choice === "granted") startAnalytics();
    if (choice === "denied" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
    if (analyticsBanner) analyticsBanner.hidden = true;
  };

  const showAnalyticsPreferences = () => {
    if (analyticsBanner) analyticsBanner.hidden = false;
  };

  document.querySelectorAll(".footer-bottom").forEach((footer) => {
    const settingsButton = document.createElement("button");
    settingsButton.className = "footer-cookie-settings";
    settingsButton.type = "button";
    settingsButton.textContent = "Analytics settings";
    settingsButton.addEventListener("click", showAnalyticsPreferences);
    footer.appendChild(settingsButton);
  });

  analyticsBanner = document.createElement("aside");
  analyticsBanner.className = "analytics-consent";
  analyticsBanner.setAttribute("role", "dialog");
  analyticsBanner.setAttribute("aria-labelledby", "analytics-consent-title");
  analyticsBanner.innerHTML = '<div class="consent-copy"><h2 id="analytics-consent-title">Help us improve this website</h2><p>Allow Google Analytics to measure visits and site usage. Analytics only starts if you accept. <a href="privacy.html">Privacy details</a></p></div><div class="consent-actions"><button class="consent-accept" type="button">Accept analytics</button><button class="consent-decline" type="button">Decline</button></div>';
  analyticsBanner.querySelector(".consent-accept").addEventListener("click", () => saveConsent("granted"));
  analyticsBanner.querySelector(".consent-decline").addEventListener("click", () => saveConsent("denied"));
  document.body.appendChild(analyticsBanner);
  analyticsBanner.hidden = consentChoice === "granted" || consentChoice === "denied";

  if (consentChoice === "granted") startAnalytics();
}
