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
    if (window.salmitTrackEvent) {
      window.salmitTrackEvent("quote_request_prepared", { service_type: data.get("service") });
    }
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

// Add the GA4 Measurement ID and Clarity Project ID for Salmit's analytics accounts.
const GA4_MEASUREMENT_ID = "";
const CLARITY_PROJECT_ID = "";
const ANALYTICS_CONSENT_KEY = "salmit-analytics-consent";

const hasGA4 = /^G-[A-Z0-9]+$/.test(GA4_MEASUREMENT_ID);
const hasClarity = /^[a-z0-9]+$/i.test(CLARITY_PROJECT_ID);

if (hasGA4 || hasClarity) {
  let analyticsBanner;
  let consentChoice = null;
  try {
    consentChoice = localStorage.getItem(ANALYTICS_CONSENT_KEY);
  } catch {
    consentChoice = null;
  }
  let analyticsConsented = consentChoice === "granted";

  const startAnalytics = () => {
    if (window.salmitAnalyticsStarted) return;
    window.salmitAnalyticsStarted = true;
    if (hasGA4) {
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
    }
    if (hasClarity) {
      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r);
        t.async = 1;
        t.src = `https://www.clarity.ms/tag/${i}`;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
      window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
    }
  };

  const saveConsent = (choice) => {
    analyticsConsented = choice === "granted";
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
    if (choice === "denied" && window.clarity) window.clarity("consent", false);
    if (analyticsBanner) analyticsBanner.hidden = true;
  };

  const showAnalyticsPreferences = () => {
    if (analyticsBanner) analyticsBanner.hidden = false;
  };

  const trackAnalyticsEvent = (eventName, parameters = {}) => {
    if (!analyticsConsented) return;
    if (hasGA4 && window.gtag) window.gtag("event", eventName, parameters);
    if (hasClarity && window.clarity) window.clarity("event", eventName);
  };
  window.salmitTrackEvent = trackAnalyticsEvent;

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;

    const destination = new URL(link.href, window.location.href);
    if (destination.pathname.endsWith("/quote.html")) {
      trackAnalyticsEvent("quote_cta_click", { link_text: link.textContent.trim() });
    } else if (destination.pathname.endsWith("/services.html") && destination.hash) {
      trackAnalyticsEvent("service_interest", { service_section: destination.hash.slice(1) });
    } else if (destination.protocol === "tel:") {
      trackAnalyticsEvent("contact_click", { contact_method: "phone" });
    } else if (destination.hostname === "wa.me") {
      trackAnalyticsEvent("contact_click", { contact_method: "whatsapp" });
    } else if (destination.protocol === "mailto:") {
      trackAnalyticsEvent("contact_click", { contact_method: "email" });
    }
  });

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
  const analyticsTools = [hasGA4 && "Google Analytics", hasClarity && "Microsoft Clarity"].filter(Boolean).join(" and ");
  analyticsBanner.innerHTML = `<div class="consent-copy"><h2 id="analytics-consent-title">Help us improve this website</h2><p>Allow ${analyticsTools} to measure visits and understand site usage. These tools only start if you accept. <a href="privacy.html">Privacy details</a></p></div><div class="consent-actions"><button class="consent-accept" type="button">Accept analytics</button><button class="consent-decline" type="button">Decline</button></div>`;
  analyticsBanner.querySelector(".consent-accept").addEventListener("click", () => saveConsent("granted"));
  analyticsBanner.querySelector(".consent-decline").addEventListener("click", () => saveConsent("denied"));
  document.body.appendChild(analyticsBanner);
  analyticsBanner.hidden = consentChoice === "granted" || consentChoice === "denied";

  if (consentChoice === "granted") startAnalytics();
}
