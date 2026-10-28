# Demo Guide — Campus Relay

This simulation shows the decision loop behind a seven-day campaign aiming for 500 registrations within Rs 2,000. It does not claim any real students were acquired.

## Two-minute test path
1. Open the prototype and choose **Load sample campaign**. If samples are already present, continue. The sample state contains 180 fictional registrations, 12 active ambassadors, Rs 350 spend and manually seeded channel visits.
2. Choose **Day 6**. The diagnosis should explain the remaining target and the extra reach required. With exactly 180 records: 320 left, 160/day including today, about 4,267 extra reach at the base rates.
3. Set **Campus unique visits** to 1,000 and update the check-in. With 130 campus registrations, conversion is 13%; the recommendation changes to fixing conversion.
4. Set **Active ambassadors** to 5 and update. The recommendation changes to distribution coverage. Restore 12 when done.
5. Go to **Student experience** and register a fictional final-year student. Copy the personal referral link and open it in the same browser profile. Register a second fictional student with a different email. The ledger attributes it to referrals.
6. Attempt the same email with different capitalization. The duplicate is rejected. Export the CSV and inspect the source columns.

The check-in refuses negative inputs, spend above Rs 2,000 and visit totals smaller than registrations. The browser also enforces required fields and demo consent. The clear-data control asks for confirmation and clears only this app's records/check-in.

## What to look for
Attribution and deduplication support honest counting; the check-in separates volume problems from conversion problems; the reach calculation exposes whether recovery is feasible. The visitor and spend figures are manually entered simulation inputs, not connected analytics.

## Limitations
Student referral codes validate only against records in the same browser. There is no shared backend, real email verification, real reminder delivery or hidden admin area. Use fictional details only.
