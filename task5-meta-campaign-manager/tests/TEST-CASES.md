# Manual Test Cases

| ID | Test | Expected result |
|---|---|---|
| TC01 | Create campaign | Campaign appears in tree |
| TC02 | Clear campaign name | Inline required error appears |
| TC03 | Set campaign budget to 0 | Budget error appears |
| TC04 | Add ad set | Ad set appears under campaign |
| TC05 | Clear ad-set location | Location error appears |
| TC06 | Set invalid age range | Age validation error appears |
| TC07 | Add ad | Ad appears under ad set |
| TC08 | Leave headline empty | Headline error appears |
| TC09 | Leave creative empty | Creative error appears |
| TC10 | Enter invalid URL | URL error appears |
| TC11 | Upload non-image | Modal error appears |
| TC12 | Upload image >5MB | Modal error appears |
| TC13 | Fix all fields | Campaign becomes Ready |
| TC14 | Launch invalid campaign | Launch blocked + issue modal |
| TC15 | Launch valid campaign | Status becomes Active |
| TC16 | Duplicate campaign | Independent campaign copy appears |
| TC17 | Duplicate ad set | Independent ad set copy appears |
| TC18 | Duplicate ad | Independent ad copy appears |
| TC19 | Select multiple ads + bulk CTA | All selected ads update |
| TC20 | Select multiple ads + bulk status | All selected ads update |
| TC21 | Select multiple ad sets + bulk budget | All selected ad sets update |
| TC22 | Refresh browser | Data persists |
| TC23 | Search campaign | Matching campaigns remain |
| TC24 | Delete ad | Ad disappears |
| TC25 | Delete ad set | Ad set disappears |
