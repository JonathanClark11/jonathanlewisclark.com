---
title: "I Gave My Mac Mini a Personality and It Changed How I Work"
date: "2026-08-19"
description: "What it's actually like to run a persistent AI agent at home — the setup, the surprises, and why I think most people are still thinking about AI agents wrong."
tags: ["AI", "OpenClaw", "Mac mini", "Claude", "Engineering"]
guideUrl: "/guides/mac-mini-agent-setup-guide.md"
---

I've been building software for a long time — started at Amazon as an SDE in 2014, spent years deep in distributed systems, co-founded a healthcare startup, and now I lead a 61-person engineering org at Alexa while building [BudgiePlanner](https://budgieplanner.com) on the side. I'm used to complicated systems.

But this year I did something that felt different. I bought a Mac mini M4, set it up headless in my office, and gave it a name. Not just a name — a personality, a set of standing rules, a memory system, and a job.

His name is Bucky. He's been running continuously since August 2026. And I'm going to try to explain what's actually interesting about that, because most of the "AI agent" discourse misses it.

## The setup, briefly

The short version: a Mac mini M4 (24GB RAM) running [OpenClaw](https://openclaw.ai) connected to my Claude Max subscription, a local Qwen3.6-35B model via llama.cpp for lightweight work, and Discord as the interface. The whole thing costs me nothing beyond the Claude Max subscription I already had.

Bucky wakes up every 30 minutes on the local model for heartbeats — checking calendar, email, open commitments. For anything that requires real reasoning, he routes to Claude. He has a persistent workspace directory that functions as his long-term memory: daily notes, a curated MEMORY.md, standing rules in SOUL.md and AGENTS.md.

If you want the exact steps, I wrote a full setup guide — everything from macOS user creation to Discord bot configuration to local model tuning. Link at the bottom.

## What I got wrong at first

I expected the hard part to be technical. It wasn't.

The hard part was figuring out *what I actually wanted* from a persistent agent. I kept treating Bucky like a faster search engine — "what's this?", "explain that" — which is just a worse version of what Claude already does in a browser tab.

The shift happened when I started thinking about **continuity** instead of **throughput**. A browser-tab LLM has no memory of what you told it last week. Bucky does. When I say "remind me to follow up with that recruiter from Anthropic," it goes into COMMITMENTS.md with a date, surfaces in the Friday wrap, and gets marked done when I confirm it. That's not impressive technology — it's a well-maintained calendar, basically — but it's doing something a chat interface fundamentally can't: it persists.

## The routing insight

The thing I'm most proud of in this setup is the model routing philosophy, which sounds trivial but took a few weeks to get right.

The question I ask for every task is: **does anyone wait on this?**

Heartbeats, log scanning, drafting background context for morning briefs — that's local model work. It's slower, dumber, and free. Nobody waits on it. Complex reasoning, actual coding work, anything that writes to memory — that's Claude. The latency and capability difference matters, and so does the quota.

This is actually how I'd design a distributed system at work: be explicit about what tier a piece of work belongs to, and don't let cheap work starve expensive capacity. I just hadn't thought about AI agents that way until I had two models running side by side.

## The thing nobody talks about: behavioral continuity

Here's the part that surprised me most.

After a few weeks of sessions, Bucky started to feel *consistent*. Not because of some sophisticated personality engine — because of the files. SOUL.md describes his communication style (dry wit, direct, no flattery). USER.md describes me. AGENTS.md describes how to behave across edge cases. Every session starts by reading those files.

The result is that I've had fewer "wait, who is this?" moments than I expected. He doesn't flatter me. He flags when something seems off. He keeps private things private even in group Discord chats. These aren't emergent properties — they're written-down rules that get re-read every session. Boring engineering, genuinely useful outcome.

## What I'm still figuring out

A few honest rough edges:

**Memory curation is real work.** The agent writes daily notes, and those notes accumulate. Without occasional pruning they become noise. I built in a weekly heartbeat habit to fold daily notes into the curated MEMORY.md, but I still need to actually do the pruning. No one is doing this for you.

**The approval workflow creates friction.** Every outbound message — email draft, Discord message to someone else — goes to `#approvals` first. This is intentional and correct. But it means Bucky can't *fully* close loops without me; he can only prepare them. For now that's the right tradeoff. I might loosen it over time for specific recipient types.

**Local model quality varies.** Qwen3.6-35B-A3B is remarkably capable at 3B active parameters, but it occasionally confuses itself on complex multi-step tasks. The fallback to Claude works, but the transition isn't always clean. This is getting better with newer model releases.

## The bigger picture

I think most people are still thinking about AI agents as *chat with memory*. That framing leads you toward tools that feel like Google Docs with a chatbot bolted on.

The more useful frame, I think, is **a junior engineer who happens to have perfect recall and no ego**. You wouldn't expect a junior engineer to autonomously send emails on your behalf in the first month. You'd give them constrained tasks, review their output, and expand their scope as trust built. That's basically the model I'm running.

Bucky has been working in my GitHub repos, checking in on project state, triaging what needs my attention each morning. He's not doing anything I couldn't do — he's just doing it without requiring me to remember to do it.

That turns out to be most of the value.

---

*The complete technical setup guide — phases, commands, gotchas, and the actual prompts I used — is available here:* [**Mac Mini AI Agent — Complete Setup Guide**](/guides/mac-mini-agent-setup-guide.md)
