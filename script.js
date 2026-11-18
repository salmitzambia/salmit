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

const siteSearchEntries = [
  { title: "Home", url: "index.html", detail: "Discover Salmit Zambia and our technology solutions.", terms: "welcome overview technology solutions zambia salmit" },
  { title: "IT equipment supply", url: "services.html#equipment", detail: "Computers, printers, servers, networking and more.", terms: "equipment computer laptop printer scanner server storage networking accessories ups cctv biometric" },
  { title: "IT services and support", url: "services.html#it-services", detail: "Technical support, installation, cybersecurity and systems development.", terms: "support maintenance installation network lan cabling cloud email cyber security software development management systems cctv access control backup recovery solar gps fleet phone" },
  { title: "IT consultancy, AI and databases", url: "services.html#consultancy", detail: "Technology advice, AI consultancy, data analytics and database solutions.", terms: "consultancy advisory assessment digital transformation artificial intelligence ai automation chatbot analytics reporting database sql nosql migration optimization" },
  { title: "IT training", url: "services.html#training", detail: "Professional IT training and practical technology skills.", terms: "training courses skills professional digital computer education" },
  { title: "All services", url: "services.html", detail: "Explore equipment, IT services, consultancy and training.", terms: "services solutions what we do" },
  { title: "About Salmit", url: "about.html", detail: "Learn about our company, expertise and approach.", terms: "about company zambian owned story team profile" },
  { title: "Our clients", url: "clients.html", detail: "Meet some of the organizations we have worked with.", terms: "clients partnerships organizations portfolio" },
  { title: "Request a quotation", url: "quote.html", detail: "Tell us about your requirements and request a quotation.", terms: "quote quotation estimate pricing cost request" },
  { title: "Contact Salmit", url: "contact.html", detail: "Call, WhatsApp, email or visit our Lusaka office.", terms: "contact phone call whatsapp email address office lusaka location directions" },
  { title: "Our mission", url: "mission.html", detail: "Read about Salmit’s mission.", terms: "mission purpose" },
  { title: "Our vision", url: "vision.html", detail: "Read about Salmit’s vision.", terms: "vision future" },
  { title: "Our values", url: "values.html", detail: "Explore the values that guide our work.", terms: "values principles integrity professionalism" },
  { title: "Why choose Salmit", url: "why-choose-us.html", detail: "Learn what makes Salmit a trusted technology partner.", terms: "why choose trust reliable partner advantages" },
  { title: "Our commitment", url: "commitment.html", detail: "Learn about our commitment to clients and quality service.", terms: "commitment quality service clients" },
  { title: "Privacy and analytics", url: "privacy.html", detail: "Read our privacy information and analytics details.", terms: "privacy analytics data cookies consent clarity" },
];

