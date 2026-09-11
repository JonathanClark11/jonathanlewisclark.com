---
title: "After One Month With an AI Assistant: What Works and What Doesn't"
date: "2026-09-10"
description: "One month running Bucky, a persistent AI assistant on my Mac mini. Here's what's genuinely changed how I work, and what still needs fixing."
tags: ["AI", "OpenClaw", "Bucky", "Claude", "Productivity"]
---

A month ago I set up Bucky — a personal AI assistant running on my Mac mini, wired into my calendar, my projects, and my phone via Discord. The pitch was simple: reduce the friction between "I need to get something done" and actually getting it done.

One month in, I have a clearer picture. Some of it has genuinely changed how I operate. Some of it is still rough around the edges.

---

## What Works Really Well

**Calendaring**

This was the first thing I handed off and it's been seamless. Scheduling, reminders, catching conflicts — it just handles it. I don't think about calendar management the way I used to.

**Personalized Planning**

This one surprised me. We went to Disneyland as a family — my daughter London is three, and we had a full day to navigate. I gave Bucky the context: ages, food restrictions, mobility constraints, what we wanted to hit. It came back with a sequenced plan that accounted for Lightning Lane strategy, where to start to beat the crowds, where to eat, and built in buffer for a toddler's pace.

It wasn't a generic "here's how to do Disneyland" list. It was actually tailored to us. That felt different.

**Building on Live Projects From My Phone**

I have a few websites and side projects running. When I want to add a feature or fix something, I describe what I want in a Discord message from my phone and Bucky works through it end to end — reading the code, making the changes, testing, pushing. I've shipped meaningful product work from my couch or a coffee shop without opening a laptop. That's the thing I didn't expect to be as good as it is.

**Restaurant and Itinerary Recommendations on the Fly**

Mid-day, change of plans, "where should we eat near here?" — it finds something real, checks if it fits the criteria, and adapts the rest of the day around it. Low friction, high hit rate.

**File Search and Recall**

I throw a lot of context at it over time — documents, notes, decisions. Being able to ask "what did we decide about X" and get a real answer from prior context has been consistently useful. It's not perfect but it's better than my own memory.

---

## What Doesn't Work Yet

**The Local Model Has No Tool Access**

When cloud rate limits kick in, Bucky falls back to a local model running on-device. The problem: the local model can't use tools — no calendar reads, no file access, no API calls. It's just a text box at that point. This is a configuration gap I haven't fixed yet, but it breaks the experience when it happens.

**Hallucinated Recommendations for Less-Trafficked Destinations**

Disneyland worked great. Legoland did not. It suggested attractions and experiences that don't exist. The difference seems to be training data density — Disneyland has been written about exhaustively, Legoland less so. I've learned to double-check specific claims for any venue that isn't deeply covered online.

**Debugging Simple Issues Is Still Tedious**

When something breaks and the fix is obvious to me but unclear to the assistant, the back-and-forth to converge on it can take longer than just fixing it myself. It's improving — and I've gotten better at how I frame problems — but complex reasoning about failure modes in live systems still has rough edges.

**The Morning Brief Isn't Calibrated to Me Yet**

There's a daily briefing that surfaces tasks, calendar, and pending items. Right now it doesn't have a good model of what I actually care about vs. what's just noise. It's treating everything roughly equally. This will improve as I give it more signal about how I prioritize — but it's not there yet.

---

## The Honest Summary

The high-leverage use cases are real: personalized planning, shipping product work from my phone, calendar and scheduling, on-the-fly recommendations. These have meaningfully reduced the gap between deciding to do something and doing it.

The gaps are also real, but they're mostly configuration and calibration problems, not fundamental limitations. A few of them I'll fix this month.

One month in, I'd call it net positive and I wouldn't go back to not having it. The bar now is making it better.

---

*Bucky runs on OpenClaw, self-hosted on a Mac mini.*
