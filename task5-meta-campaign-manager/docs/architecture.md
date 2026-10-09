# Architecture

```text
React UI
  |
  +-- App state
  |     |
  |     +-- campaigns[]
  |           +-- adSets[]
  |                 +-- ads[]
  |
  +-- Validation
  |     +-- validateAd
  |     +-- validateAdSet
  |     +-- validateCampaign
  |     +-- readiness
  |
  +-- Operations
  |     +-- create
  |     +-- duplicate
  |     +-- delete
  |     +-- bulk update
  |     +-- status changes
  |
  +-- Persistence
        |
        +-- localStorage
```

## Component-level responsibilities

- `App`: application state, persistence, navigation and high-level actions.
- `CampaignEditor`: campaign, ad-set and ad forms.
- `Field`: reusable form field with inline error rendering.
- `BulkBar`: bulk editing controls.
- `ErrorModal`: launch/readiness error feedback.

## Why localStorage?

The assignment explicitly allows a standalone prototype. LocalStorage gives the prototype persistence across page refreshes without adding backend/API complexity.

A production version would normally replace this with an authenticated backend/database and an API integration layer.
