# AI + learning notes

This is an AI-assisted simulation. These examples describe changes visible in the build history, not invented research or the applicant's personal learning. Prompts are actual user requests or labelled summaries of the working brief.

## 1. Turn the goal into a testable plan
**What was asked:** Complete the challenge: 500 final-year engineering registrations, seven days, Rs 2,000. This summarizes the written brief provided to AI.

**What AI suggested:** Campus Relay and a base case of 360 campus registrations, 120 student referrals and 40 club/email registrations: 520 total.

**What changed:** Added explicit assumptions, a conservative case of 320, and a sensitivity calculator. During verification, lowering campus conversion from 50% to 30% reduced the base case to 376. Included Day 3 and Day 6 checkpoints rather than presenting 520 as guaranteed.

**Judgment:** A target is not evidence. Unique reach, campus access and conversion rates must be validated; the 20-registration buffer is small.

## 2. Reject a technically valid but unreadable video draft
**What was asked:** "verify all and complete the project", followed by a request to check completion and see the video.

**What AI produced:** An initial three-minute walkthrough reduced a broad dashboard screenshot into a narrow panel. The video encoded successfully, but the interface text was too small.

**What changed:** Rejected that visual draft. Cropped the actual interface into readable details, moved a caption that overlapped the form, regenerated the video and inspected all six scenes. Checked video/audio decoding separately.

**Why reject it:** Encoding successfully does not make a clear explanation. A reviewer needs readable evidence. This is an actual correction made during the build.

## 3. Make the prototype easier to review
**What was asked:** Continue, verify all requirements, and complete anything missing.

**What AI initially delivered:** A working three-file prototype and a localhost preview, packaged in a ZIP.

**What changed:** Added a single-file HTML prototype with embedded CSS and JavaScript and no remote font dependency. Its separate storage key gives the evaluator a clean demo. Added a requirement audit and updated the reference review after the Zoom transcript became accessible.

**Why change it:** A localhost link is not a public link. The brief accepts a prototype, so the portable file reduces reviewer setup while retaining honest local-storage limits.

## What changed between the first idea and final solution?
The first idea was a campus referral tracker and registration page. It became a campaign desk with attribution, duplicate rejection, export, sensitivity analysis, campaign checkpoints and invitation drafts. Verification also improved the video and packaging.

## If there were another 24 hours
1. **4 hours:** Interview five target students and two campus admins to validate demand, prerequisites and audience access.
2. **8 hours:** Add shared storage, email verification and authenticated admin access; define consent and deletion controls.
3. **6 hours:** Test with ten volunteers across phones and slow connections, including duplicates and referral abuse.
4. **4 hours:** Test two approved invitations; compare verified registrations per 100 unique visits. Avoid claims of significance from tiny samples.
5. **2 hours:** Fix the largest measured problem and record a personal walkthrough.

## What AI output was deliberately rejected, and why?
The first video composition was rejected because the interface was unreadable at presentation size, despite successful encoding. The original localhost-only preview was also insufficient for remote sharing, so a portable artifact was added. These are observable decisions from this build.

Bulk messaging and a project grader were considered as design alternatives and not chosen. They are not claimed as specific AI responses that the applicant personally rejected. Bulk sending is unnecessary in a simulation; grading solves a later-stage problem than acquisition.

## Boundaries
No real outreach, participant acquisition or campaign spending occurred. The prototype does not verify identity or aggregate across devices. The recording's challenge instructions and Q&A were reviewed through its available transcript, not by listening to every second of audio. Review these notes and explain only the decisions you personally understand in your application.
