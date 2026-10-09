# Task 5 — Meta Campaign Mirroring UI

A standalone, UI-based campaign management prototype inspired by the hierarchy and workflow of Meta Ads Manager.

> **Important scope note:** This project is intentionally a standalone prototype. It does not call the Meta Marketing API and does not create real advertising campaigns. The assessment explicitly permits a standalone UI prototype.

## 1. What this project demonstrates

The application implements the core Task 5 requirements:

- Campaign → Ad Set → Ad hierarchy
- Create and edit campaigns, ad sets and ads
- Campaign objectives, budget type, budget and status
- Ad-set targeting, scheduling and budget fields
- Ad creative upload, headline, primary text, CTA and landing-page URL
- One-click duplication of campaigns, ad sets and ads
- Bulk editing of selected ad sets or ads
- Bulk status changes
- Real-time field validation
- Inline error messages
- Campaign-level launch-readiness indicator
- Launch protection: invalid campaigns cannot be activated
- Browser persistence using `localStorage`
- Responsive visual interface with expandable hierarchy
- Seed/demo data for immediate exploration

## 2. Technology stack

- React 19.3
- Vite 8
- JavaScript (JSX)
- CSS
- Lucide React icons
- Browser `localStorage` for persistence

React is used for component-based UI and state management. Vite is used as the development server and production build tool.

## 3. Requirements

Install:

- Node.js 20.19+ (or a newer supported Node release)
- npm
- VS Code (recommended)

## 4. Run locally

Open a terminal in this folder:

```bash
npm install
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

## 5. Production build

```bash
npm run build
```

The production files are generated in:

```text
dist/
```

Preview the production build:

```bash
npm run preview
```

## 6. Feature walkthrough

### A. Create a campaign

1. Click **Create campaign**.
2. Enter a campaign name.
3. Choose an objective.
4. Set a positive budget.
5. Add at least one ad set.
6. Complete the ad set and ad fields.
7. The readiness indicator changes from red to green when everything is valid.

### B. Real-time validation

Leave required fields blank or enter an invalid value.

Examples:

- Empty campaign name → `Campaign name is required.`
- Zero budget → `Budget must be greater than ₹0.`
- No location → `Add at least one location.`
- No creative → `Creative is not uploaded.`
- Empty headline → `Headline is missing.`
- Invalid landing page → `Landing page URL must be a valid http(s) URL.`

The errors appear inline while editing.

### C. Launch protection

Click **Launch** on an incomplete campaign.

The application blocks the action and shows the complete list of readiness issues.

A valid campaign can be launched and its status becomes Active.

### D. Duplicate

Use the copy icon / **Duplicate** button at campaign, ad-set or ad level.

The duplicate receives new internal IDs so it is an independent entity.

### E. Bulk edit

Select multiple ad sets or ads using their checkboxes.

For ads:

- Change CTA
- Change status

For ad sets:

- Change budget
- Change status

Then click **Apply changes**.

### F. Creative upload

Each ad has an image upload control.

The prototype:

- accepts image files
- rejects non-image files
- rejects images larger than 5 MB
- stores the uploaded image locally in browser storage

## 7. Data model

The hierarchy is represented as nested JavaScript objects:

```text
Campaign
  └── adSets[]
        └── ads[]
```

Each entity has its own unique ID.

This makes duplication and bulk updates predictable and prevents copied records from sharing IDs.

## 8. Validation design

Validation is implemented as pure functions:

```text
validateAd()
validateAdSet()
validateCampaign()
readiness()
```

Validation is hierarchical:

1. An Ad validates its required creative and copy fields.
2. An Ad Set validates targeting, dates, budget and child ads.
3. A Campaign validates its own fields and all child Ad Sets.

This means a campaign is only considered ready when every required child object is valid.

## 9. Edge cases handled

- Empty required fields
- Zero/negative budgets
- Invalid age ranges
- Missing location
- Missing ad creative
- Missing CTA
- Missing landing-page URL
- Invalid URL format
- End date before start date
- Attempt to activate an invalid campaign
- Non-image creative uploads
- Creative files above 5 MB
- Empty campaign search result
- Browser refresh persistence
- Duplicate IDs regenerated for copies

## 10. Task 2 comparison

### Google Sheets automation

A spreadsheet is useful for bulk data entry and structured tabular workflows, but it is less visual. Errors may be distributed across rows and users have to understand column-level requirements.

### UI-based campaign manager

The UI makes the hierarchy visible:

```text
Campaign
  → Ad Set
      → Ad
```

It can validate fields while the user is typing, show errors next to the affected field, prevent invalid launch actions, and make duplication/bulk operations discoverable.

### Main advantages of this approach

- Better visibility
- Faster feedback
- Easier navigation
- Better error prevention
- More intuitive duplication
- More intuitive bulk operations
- Closer to the workflow of a campaign-management product

The trade-off is that a UI application requires more engineering effort than a spreadsheet.

## 11. Demo checklist

Record a 2–4 minute screen recording or capture screenshots showing:

1. Dashboard with Campaign → Ad Set → Ad hierarchy
2. Creating/editing a campaign
3. Adding an ad set
4. Adding an ad
5. Leaving required fields incomplete and showing inline errors
6. Fixing the errors and showing `Ready to launch`
7. Duplicating an ad set
8. Selecting multiple ads
9. Bulk changing their CTA
10. Bulk changing status
11. Attempting to launch an invalid campaign and showing the protection modal

Suggested demo order:

```text
00:00 — Open application
00:15 — Create campaign
00:35 — Add/edit ad set
00:55 — Show validation errors
01:20 — Complete the ad
01:40 — Show Ready to launch
01:55 — Duplicate ad set
02:15 — Select two ads
02:25 — Bulk edit CTA
02:45 — Bulk status change
03:00 — Launch/readiness demonstration
```

## 12. Ethics and compliance

This prototype does not scrape Meta, bypass access controls, or send unauthorized requests. It is a local demonstration of campaign-management UX and validation logic.

If a future version integrates with the Meta Marketing API, it should use Meta's documented authorization and API requirements rather than simulating or bypassing access.

## 13. Version control

Recommended:

```bash
git init
git add .
git commit -m "Build Task 5 campaign management UI"
```

## 14. Submission structure

Submit this folder as a ZIP or GitHub repository:

```text
task5-meta-campaign-manager/
├── public/
├── src/
├── docs/
├── tests/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```
