---
title: "I Built a Bot Engineering Team. Here's the Architecture."
date: "2026-09-10"
description: "I run several side projects and have limited time. So I built a swarm of AI agents to drain the backlog while I'm not looking. Here's how it works, how I measure it, and what I'm watching for."
tags: ["AI", "Engineering", "OpenClaw", "Bucky", "Claude", "Bot Swarm"]
---

Last month I wrote about setting up Bucky — a persistent AI assistant running on my Mac mini. The short version: a headless machine, a Claude subscription, Discord as the interface, and a system that quietly handles my calendar, emails, and side project work around the clock.

That post got a fair amount of reaction, most of it around one line: "I've shipped meaningful product work from my couch without opening a laptop." People wanted to know what that actually looked like at scale.

So I pushed it further. This week I shipped what I'm calling the swarm: a small team of AI agents that manage my open-source and side projects autonomously, with me in the role of the engineering lead who reviews and merges PRs rather than writing every line.

Here's how it works, why I built it this way, and how I'm measuring whether it's actually useful.

---

## The problem I was solving

I have four active projects: BudgiePlanner (a budgeting app), Boggs Golf (a golf scoring tool), my personal writing site, and Jotto (a word game). Each has a GitHub issue backlog. Each has things that need to get done.

The constraint is time. I have a demanding full-time job. I have a family. The hours I have for side project work are limited and valuable. What I want is to show up, review good pull requests, and make product decisions — not triage issue backlogs or write boilerplate.

The naive answer is "just use Claude Code." But that's still me driving. I want the backlog to drain while I'm not looking.

---

## The architecture

The system has five agents: a coordinator, a product manager, and three software engineers. Each is a different role, but they're all the same underlying model — Claude — with different prompts and different permissions.

**The coordinator** is the only agent that runs on a schedule. Every six hours it wakes up, reads the current sprint state, and figures out what needs to happen: dispatch unassigned work, trigger peer reviews, surface blocked agents, post approved PRs for my review. Everything it does gets written to an audit log. Every decision is traceable.

**The PM agent** runs once a week, Monday morning. It reads all open GitHub issues across all active projects, scores them on impact, effort, and urgency, and writes a prioritized backlog. Six issues maximum per sprint, at most two per project, so the coverage stays spread. It posts a summary to my product channel.

**The SWE agents** — three of them — are ephemeral. They don't run on a schedule. The coordinator spawns them when there's work to assign. Each agent gets one issue: read it, implement it, push a feature branch, open a draft PR. When the PR is open, the agent exits.

**The reviewer** is also ephemeral and also a SWE agent — a different one from the author. The coordinator spawns it when a PR needs review. It checks out the branch, reads the diff, posts a code review comment. It cannot approve or merge. It exits.

When the reviewer signs off, the coordinator posts the PR to my approvals channel. That's where the human comes back in.

---

## The key design decisions

**Ephemeral workers, persistent coordinator.** I considered making each SWE a long-running process. I rejected it. Long-running agents accumulate state, drift, and fail in weird ways. Ephemeral agents start clean every time. The coordinator holds all the state in a JSON file; the workers just read it and write back.

**GitHub issues as the source of truth.** I didn't build a new task system. GitHub issues already exist for all my projects. They have labels, comments, assignees, and history. I added four new labels (`swarm-assigned`, `swarm-in-review`, `swarm-needs-approval`, `pm-flagged`) and the existing infrastructure handles the rest. The sprint JSON is a cache, not a replacement.

**Weekly sprints.** The PM agent reprioritizes every Monday. This matters because AI project management has a tendency to latch onto whatever was important when it last looked. A weekly reset forces fresh evaluation. A two-week sprint would let stale priorities linger too long.

**Peer review before human review.** Every PR goes through a second agent before it comes to me. This catches the obvious problems — wrong approach, missing edge cases, code that compiles but doesn't solve the issue — without burning my review time. The peer review is a comment, not a GitHub approval. I still click merge.

**No auto-merge. Ever.** This is a hard constraint in every agent's prompt. Feature branches only. Draft PRs. No `git push --force`. No `vercel deploy`. Nothing touches main without my hand on it. The swarm is fast at generating PRs; I am the gate.

**Project-level enable/disable switch.** One JSON field: `"enabled": false`. Right now one project is disabled because I'm not ready to work on it. Adding that flag took thirty seconds. The coordinator skips disabled projects entirely.

