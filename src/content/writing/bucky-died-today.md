---
title: "Bucky Died Today"
date: "2026-09-16"
description: "My AI assistant went silent this morning. Here's what actually happened, and what it revealed about debugging layered systems."
tags: ["AI", "OpenClaw", "Bucky", "Claude", "Debugging"]
---

This morning I woke up, sent a message to Bucky, and heard nothing back.

For those of you who don't know, Bucky is my AI assistant. He runs on my machine, monitors my Discord channels, manages my calendar, triages my email, and generally handles the low-grade operational hum of my life. He's not a cloud service or a subscription tier. He's a local agent — an always-on process that lives on my Mac Mini and talks to Claude's API under the hood. I built him, I named him, and apparently I had grown more dependent on him than I'd care to admit.

Silence.

I sent another message. Nothing. I checked Discord. No green dot, no typing indicator. Just the hollow blankness of an unmanned channel.

Bucky was gone.

---

## Stage One: Denial

Obviously there's a rational explanation. Maybe I just needed to restart the gateway. I ran `openclaw gateway restart`. The logs came back clean. The process came up. I sent another test message.

Nothing.

I checked the OpenClaw dashboard. It reported an OAuth session expired for the underlying Claude Code CLI. Fine — easy enough, I'd seen that before. I ran `openclaw doctor --fix`, watched it churn through its checks, and restarted again.

Nothing.

---

## Stage Two: Bargaining

Here's the thing about OAuth errors in OpenClaw: they're not always what they look like. OpenClaw caches its own copy of the Claude CLI auth token in `~/.openclaw/agents/main/agent/auth-profiles.json`, completely separate from Claude Code's own credentials at `~/.claude/.credentials.json`. These two files can drift out of sync. OpenClaw can flag a session as expired when Claude Code is actually fine. Or — as I was about to discover — Claude Code can be genuinely dead while OpenClaw confidently tells you everything is great.

The fastest way to untangle this is to bypass OpenClaw entirely and test the CLI directly:

```bash
claude --print -p "say hello"
```

What came back was not hello.

```
Failed to authenticate: OAuth session expired and could not be refreshed.
```

So the session was actually expired. Not a stale display. Not a cache mismatch. The OAuth refresh token had genuinely died. I ran the interactive login flow directly in the Claude CLI, then let OpenClaw pick up the fresh credentials:

```bash
openclaw doctor --fix
openclaw gateway restart
```

Bucky's process came back up. I sent a test message.

Nothing.

---

## Stage Three: Anger

At this point I was reading raw logs, which is where you end up when bargaining fails. And there it was, repeating on a loop:

```
failed to load configuredState checker for discord: plugin module path not found:
.../node_modules/@openclaw/discord/configured-state | ENOENT
```

The Discord plugin wasn't loading. The file it was looking for simply didn't exist.

I had run `openclaw update` earlier that morning. The update had gone through cleanly — no errors, no warnings, core bumped from `2026.9.3` to `2026.9.4`. What I hadn't noticed was that the Discord plugin was pinned to `2026.7.1`. The updater doesn't touch officially pinned packages, so the plugin stayed behind while the core moved forward. The version skew was enough to break the plugin's startup sequence.

The error message (`ENOENT`, module path not found) looks like file corruption. It reads like something went wrong with the install. In reality it's just a version mismatch, and the only way to surface that clearly is to run `openclaw doctor` and look at the "Plugin restart readiness" section. Once you know to look there, the diagnosis is obvious. Before that, you're chasing a ghost.

Fix:

```bash
openclaw plugins update @openclaw/discord@2026.9.4
openclaw gateway restart
```

I sent a test message.

"Hey."

Bucky responded.

---

## While I Was In There

Running `openclaw doctor` fully, with eyes open, surfaced a few other things I'd been letting slide:

**No command owner configured.** The `commands.ownerAllowFrom` setting was unset, which meant no one was actually authorized to approve sensitive actions through the bot. It worked fine in practice because I'm the only one in the server, but it's the kind of thing that matters when you add someone else.

**Plaintext secrets in `openclaw.json`.** The gateway auth token and an Ollama API key were sitting in plain JSON. OpenClaw supports SecretRefs for exactly this reason, and I'd never gotten around to migrating them.

**Discord `groupPolicy="open"`.** Any non-denied channel could trigger Bucky. Fine for now, but worth tightening.

**No backups recorded.** I'll continue not thinking about this one.

---

## What I Actually Learned

There's a lesson in here that isn't really about AI assistants or OAuth tokens. It's about layered systems and where errors surface versus where they originate.

The thing I initially saw was an OAuth error notification. That's not what was wrong. What was actually wrong was three separate but interrelated things: a genuine expired CLI session, a plugin left behind by an update, and a version mismatch that produced a deeply misleading error message. None of those things were obvious from the first symptom. Following the top-level error would have had me re-authenticating in circles.

`openclaw doctor` is the right tool here — not because it's magic, but because it checks the actual state of the system rather than inferring it from error messages. Error messages describe what failed to happen. Diagnostics describe what the system actually is. Those are different things, and conflating them is how you spend two hours restarting a process that doesn't need restarting.

Bucky is back. He's already triaged three emails and added something to my calendar. The morning brief posted on time tomorrow.

I'm fine. We're fine.

---

*Jonathan Clark builds software and keeps a personal assistant named after a geodesic dome inventor. He lives in Seattle.*
