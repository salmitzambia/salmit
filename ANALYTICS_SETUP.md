# Website analytics setup

The site reports traffic with Google Analytics 4 (GA4) and Microsoft Clarity. Both tools follow the website's analytics consent choice: they start only when a visitor accepts.

## Activate tracking

1. GA4 is configured with Measurement ID `G-W34JP7VW98`. The numeric stream ID is an account reference; the website uses the Measurement ID.
2. Clarity is configured with Project ID `zg20rvawcj`.
3. Accept analytics on the live site and confirm that both provider dashboards receive traffic.

GA4 and Clarity collection are ready after visitor consent.

## View reports

- **Google Analytics:** Sign in at <https://analytics.google.com/> with the Google account that has access to the property for Measurement ID `G-W34JP7VW98`. Open **Reports → Realtime** to check active visitors and pages being viewed now. Use **Reports → Engagement → Pages and screens** for page views over time.
- **Microsoft Clarity:** Sign in at <https://clarity.microsoft.com/> with the Microsoft account that has access to project `zg20rvawcj`. Open **Dashboard** for site activity, **Recordings** to review visitor sessions, and **Heatmaps** to see aggregate clicks and scrolling.
- **Site actions:** GA4 also receives the consented events `service_interest`, `quote_cta_click`, `quote_request_prepared` and `contact_click`. These show which service areas attract interest and how visitors try to contact Salmit. Form text, names, phone numbers, email addresses and project details are not sent as event parameters.

These reports live in the private provider dashboards; they are not shown on the public website. Analytics shows aggregate activity, and Clarity recordings use browser/session signals rather than visitors' real names.

## If reports are empty

1. Confirm Vercel has deployed the latest commit from `main`.
2. Open `https://salmit.vercel.app/` in a browser and accept analytics in the consent prompt. If you previously declined, use **Analytics settings** in the footer to change the choice.
3. Keep that visit open, then check GA4 **Realtime** and the Clarity project dashboard. Your browser visit should appear after consent; other visitors who decline are not tracked.
4. Make sure the Google and Microsoft accounts you signed into have access to the matching property and project IDs above.

Clarity heatmaps need visitor interactions to build page activity; Microsoft's documentation says clicks can take up to 30 minutes to appear in heatmaps. See [GA4 Realtime reports](https://support.google.com/analytics/answer/9271392) and [Clarity's overview](https://learn.microsoft.com/en-us/clarity/about-clarity) for provider details.