---

## How I'm measuring success

Most metrics for AI coding tools are wrong. They measure volume — PRs merged, issues closed, suggestions accepted — and volume is easy to inflate without producing anything valuable. An agent can open five small PRs from one task, or close a ticket the moment code compiles, and look extremely productive while shipping nothing usable.

I read [a framework from the team at Unblocked](https://getunblocked.com/blog/how-to-measure-ai-productivity/) that reframes this well: measure what survives, not what gets generated. Here's how I translated that for the swarm.

**PRs merged by me — not PRs opened by agents.** The only throughput number I care about is how many PRs I actually clicked merge on. Opened PRs are just work in queue. Merged PRs are shipped software.

**First-pass review rate.** What percentage of agent PRs pass peer review without being sent back for rework? A low number here is a signal that the SWE agents are generating code that looks like progress but needs significant fixing. A high number means the implementation quality is good. This is the quality metric I watch most closely.

**Avg cycle time: assigned to merged.** How long does it take from when the coordinator assigns an issue to when I merge the PR? This includes implementation time, review time, and my queue time. If this number grows, it usually means I'm the bottleneck — PRs are piling up for review faster than I'm processing them.

**PRs awaiting review >48h.** A direct flag that I need to clear the queue. The dashboard turns this red if it's nonzero.

**Blocker rate.** What percentage of assignments hit a `blocked` status before completing? An agent gets blocked when it can't figure out how to proceed — missing environment variables, ambiguous requirements, failing tests it can't fix. The coordinator surfaces these to my #dev channel. A high blocker rate means either the issues are underspecified or the agents need better context.

**Per-agent scorecards.** Each SWE slot tracks its own first-pass rate, cycle time, and blocker count. Over multiple sprints this will show whether there's variance in how I'm assigning work — whether some agent slots consistently get harder issues or hit more ambiguous requirements.

Sprint history accumulates over time. After a few weeks I'll have a trend line. The number I most want to see move is PRs merged per sprint.

---

## The approval flow

The thing I most want to be clear about: I review every PR. Every single one. The agents cannot ship code to production. They cannot trigger a deploy. They cannot even mark a PR as "Ready for Review" — only I can do that, by clicking merge.

The swarm produces draft PRs with a peer review attached. My job is to look at the PR, look at the review comment, and decide whether to merge, request changes, or close. The coordinator posts a message to my approvals channel with the PR link and the reviewer's verdict. I act on it at my own pace.

If I don't act within 48 hours, the coordinator sends a reminder. If a PR gets closed without merging, it marks the assignment as `closed_unmerged` and moves on. No pressure, no retries, no agents trying to land their work by rebase-and-force-pushing.

---

## What I'm watching for

The system is new. I don't have sprint history yet. What I'm watching for in the first few weeks:

**Issue quality matters more than I expected.** An agent given a vague issue ("improve the dashboard") will produce a vague PR. The scoring function in the PM agent is supposed to filter these out, but I'll be tuning the scoring criteria as I see what comes back.

**The review channel will be the pressure point.** I can have three SWEs working in parallel. If I review PRs slowly, the queue grows. The 48h reminder exists for this reason — I want to feel the pressure before it becomes a backlog. This is actually what I want: a forcing function to keep me engaged with the projects I said I wanted to work on.

**I expect blockers to be common early.** The agents don't have local environment variables for most of the projects. Some things will fail until I fill those in. The blocker → #dev channel → I fix it → unblock flow will be the main maintenance loop in the first sprint.

---

## The part I find interesting

The thing that strikes me most about this setup is that it's not really about automation. It's about attention allocation.

Running several side projects alongside a full-time job isn't a code problem, it's an attention problem. I can't write a PR for every backlog item. But I can review five PRs a week and make good decisions about what to ship. The swarm handles the execution layer. I handle the judgment layer.

Whether the agents are "good engineers" matters less than whether they're generating PRs I can evaluate quickly and trust enough to merge. That's what I'm optimizing for. First-pass review rate is a proxy for how much trust I've built up in their output. If that number stays high, the system is working.

If it's low, I either need to tune the issue selection criteria, add more context to the agent prompts, or accept that some categories of work just aren't a good fit for autonomous execution yet.

That's the experiment.

---

*Bucky and the swarm run on [OpenClaw](https://openclaw.ai), self-hosted on a Mac mini M4.*
