# Website analytics setup

The site is prepared to report traffic with Google Analytics 4 (GA4) and Microsoft Clarity. Both tools follow the website's analytics consent choice: they start only when a visitor accepts.

## Activate tracking

1. Create or open a GA4 property for `https://salmit.vercel.app/` and copy its web stream Measurement ID. It has the format `G-XXXXXXXXXX`.
2. Create or open the Salmit project in Microsoft Clarity and copy its Project ID.
3. Put each ID in the matching constant near the bottom of `script.js` (`GA4_MEASUREMENT_ID` and `CLARITY_PROJECT_ID`), then commit and deploy.
4. Accept analytics on the live site and confirm that both provider dashboards receive traffic.

The IDs are currently blank, so collection is inactive until the project IDs are supplied and configured.

## View reports

- **Visitor and page counts:** In Google Analytics, open **Reports → Engagement → Pages and screens**. Use the Landing page report for entry pages and Path exploration to follow page-to-page journeys.
- **What visitors do:** In Microsoft Clarity, use the Dashboard, Recordings and Heatmaps views to review page activity, scroll depth, clicks and aggregate interaction patterns.
- **Site actions:** The site emits the consented events `service_interest`, `quote_cta_click`, `quote_request_prepared` and `contact_click`. These report which service areas attract interest and how visitors try to contact Salmit. Form text, names, phone numbers, email addresses and project details are not sent as event parameters.

These reports are available inside the private GA4 and Clarity accounts associated with the IDs; visitor statistics are not exposed on the public website.
