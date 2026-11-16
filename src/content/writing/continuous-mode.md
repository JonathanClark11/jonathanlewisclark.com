---
title: "I Spent a Weekend Pressing \"Run Now\" on My AI Team. Then I Built Continuous Mode to Do It for Me."
date: "2026-11-16"
description: "My AI engineering team built eight card games in about two days. The stats on commits, tokens and what continuous mode actually did, including what I can't tell you."
tags: ["AI", "Agents", "Engineering", "Automation", "Swarm"]
---

For two months my AI engineering team, the swarm, worked on a clock. A coordinator woke up every hour or so, looked at the backlog, handed out work, and went back to sleep. Safe, easy to reason about, and full of idle time between the moment an engineer finished and the moment anyone noticed.

When I pointed the swarm at a new project, a mobile card game app, I got impatient with the clock. Bucky HQ has a "run now" button for the coordinator, so I started hammering it. Every time work finished, I pressed it. The coordinator handed out the next thing, the engineers picked it up, and I pressed it again. I was, in effect, a human continuous mode.

Continuous mode is that habit written down as code. The coordinator now runs whenever there is something only it can do: a backlog item is ready and engineers are idle, or a PR needs its approval card. It has guardrails (a minimum gap between runs, a cap of four runs an hour, and a rule that it fires once per distinct state so it can't spin on the same problem). I built it while the swarm was mid-burst, as the way to keep the burst going without me.

What the swarm did while I was pressing that button is the fastest I have seen software get built.

## 1. The commit rate went vertical

I counted merged pull requests across all four swarm projects, since every swarm change lands as one.

- **Oct 1 to Nov 8:** 82 merged PRs in 39 days. That is 2.1 per calendar day, or 4.6 on the days anything merged at all.
- **Nov 9 to Nov 11:** 96 merged PRs in 3 days. That is **32 per day**.

So roughly 15 times the calendar-day pace, and 7 times the pace of a normal working day for the swarm. The card game repo alone saw about 96 commits land on main between Nov 8 and Nov 11, with 87 of them authored by the swarm's engineer account. It felt like tons because it was tons.

## 2. Eight games, and it kept going

The project started with one game, Sequence, with a first file landing on a Sunday afternoon. My brief on Monday night named three more: blackjack, Texas Hold'em and cribbage. Here is what actually landed:

- **Sun Nov 8, 5:06 pm:** Sequence
- **Mon Nov 9, 10:20 am:** Thirty-One
- **Mon Nov 9, 9:54 pm:** Blackjack
- **Mon Nov 9, 10:42 pm:** Texas Hold'em
- **Mon Nov 9, 11:27 pm:** Cribbage
- **Tue Nov 10, 2:42 to 3:30 pm:** Crazy Eights, Go Fish and War, within an hour of each other

That is eight playable games in about 46 hours, with 23,500 lines added and 364 removed. Every game supports a human or an AI in each seat, and there are 86 test files.

The shape of that timeline is the real story. The first game took most of a day, because the swarm had to invent the structure: where rules live, how an AI opponent plugs in, how the UI sits on top. The second took half a day. After that, a game took about an hour. Once the pattern existed, each new game was mostly "do it again, with different rules," and the swarm was happy to do exactly that. Three of those games were not in my brief. It saw the pattern, saw the list of games in the project notes, and kept going.

## 3. It used a ton of tokens, and nearly all of them were cached

I summed the usage from the session logs on the Mac mini that runs the swarm. This is a rough measure, not a bill, and it only covers Claude Code sessions on this machine.

- **Nov 1 to Nov 8:** about 44 million tokens a day on average.
- **Nov 9 to Nov 11:** 634 million tokens in three days, peaking at 292 million on Nov 10. That is about 5 times the earlier daily average.

Of those 634 million, **601 million (94.8%) were cache reads**. Only about 29 million were cache writes, 3.6 million were output, and fresh uncached input was around 9,000 tokens in total. That fits agents that each reload the same project context over and over, which is what caching is for. I did not compute a dollar figure, because the swarm runs on my subscription and not on per-token billing, but the raw volume is worth knowing about before you try this at home. Parallel agents that all re-read the same files are a very efficient way to burn through a rate limit.

## 4. It beat my expectations

I expected a faster swarm to be incremental: fewer idle gaps, a bit more throughput. Instead I got a working multi-game app, with tests, in less time than it usually takes me to decide on a name.

## What I can't tell you

- **These numbers are mostly not continuous mode.** The burst began on Nov 8, with me pressing "run now" and with event triggers (a PM finishing, a review approving). Continuous mode itself shipped on the evening of Nov 9 and fired six times that night. After that, the coordinator mostly ran on a short schedule, about 58 scheduled runs across Nov 10 and 11. The honest claim is that an always-awake coordinator did this, first with me as the trigger and then with a timer. Whether the automatic version matches the manual one is still untested.
- **I changed other things that week.** Each engineer got its own git worktree, clean PRs started merging directly, and the deploy watch was relaxed for the new project. Those probably account for some of the speed.
- **A new project is an easy case.** Greenfield code with no users and no migrations is where agents shine. Outside the card game, my other projects merged 9 PRs in those same three days.
- **Speed isn't quality yet.** I haven't played all eight games to the end. Passing tests mean the rules work, not that the game feels good.
- **It stopped.** The swarm was paused on Nov 12 and resumed on Nov 14, and the card game's last commit in these logs is from Nov 11. I haven't measured the pace since, so treat Nov 9 to 11 as a burst, not a new baseline.

## What I took from it

The scarce resource moved. Once the coordinator could run without waiting on a timer, the agents were never the bottleneck. My attention was, and so was the rate limit. Pressing the button myself taught me what to automate. The next thing to design isn't a faster swarm. It is one that knows what is worth building, and tells me before it spends 300 million tokens on a game of War.