const headerInner = document.querySelector(".header-inner");
if (headerInner && !headerInner.querySelector(".site-search-trigger")) {
  const searchTrigger = document.createElement("button");
  searchTrigger.className = "site-search-trigger";
  searchTrigger.type = "button";
  searchTrigger.setAttribute("aria-label", "Search this website");
  searchTrigger.setAttribute("aria-haspopup", "dialog");
  searchTrigger.setAttribute("aria-expanded", "false");
  searchTrigger.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.4"></circle><path d="m15.5 15.5 4.1 4.1"></path></svg><span>Search</span>';
  const headerCta = headerInner.querySelector(".header-cta");
  headerInner.insertBefore(searchTrigger, headerCta || null);

  const searchOverlay = document.createElement("div");
  searchOverlay.className = "site-search-overlay";
  searchOverlay.hidden = true;
  searchOverlay.innerHTML = '<div class="site-search-backdrop" data-search-dismiss></div><section class="site-search-dialog" role="dialog" aria-modal="true" aria-labelledby="site-search-title"><div class="site-search-heading"><div><span class="site-search-eyebrow">SALMIT ZAMBIA</span><h2 id="site-search-title">What are you looking for?</h2></div><button class="site-search-close" type="button" aria-label="Close search">&times;</button></div><form class="site-search-form" role="search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.4"></circle><path d="m15.5 15.5 4.1 4.1"></path></svg><input class="site-search-input" type="search" name="q" placeholder="Search services, equipment, support..." autocomplete="off" aria-label="Search Salmit Zambia"><kbd>ESC</kbd></form><p class="site-search-hint" aria-live="polite">Popular pages and services</p><ul class="site-search-results" id="site-search-results"></ul><div class="site-search-footer"><span>Search Salmit Zambia</span><span>Use keywords like <b>IT support</b> or <b>training</b></span></div></section>';
  document.body.appendChild(searchOverlay);

  const searchInput = searchOverlay.querySelector(".site-search-input");
  const searchResults = searchOverlay.querySelector(".site-search-results");
  const searchHint = searchOverlay.querySelector(".site-search-hint");
  const closeSearch = () => {
    searchOverlay.hidden = true;
    searchTrigger.setAttribute("aria-expanded", "false");
    searchTrigger.focus();
  };
  const renderSearchResults = () => {
    const query = searchInput.value.trim().toLowerCase();
    const words = query.split(/\s+/).filter(Boolean);
    const matches = siteSearchEntries.map((entry) => {
      const title = entry.title.toLowerCase();
      const content = `${entry.detail} ${entry.terms}`.toLowerCase();
      const score = words.reduce((total, word) => total + (title.includes(word) ? 3 : 0) + (content.includes(word) ? 1 : 0), 0);
      return { entry, score };
    }).filter((result) => !words.length || result.score === words.length || result.score > words.length)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
      .slice(0, 6);
    searchResults.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement("li");
      empty.className = "site-search-empty";
      empty.textContent = "No matches yet. Try a service, product or page name.";
      searchResults.appendChild(empty);
      searchHint.textContent = "No results for that search";
      return;
    }
    searchHint.textContent = words.length ? `${matches.length} helpful ${matches.length === 1 ? "result" : "results"}` : "Popular pages and services";
    matches.forEach(({ entry }) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = entry.url;
      const copy = document.createElement("span");
      copy.className = "site-search-result-copy";
      const title = document.createElement("strong");
      title.textContent = entry.title;
      const detail = document.createElement("small");
      detail.textContent = entry.detail;
      copy.append(title, detail);
      const arrow = document.createElement("span");
      arrow.className = "site-search-result-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
      link.append(copy, arrow);
      item.appendChild(link);
      searchResults.appendChild(item);
    });
  };
  const openSearch = () => {
    searchOverlay.hidden = false;
    searchTrigger.setAttribute("aria-expanded", "true");
    renderSearchResults();
    searchInput.focus();
  };
  searchTrigger.addEventListener("click", openSearch);
  searchInput.addEventListener("input", renderSearchResults);
  searchOverlay.querySelector(".site-search-close").addEventListener("click", closeSearch);
  searchOverlay.querySelector("[data-search-dismiss]").addEventListener("click", closeSearch);
  searchOverlay.querySelector(".site-search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const firstResult = searchResults.querySelector("a[href]");
    if (firstResult) window.location.href = firstResult.href;
  });
  document.addEventListener("keydown", (event) => {
    if ((event.key === "k" && (event.ctrlKey || event.metaKey)) && searchOverlay.hidden) {
      event.preventDefault();
      openSearch();
    } else if (event.key === "Escape" && !searchOverlay.hidden) {
      closeSearch();
    }
  });
}

