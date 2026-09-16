---
title: "The Swarm Shipped Its First Sprint. Here's the Honest Recap."
date: "2026-09-14"
description: "Three PRs, three autonomous engineers, one sprint. What actually went well, what's still rough, and the moment the coordinator's report stopped feeling like automation."
tags: ["AI", "Engineering", "OpenClaw", "Bucky", "Bot Swarm", "Sprint"]
---

Four days ago, the bot swarm I built to manage my side project backlog completed its first sprint. I woke up on a Sunday morning, opened Discord, and found three pull requests queued in #approvals — all peer-reviewed, all passing CI, each with a recommended merge order and a risk assessment.

Nobody woke me up to ask a question. Nobody got stuck and gave up. The work just... happened.

This is the recap. The good, the genuinely frustrating, and one moment that made me sit up and pay attention.

![BuckyHQ showing three active assignments all in Needs Approval state](/images/sprint-one-hq.png)

---

## What shipped

Three PRs across two projects:

**budgieplanner #51 — Monthly Spending Recap (Proactive AI Summary)**
swe-1 implemented a feature that generates a monthly spending summary. Mid-sprint, the peer reviewer caught an IDOR vulnerability — `auth.uid()` was NULL in a service-role context, allowing callers to read other users' data. swe-1 was nudged awake after stalling for 8+ hours, fixed the bug, and the PR came back with a clean re-review. It's waiting for me to merge.

**budgieplanner #52 — CSV Import + AI Categorization Landing Page**
swe-2 built a public-facing landing page for CSV import. All 4 items from the initial review feedback were addressed: credit card sign convention, savings label, leadCaptured persistence, 39 unit tests passing. Posted to #approvals.

**jotto #5 — Implement Jortal Game in React/Next.js**
swe-3 implemented a full game feature for Jotto, 16 tests passing, peer review: APPROVE. Posted to #approvals.

Three assignments, three PRs. All in a single sprint week. All without me touching a keyboard until it was time to review.

---

## What actually went well

**a) It runs while I sleep.**

This is the part that keeps surprising me. I check in Saturday morning and three agents have been running for four days, reviewing each other's code, hitting blockers, escalating, getting nudged, and coming back. The work is there when I look. I didn't have to hold anything in my head between sessions.

It's not magic — the coordinator runs on a six-hour cron, the PM runs weekly, the SWEs are spawned and exit. But the cumulative effect of all that quiet scheduling is that the project backlog actually moved.

**b) The coordinator is the right call as orchestrator.**

I've tried a few architectures for multi-agent systems and the failure mode is usually that nothing has ownership. Agents drift. No one checks on stuck work. Progress gets lost between runs.

The coordinator solves this by design: one agent owns the sprint state, reads it every six hours, and does the annoying coordination work — dispatch, review triggers, reminder nudges, approval routing. It writes a full audit log. Every decision is traceable. And because it runs on a predictable schedule, I always know when to expect an update.

The 48-hour reminders are the thing I'd have forgotten to build. They matter.

**c) The coordinator's end-of-sprint report stopped feeling like automation.**

This is the one that made me pay attention.

On the night of September 12th, the coordinator ran its 19:02 PT check and posted a sprint wrap report to #ops. I've reproduced it here because I want to be specific about what struck me:

> **Sprint 2026-W36 ends today.** All engineering work is complete — three peer-approved PRs are waiting for Jon's merge decision.
>
> 1. **PR #52** — budgieplanner #46 (CSV import + AI categorization landing page): Lowest risk. Public landing page only, no auth/payments. 39 unit tests passing. ~28h in queue.
> 2. **PR #5** — jotto #3 (Jortal game in React/Next.js): Self-contained game feature. 16 tests passing. ~30h in queue.
> 3. **PR #51** — budgieplanner #31 (Monthly Spending Recap): Contains a Supabase migration. IDOR guard reviewed and correct. Non-blocking follow-up: `REVOKE EXECUTE ON FUNCTION get_spending_by_category FROM anon`. Review migration carefully before merging. ~24h in queue.
>
> **Recommended merge order:** #52 → #5 → #51 (ascending risk)

It didn't just list the PRs. It ranked them by risk, explained the reasoning, flagged the migration, noted a non-blocking follow-up, and gave me a clear action sequence.

That's not a status update. That's an engineering lead handing off a sprint. For the first time with this system, it felt like there was a higher-level thinker involved — something that understood the *shape* of the work, not just the state of the queue.

I don't know if that feeling will hold. But it was a real moment.

**d) HQ gives you the whole picture at a glance.**

