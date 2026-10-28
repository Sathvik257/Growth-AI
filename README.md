# Campus Relay — NxtWave Growth Challenge

A working simulation for a seven-day, Rs 2,000 campaign targeting 500 final-year engineering student registrations.

## Run locally
Serve `public/` with a static web server: `python -m http.server 8766 --directory public`, then open http://localhost:8766. No build step, API keys or npm dependencies are needed.

## Deploy to Vercel
Import this repository with the Other framework preset, no build command, and `public` as the output directory. Configuration is in `vercel.json`. Alternatively, run `npx vercel --prod` after signing in.

## Features
Fictional registration, final-year eligibility checks, normalized-email deduplication, personal referral links, source attribution, local persistence, daily checkpoints, conversion calculator, invitation drafts and CSV export. The daily campaign check-in diagnoses activation, measurement, conversion, budget and late-campaign recovery using explicitly entered simulation inputs.

See [the reviewer demo guide](public/downloads/DEMO-GUIDE.md). Run `node --test tests/operations.test.cjs` for decision-logic checks. Deployment is left to the repository owner.

## Submission materials
- [Two-page growth plan](public/downloads/Growth-Plan.pdf)
- [Three-minute video](public/downloads/Campus-Relay-Walkthrough.mp4)
- [AI + learning notes](public/downloads/AI-LEARNING-NOTES.md)
- [Submission package](public/downloads/Submission-Package.zip)

## Prototype limits
All records are fictional and stored in the current browser's localStorage. Public hosting does not create a shared database. Student referral validation requires the original demo record in the same browser profile. Campus/club links demonstrate shareable source attribution. No real bookings, messages, spending or results are claimed. Both operator and student views are visible because this is a simulation.

The video uses disclosed synthetic narration. Review and personalize the notes before presenting them as your experience. No private recording links, credentials, runtime downloads or real student records are included.
