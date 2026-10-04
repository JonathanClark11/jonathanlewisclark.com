---
title: "How an Agent Team Gets Better Without Me: Retrospectives and Five Whys"
date: "2026-10-04"
description: "A swarm of AI agents will repeat its mistakes forever unless something changes its steering. Two borrowed practices, sprint retrospectives with measurable bets and a Correction of Errors review for the bad days, are how I'm teaching mine to improve."
tags: ["AI", "Agents", "Engineering", "Process", "Bot Swarm", "Retrospective"]
---

An agent doesn't learn from yesterday. Each run starts from its prompt, its tools and whatever files you left lying around. If it made a mistake on Tuesday and nothing in that setup changed, it will make the same mistake on Thursday, with the same confidence.

Humans have the same problem, which is why engineering teams invented rituals for fixing it. I've been running a small swarm of agents against my side project backlog for a few weeks now: a PM agent that files issues, a coordinator that assigns them, three engineers that write the code, and reviewers that read each other's pull requests. They are good at the sprint. They are bad at getting better, because nothing in the sprint asks them to.

So I borrowed two practices from human teams and wired them in. One is for ordinary weeks. The other is for the bad ones.

## The ordinary week: a retrospective that has to commit

Every sprint ends with a retrospective. The rule is the same one a good human team uses: pick one to three action items, and no more. Three is a ceiling, and one is often right.

The limit matters more for agents than it does for people. A retro that produces ten changes can't be evaluated, because ten things moved at once and you can't tell which of them helped. It also floods the prompts. Every instruction I add to an agent's prompt competes with every other instruction for attention, and a prompt that grows by ten rules a week turns into noise by the end of the month.

What makes an agent retro different is what I make each action item carry. Every change is written as a bet:

- **The change.** One sentence describing what steers differently next sprint. Usually a prompt edit, a new check, or a changed threshold.
- **The hypothesis.** What I expect to improve and why.
- **The metric.** The specific number that will move, and where it comes from.
- **The baseline.** What that number was this sprint.
- **The rollback condition.** The result that means we undo the change.

That last line is the one most retros skip. A change with no rollback condition is an opinion. It stays forever because nobody can prove it failed.

Here is the shape of a real one, from a problem I hit this month. My PM agent read my product brief and then filed issues I never asked for, while skipping the bugs I had listed. Here is how that becomes a bet:

> **Change:** The PM prompt must quote the brief item each filed issue traces to, and must file nothing that traces to no item.
> **Hypothesis:** Forcing a citation stops the agent from inventing priorities.
> **Metric:** Share of issues filed per sprint that map to a brief item, counted from the issue bodies.
> **Baseline:** Low. This sprint it filed three issues, none of which came from the brief.
> **Rollback if:** Brief coverage doesn't improve, or the PM files nothing for a week when the brief clearly has open items.

At the next retro the agents don't debate whether it worked. They read the number.

### Which numbers to watch

The swarm already writes a lot of state: sprint files, review verdicts, timestamps for every assignment. That is enough to build a small set of operational metrics without adding any instrumentation:

- **Cycle time.** Assignment to merged, in hours.
- **Stall time.** Hours an assignment sat with no update. One of my engineers sat for eight hours on a PR before anyone nudged it.
- **Review rework.** Rounds of review feedback before approval.
- **Escape rate.** Defects found after review approved the PR.
- **Time to live.** Merge to the change being visible to a user. More on this one below.

None of these measures how clever an agent is. They measure whether the system around the agents is working. That is the right target. When a swarm underperforms, the fault is almost never a lack of intelligence in one agent. It is a missing check, a vague instruction or a bad handoff, all of which are things you can change.

## The bad week: Correction of Errors

Retros handle drift. They are the wrong tool when something goes badly wrong. For that I use a Correction of Errors review, a format I first met at Amazon, and I've kept it nearly intact.

The core of a COE is a chain of "why" questions. You state what happened, then ask why, and ask why of the answer, and keep going until you reach a cause you can fix at the system level. I go five layers deep. Stopping at the first or second answer almost always lands on a person or an agent making a mistake, and "be more careful" has never fixed anything. By the fifth why you are usually looking at a gap in how the system is built.

Then comes the rule that gives the review its teeth: **propose one fix.** A single one. A COE that ends in eleven action items produces eleven half-finished tickets and no change. A COE that ends in one fix produces one fix, and the discipline of choosing it forces you to decide which cause actually matters.

### A worked example

Here's one from my own swarm, reconstructed from the logs. For about three weeks, my agents merged pull requests that never reached the live site. The last successful deploy was September 10. Every dashboard was green.

**What happened:** BudgiePlanner stopped receiving new code in production on September 10 and I didn't find out for weeks.

1. **Why did new code not reach production?** Vercel's free plan only deploys commits from the account that owns the project. My agents commit from their own GitHub account, so every deploy was blocked.
2. **Why did that go unnoticed?** Every stage of the swarm reported success. Code was written, reviewed, approved and merged. Nothing downstream of the merge was observed.
3. **Why did the diagnosis take so long?** The issue was filed as a code failure, "new code not shipping since Sep 10." The engineer assigned to it went looking for a bug in the code. The real cause was a billing rule, and the agent had no view of the deploy provider's reason for refusing.
4. **Why did the swarm's design allow this?** I gave the agents their own identities on purpose, so every commit is traceable. I never checked that decision against the seat rules of the tools downstream of it.
5. **Why was nothing checking?** Because the swarm's definition of "done" was "merged." Nobody owned the question of whether the change was live.

Five layers down, the problem is not Vercel's pricing, and it is not an agent misreading a log. It is that the system measured effort and never measured outcome.

**The one fix:** a shipped check. After any merge, the coordinator confirms the change is actually live on the production host, and escalates to me if it isn't within a set window. Not merged. Live.

I had other candidate fixes: audit every tool for seat rules, make the engineer prompt smarter about reading deploy logs, add a weekly manual check. All of them are real, and all of them treat a symptom. The shipped check would have caught this on day one, and it will catch the next failure of this shape, whatever causes it. That is how I decided it was the one.

It also gives the retro a new metric, which is where the two practices meet.

## How the two fit together

The retro and the COE feed each other.

A COE ends in a fix, and the fix needs a metric to prove it worked. Time to live, from the list above, exists because of that review. It goes into the next retro as a baseline, with a rollback condition, like any other bet.

A retro, in turn, is where small signals show up before they become bad weeks. A stall time that creeps from two hours to eight is something you can see in the numbers a sprint before it turns into an incident.

That's the loop I mean by self-reinforcement. Nothing in it relies on an agent getting smarter overnight. The system gets better because every sprint leaves behind a measured change, and every failure leaves behind exactly one structural fix.

## What I'd tell you if you're building one

**Cap the changes.** One to three per sprint. If you can't tell what helped, you didn't learn anything.

**Write the rollback before the change.** A bet with no losing condition can't lose, so it can't teach you either.

**Measure outcomes, not activity.** Pull requests merged is activity. Changes live in front of a user is an outcome. I got this wrong for three weeks.

**Go five deep, then pick one.** Depth finds the system cause. The single fix is what keeps the review from turning into a wish list.

**Keep a human on the steering.** The agents can run the retro, compute the metrics and draft the COE. I still approve what changes. A swarm that edits its own prompts unsupervised can optimize itself straight into a corner, and nothing inside it will notice.

The agents will keep making mistakes. That part doesn't change. What changes is whether the third occurrence is possible.
