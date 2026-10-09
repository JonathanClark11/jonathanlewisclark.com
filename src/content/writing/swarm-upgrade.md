---
title: "My AI Engineering Team Got a Huge Upgrade This Week. The Problem Was Too Much Good Work."
date: "2026-10-08"
description: "My AI engineering team got so productive I could not keep up with its pull requests. So we spent a few days adding risk scores, a merge queue, automatic rollback and more. Everything that changed, and what went wrong along the way."
tags: ["AI", "Agents", "Engineering", "Automation", "Cloudflare"]
---

A few weeks ago I wrote about handing a word game to my AI assistant and getting it into the App Store. Since then Bucky has grown from one assistant into a small engineering team: a coordinator, a product manager, and three software engineers, all running as AI agents against my real projects. I call it the swarm.

This week the swarm hit a problem I was happy to have. It got good enough that I couldn't keep up with it. Pull requests were arriving faster than I could review them, and every merge was a small act of faith.

So we spent a few days making the swarm safer, faster and more independent. Here is everything that changed, and what I learned.

## First, the foundation (Oct 4 to 5)

We started with a retrospective. I asked Bucky to read the logs, the pull requests and our conversations and tell me honestly how the sprint went. All six issues shipped, none needed rework. But the report found real friction, and we fixed most of it in a day:

- **Finished work no longer blocks new work.** A PR waiting for my approval used to count as an occupied engineer slot. One sat for five days. Engineers are now "busy" only while they are actually coding, reviewing or merging.
- **A daily approvals digest** replaced a pile of per-PR reminders, with a one-line summary and test steps for each.
- **Reviews are dispatched automatically**, spread across engineers, with a safety net that catches reviews that never started.
- **Held merges are visible.** When a merge is refused, the engineer's card in Bucky HQ now says "Merge held: reason" instead of a stale status.
- **A ship check** compares merged PRs against real production builds, so "merged" and "live" are no longer the same word.
- **BudgiePlanner moved from Vercel to Cloudflare**, with the docs, previews and deploy checks updated to match.

I also changed the product manager's marching orders. A blank brief used to produce an empty sprint, which is a failure of the role. Now the PM looks at errors, metrics, funnels and hygiene, picks work itself, and treats my brief as a priority and never a ceiling. Anything only I can do lands in a "Your Tasks" section in Bucky HQ that I can drag into "working on it".

## The big one: safe, faster merging (Oct 7 to 8)

Then I told Bucky the real problem: I can't approve this much, and auto-merging is scary, because several engineers merging at once and watching deploys will eventually break production. My rule is old and simple: roll back to the last known good state first, root cause second.

We turned that rule into a system. Everything below is deterministic code, not an AI making judgment calls, with one bounded exception.

- **A risk score from 0 to 100 on every PR.** It is computed from diff size, how many files and shared modules it touches, whether there are tests, edge functions, dependency changes, monetization-adjacent code, the reviewer's verdict and the check results. The coordinator can nudge it by 15 points with a written reason, and no more.
- **Hard blocks that no score can override.** Payments, auth, database migrations, secrets, CI and infrastructure config, and BudgiePlanner's monthly habit feature always need me.
- **An auto-merge dial in Bucky HQ.** "Anything under X can merge without me." It has Off, Shadow and Live modes, a kill switch, an hourly cap and a circuit breaker.
- **A serialized merge queue per project.** One change in flight at a time, so deploys can't pile up on each other.
- **Real deploy checks.** After each merge a watcher waits for the production build, runs health checks, and holds the change through a short bake window before calling it good.
- **Automatic rollback.** If the build or the health checks fail, it redeploys the last known good version, pauses the queue, opens revert PRs, tells me, and does not ask first. If several commits are suspect, it re-lands them one at a time to find the culprit, which goes back to its author as rework.
- **Conflicts are the author's job.** A PR that is only behind main gets updated automatically. One with real conflicts sends its own engineer to rebase, resolve, test and push. After two failed tries it stops and tells me.
- **A preview smoke test.** Every PR's preview deployment is checked before any merge, on top of the tests each engineer is now required to write.
- **A limit on my approval queue**, so the swarm stops starting new work when four PRs are already waiting on me.
- **A heartbeat every three minutes** that runs all of this and only speaks up in Discord when something happened.

## What went wrong along the way

This is the part I'd want to read if I were you.

- The new watcher reported four Jotto merges as healthy when nothing had been deployed. Jotto had no automatic deploy at all, and "no build found" was being treated as "fine". Now an unconfirmed deploy is reported as unconfirmed.
- Connecting Jotto's GitHub repo to Cloudflare exposed a package manager mismatch that failed the first build. Bucky found it in the build log and fixed it in a pull request.
- A gate bug made good previews look missing, and a stale dev server served an HTML error to a page expecting JSON. Both were found and fixed the same day.

None of these were exotic. They were the ordinary seams of a system that had just grown new parts, and the useful thing is that the swarm now notices them and says so.

## Where it stands, honestly

Auto-merge is in **shadow mode**. It scores every PR and records what it would have merged, but nothing merges without me yet. I'll compare its picks to my own decisions for a few days, then turn the dial up. Automatic rollback is live, but I haven't had to use it, and it has only been tested against simulated failures. I trust the design more than I trust anything I haven't seen fail.

The swarm's code now also lives in its own version-controlled repo, which, embarrassingly, it did not before.

## What I took from it

The swarm didn't need to be smarter. It needed guardrails, so that being fast stopped being scary: scores instead of vibes, a queue instead of a race, a rollback instead of a prayer. The more independent your AI team gets, the more your job becomes designing the rules it works inside.

Next up: the dial. I'll let you know how it goes.
