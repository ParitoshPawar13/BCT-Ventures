# Task 5 Requirement Traceability

| Requirement | Implementation |
|---|---|
| Create campaigns | Create campaign button + campaign form |
| Required campaign fields | Name, objective, budget type, budget, status |
| Multiple ad sets | Nested `adSets[]` model |
| Targeting | Locations, age range, gender-ready model |
| Scheduling | Start/end dates |
| Ad management | Nested `ads[]` model |
| Creative | Image upload with validation |
| Copy | Headline + primary text |
| CTA | CTA dropdown |
| Landing URL | URL field + validation |
| Duplicate campaign | Campaign Duplicate action |
| Duplicate ad set | Ad set copy action |
| Duplicate ad | Ad copy action |
| Bulk edit ad sets | Select + bulk budget/status |
| Bulk edit ads | Select + bulk CTA/status |
| Bulk status changes | Status bulk controls |
| Real-time validation | Field-level validation on every render/change |
| Inline errors | `Field` component + inline-errors panel |
| Readiness indicator | Campaign readiness banner + tree dot |
| Hierarchical UI | Campaign → Ad Set → Ad tree |
| Expand/collapse | Tree chevrons |
| Sensible defaults | Seed data + defaults |
| Standalone prototype | No Meta API dependency |
| README | Included |
| Demo walkthrough | `docs/demo-script.md` |
| Task 2 comparison | README section |
| Edge cases | Validation and creative checks |