I built a dashboard (BuckyHQ) that shows active assignments, sprint backlog, agent scorecards, and audit log. Three green "Needs Approval" badges, swe-1 through swe-3, PR numbers linked to GitHub.

The value isn't in the data, it's in the absence of ambiguity. I can look at that screen for five seconds and know whether anything is stuck, whether any PR is aging, and what each agent is doing. That's what a good sprint board is supposed to feel like.

---

## What's still rough

**a) It lets me know when I'm neglecting it.**

Twice during the sprint, the coordinator fired 48-hour reminders because I hadn't reviewed the PRs. Both times, a message landed in #approvals:

> *PR #5 (jotto — Jortal game build, 54h since ready) — this has been waiting for your review for over 48 hours.*

This is my fault, not a system failure. The swarm works faster than I review. The pressure is intentional — it's a forcing function I designed to make me stay engaged. But I'll admit: when you've been ignoring your Discord notifications for two days and a bot calls you out by PR number, there's a specific feeling.

It's probably good accountability. I'm still getting used to it.

**b) Local testing through Tailscale took a weekend to get right — but now it works.**

Before merging PRs with meaningful code changes, I want to test them locally. My setup: dev servers running on the Mac mini, exposed via Tailscale HTTPS, accessible from my laptop anywhere.

Getting BudgiePlanner to a testable state took the better part of a weekend and required more trial and error than I'd like to admit. Here's what actually bit me, in order:

**Port conflicts with Tailscale serve.** Tailscale's `serve` feature binds to specific IP addresses (its own Tailscale IPs) on the ports it proxies. When `react-scripts` tries to start, its port detection library (`detect-port-alt`) checks whether the port is free by attempting to bind to `0.0.0.0` — which fails with `EADDRINUSE` because Tailscale has the port. The fix: patch `detect-port-alt` to skip the `0.0.0.0` check when a specific host is given, and start the dev server with `HOST=127.0.0.1` so it only ever binds to localhost. Tailscale then proxies its address to that localhost port.

**HTTPS mismatch.** Tailscale always serves over HTTPS (it terminates TLS). The dev server needs to run with `HTTPS=true` so the responses don't get blocked as mixed content when the browser is on a secure origin.

**Webpack hot reload connecting to the wrong host.** Webpack's HMR websocket client bakes the connection host into the compiled bundle at build time. By default it uses `127.0.0.1` — fine on localhost, broken when you're connecting through Tailscale from a different machine. Fix: set `WDS_SOCKET_HOST` and `WDS_SOCKET_PORT` to the Tailscale hostname and external port before the build runs. This rewrites the client bundle to connect through Tailscale instead.

**Content Security Policy blocking the Tailscale hostname.** The app's CSP in `index.html` had `wss://localhost:*` but not `wss://jons-mac-mini.tail712946.ts.net:*`. Added both the HTTPS and WSS variants for the Tailscale hostname to `connect-src`.

**Supabase running on `127.0.0.1` but the browser isn't on that machine.** The local Supabase stack runs on `127.0.0.1:54321`. When the React bundle runs in your browser, `127.0.0.1` means your laptop, not the Mac mini. Fix: add a `tailscale serve` entry to expose the local Supabase on a Tailscale HTTPS port, then set the Supabase URL in the app to that Tailscale address.

**PM2 was already managing the dev server.** I didn't realize PM2 was running `bp-dev` until I saw it restarting 230 times while I was killing and relaunching processes manually. Once I found it, the right move was to update the PM2 process config and restart through PM2 — not fight against it.

The end result: `https://jons-mac-mini.tail712946.ts.net:3002` serves the app over Tailscale HTTPS, with hot reload working, backed by a local Supabase instance at `https://jons-mac-mini.tail712946.ts.net:54321`, seeded with three months of realistic test data. I can test PRs from my laptop without touching prod.

None of these problems were individually hard once I understood them. The difficulty was that they're layered — each fix exposed the next issue, and it was hard to tell what was broken at each stage. Running a dev server across machines through a VPN is just genuinely messier than `localhost`.

---

## What's next

The PRs are waiting. I need to actually merge them.

Once they're in, I want to:
- Tune the PM scoring to reduce the frequency of issues that slip through with vague acceptance criteria
- Get `boggsgolf` back online — the repo returned 404 during the sprint (the coordinator flagged this three runs in a row, patiently)
- Update OAuth redirect URLs to the Tailscale hostname so auth-gated flows are fully testable

The second sprint will tell me more. The first sprint showed the system can produce output. The second sprint will show whether the output is actually worth merging.

---

*HQ runs on [OpenClaw](https://openclaw.ai). The swarm runs on Claude. The Mac mini runs in my office, quietly.*
