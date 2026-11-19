# Website analytics setup

The site reports traffic with Google Analytics 4 (GA4) and is prepared for Microsoft Clarity. Enabled tools follow the website's analytics consent choice: they start only when a visitor accepts.

## Activate tracking

1. GA4 is configured with Measurement ID `G-W34JP7VW98`. The numeric stream ID is an account reference; the website uses the Measurement ID.
2. To enable Clarity, create or open the Salmit project in Microsoft Clarity and copy its Project ID.
3. Put the Clarity Project ID in `CLARITY_PROJECT_ID` near the bottom of `script.js`, then commit and deploy.
4. Accept analytics on the live site and confirm that the configured provider dashboards receive traffic.

GA4 collection is ready after visitor consent. Clarity collection remains inactive until its Project ID is supplied and configured.

## View reports

- **Visitor and page counts:** In Google Analytics, open **Reports → Engagement → Pages and screens**. Use the Landing page report for entry pages and Path exploration to follow page-to-page journeys.
- **What visitors do:** In Microsoft Clarity, use the Dashboard, Recordings and Heatmaps views to review page activity, scroll depth, clicks and aggregate interaction patterns.
- **Site actions:** The site emits the consented events `service_interest`, `quote_cta_click`, `quote_request_prepared` and `contact_click`. These report which service areas attract interest and how visitors try to contact Salmit. Form text, names, phone numbers, email addresses and project details are not sent as event parameters.

These reports are available inside the private GA4 and Clarity accounts associated with the IDs; visitor statistics are not exposed on the public website.