const quoteForm = document.getElementById("quote-form");
const equipmentGallery = document.querySelector(".equipment-gallery");
if (equipmentGallery) {
  const galleryImages = [...equipmentGallery.querySelectorAll("img")];
  const galleryItems = galleryImages.map((image, index) => {
    if (!image.alt.trim()) image.alt = `IT equipment photo ${index + 1}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "equipment-gallery-item";
    button.setAttribute("aria-label", `View IT equipment photo ${index + 1} of ${galleryImages.length}`);
    image.parentNode.insertBefore(button, image);
    button.appendChild(image);
    const marker = document.createElement("span");
    marker.className = "equipment-gallery-marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = String(index + 1).padStart(2, "0");
    button.appendChild(marker);
    return button;
  });

  const lightbox = document.createElement("div");
  lightbox.className = "equipment-lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-labelledby", "equipment-lightbox-title");
  lightbox.innerHTML = '<div class="equipment-lightbox-backdrop" data-lightbox-close></div><div class="equipment-lightbox-content"><div class="equipment-lightbox-toolbar"><span id="equipment-lightbox-title">Equipment gallery</span><span class="equipment-lightbox-count" aria-live="polite"></span><button class="equipment-lightbox-close" type="button" aria-label="Close image viewer">&times;</button></div><div class="equipment-lightbox-stage"><button class="equipment-lightbox-nav equipment-lightbox-prev" type="button" aria-label="Previous photo">&#8592;</button><img class="equipment-lightbox-image" alt=""><button class="equipment-lightbox-nav equipment-lightbox-next" type="button" aria-label="Next photo">&#8594;</button></div><p class="equipment-lightbox-caption"></p></div>';
  document.body.appendChild(lightbox);
  const lightboxImage = lightbox.querySelector(".equipment-lightbox-image");
  const lightboxCount = lightbox.querySelector(".equipment-lightbox-count");
  const lightboxCaption = lightbox.querySelector(".equipment-lightbox-caption");
  let activePhoto = 0;
  let lastGalleryTrigger = null;

  const showPhoto = (index) => {
    activePhoto = (index + galleryItems.length) % galleryItems.length;
    const source = galleryImages[activePhoto];
    lightboxImage.src = source.currentSrc || source.src;
    lightboxImage.alt = source.alt;
    lightboxCount.textContent = `${String(activePhoto + 1).padStart(2, "0")} / ${String(galleryItems.length).padStart(2, "0")}`;
    lightboxCaption.textContent = source.alt;
  };
  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("has-open-lightbox");
    lightboxImage.removeAttribute("src");
    if (lastGalleryTrigger) lastGalleryTrigger.focus();
  };
  galleryItems.forEach((button, index) => button.addEventListener("click", () => {
    lastGalleryTrigger = button;
    showPhoto(index);
    lightbox.hidden = false;
    document.body.classList.add("has-open-lightbox");
    lightbox.querySelector(".equipment-lightbox-close").focus();
  }));
  lightbox.querySelector(".equipment-lightbox-close").addEventListener("click", closeLightbox);
  lightbox.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
  lightbox.querySelector(".equipment-lightbox-prev").addEventListener("click", () => showPhoto(activePhoto - 1));
  lightbox.querySelector(".equipment-lightbox-next").addEventListener("click", () => showPhoto(activePhoto + 1));
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPhoto(activePhoto - 1);
    if (event.key === "ArrowRight") showPhoto(activePhoto + 1);
  });
}

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

const onlineChat = document.createElement("div");
onlineChat.className = "online-chat-widget";
onlineChat.innerHTML = '<section class="online-chat-panel" id="online-chat-panel" role="dialog" aria-labelledby="online-chat-title" hidden><div class="online-chat-heading"><div><span class="online-chat-kicker">SALMIT ZAMBIA</span><h2 id="online-chat-title">How can we help?</h2></div><button class="online-chat-close" type="button" aria-label="Close chat">&times;</button></div><p class="online-chat-intro">Send our team a message on WhatsApp. Your message will be ready for you to review before you send it.</p><form class="online-chat-form" id="online-chat-form" data-clarity-mask="true"><label for="online-chat-message">Your message</label><textarea id="online-chat-message" name="message" rows="4" maxlength="1000" required placeholder="Type your question here..."></textarea><button class="online-chat-submit" type="submit">Continue to WhatsApp <span aria-hidden="true">&#8599;</span></button><p class="online-chat-note" id="online-chat-status" role="status" aria-live="polite"></p></form></section><button class="online-chat-launcher" type="button" aria-controls="online-chat-panel" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.75A2.75 2.75 0 0 1 6.75 3h10.5A2.75 2.75 0 0 1 20 5.75v7.5A2.75 2.75 0 0 1 17.25 16H9l-5 4v-6.5z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/><path d="M8 8h8M8 11.5h5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/></svg><span>Chat with us</span></button>';
document.body.appendChild(onlineChat);

const chatPanel = onlineChat.querySelector(".online-chat-panel");
const chatLauncher = onlineChat.querySelector(".online-chat-launcher");
const chatMessage = onlineChat.querySelector("#online-chat-message");
const chatStatus = onlineChat.querySelector("#online-chat-status");
const setChatOpen = (isOpen) => {
  chatPanel.hidden = !isOpen;
  chatLauncher.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) chatMessage.focus();
  else chatLauncher.focus();
};

chatLauncher.addEventListener("click", () => setChatOpen(chatPanel.hidden));
onlineChat.querySelector(".online-chat-close").addEventListener("click", () => setChatOpen(false));
onlineChat.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !chatPanel.hidden) setChatOpen(false);
});
onlineChat.querySelector("#online-chat-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatMessage.value.trim();
  if (!message) {
    chatMessage.focus();
    return;
  }
  if (window.salmitTrackEvent) window.salmitTrackEvent("contact_click", { contact_method: "whatsapp_chat" });
  const whatsappUrl = `https://wa.me/260770336134?text=${encodeURIComponent(message)}`;
  const opened = window.open(whatsappUrl, "_blank");
  if (opened) {
    opened.opener = null;
    chatStatus.textContent = "WhatsApp is ready with your message. Review it and press send to contact our team.";
    return;
  }
  const link = document.createElement("a");
  link.href = whatsappUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Open your WhatsApp message";
  chatStatus.replaceChildren(link, document.createTextNode(" and press send to contact our team."));
});

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
