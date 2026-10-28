# AI + Learning Notes — Campus Relay

Three decisions from the AI-assisted development process, documented as request summaries, initial outputs and final revisions. The project is a simulation; no interviews or live campaign outcomes are claimed.

## 1. Fix a referral assumption that the copy did not support
**What was asked:** Plan 500 registrations in seven days with Rs 2,000, then verify the plan against the challenge.

**What AI suggested:** 300 seed registrants x 40% sharing x two new visits x 50% registration conversion = 120 referrals. However, the original message asked each sharer to invite only one friend.

**What changed:** Rejected that mismatch. The invitation now asks for two suitable friends. The model explicitly says the 300 seeds come from campus/club registrations and that both invitees opening the link is an assumption to validate. If each sharer produces only one visit, referrals fall to 60 and the base total falls from 520 to 460.

**Lesson:** Check the behavior behind a multiplier. Correct multiplication can still hide an unsupported growth assumption.

## 2. Replace generic advice with an observable decision
**What was asked:** Build something effective that supports the acquisition plan and verify that it works.

**What AI first built:** A referral tracker and dashboard with advice to check ambassador activation and conversion. It did not collect those inputs, so the advice was generic.

**What changed:** Added a daily check-in for active ambassadors, cumulative unique visits by channel and spend. The diagnosis now distinguishes missing measurement, weak activation, conversion below a 35% diagnostic threshold, exhausted budget, late-campaign recovery and goal audit. Counts remain clearly simulated and visits are explicitly manual.

**Example:** At Day 6 with 180 registrations, 12 active ambassadors and healthy conversion, the asset computes 320 still needed, 160 per day including today, and approximately 4,267 incremental people reached at 15% visits x 50% conversion. It does not claim this audience is available.

**Lesson:** A useful growth asset should help decide the next action, not just display a total.

## 3. Reject an optimistic downside and improve verification
**What was asked:** Verify all requirements and strengthen the final submission.

**What AI first proposed:** A conservative scenario that reduced volume but increased referral conversion from the base 50% to 60%. The first video also used an interface screenshot too small to read.

**What changed:** Lowered downside referral conversion to 40%: campus 216 + referrals 48 + clubs 32 = 296. The resulting gap is 204, requiring about 2,720 additional unique reach at the base visit/conversion rates. Replaced unreadable video crops and checked frames from the encoded MP4, not only source images. Added tests for budget, missing data, conversion and recovery decisions.

**Lesson:** State which assumptions changed and test the final artifact. A successful file export or optimistic scenario label is not proof of quality.

## What changed between the first idea and final solution?
The first idea was a campus referral tracker with a registration page. The final asset closes a small operating loop: acquire a fictional student, attribute the source, prevent an identical email from being counted twice, enter channel measurements, diagnose the bottleneck and choose a next action. Added a portable prototype and clear demo instructions so the work is easy to review.

## If there were another 24 hours
1. **4 hours:** Interview five final-year students and two campus admins; validate the project promise, prerequisites and access to groups.
2. **8 hours:** Add shared storage, email verification and authenticated admin access with consent/deletion controls.
3. **6 hours:** Test with ten volunteers on phones and slow connections, including duplicates and referral abuse.
4. **4 hours:** Pilot two approved invitation variants; compare verified registrations per 100 unique visits without overstating statistical significance.
5. **2 hours:** Fix the largest measured problem and record a personal walkthrough.

## What AI suggestions were deliberately rejected, and why?
Rejected the one-friend invitation paired with a two-visit assumption, the generic campaign advice presented without measurement inputs, and the supposedly conservative scenario with a higher referral conversion rate. Each could mislead an operator even though it sounded plausible. The changes above make the reasoning inspectable.

## Honesty about the prototype
No real acquisition, campaign spending or outreach occurred. Email deduplication is local to one browser and is not identity verification. Hosting the static site does not create a shared database. The walkthrough uses disclosed synthetic narration.
