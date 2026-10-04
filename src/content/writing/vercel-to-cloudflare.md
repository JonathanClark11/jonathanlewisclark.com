---
title: "Switching Hosts Took an Hour. The Pricing Page Cost Me Three Weeks."
date: "2026-10-04"
description: "My agent swarm kept merging code that never shipped, because my host's free tier only deploys commits from one GitHub account. Moving to a different host took about an hour. What that says about where lock-in actually lives."
tags: ["AI", "Agents", "Vercel", "Cloudflare", "Infrastructure"]
---

For about three weeks, my agent swarm shipped nothing.

It didn't look that way. The swarm picked up issues, wrote the fixes, reviewed each other's pull requests, and posted the approved ones to Discord for me to merge. Every dashboard I own was green. Pull requests were closing. Commits were landing on `main`.

None of it was reaching the live site.

## The setup

BudgiePlanner is a budgeting app I'm building. The frontend is a plain React app, and the backend is Supabase. It was hosted on Vercel's free Hobby plan, deployed automatically on every push to `main`. I like Vercel. It has been the easiest part of every project I've put on it.

My agent swarm works through its own GitHub account. That was a deliberate choice: the agents are collaborators on the repo, not me wearing a costume, so every commit and review is traceable to the thing that made it. I'm the admin and the agents are contributors.

That is also exactly the arrangement the Hobby plan doesn't allow. Vercel's free tier will only deploy commits from the account that owns the project. A commit from a second GitHub account, even a collaborator on my own repo, gets blocked. The fix they offer is a Pro membership, so a second person can contribute.

I didn't know that was why. I only knew that the last deploy was September 10, and that everything since then had quietly gone nowhere. One of the agents was even assigned an issue titled "Diagnose and fix Vercel deployment failures: new code not shipping since Sep 10." It spent days looking for a code problem in what turned out to be a billing constraint.

## What I almost did

Pro is $20 a month, priced per seat. If my agent account needed its own seat to count as a contributor, that's more than $20. I spend $100 a month on Claude already. Adding a recurring charge for the ability to let a second GitHub identity push to my own repo felt like paying a toll to use my own road.

I'm not saying Pro is bad value. For a team of humans it's reasonable. What bothered me is that the price was attached to the wrong thing. I wasn't buying more capacity or more features. I was buying permission for a second author.

Then I looked at what I was actually hosting.

## Looking at the app

BudgiePlanner doesn't use anything Vercel-specific. No server functions, no edge middleware, no framework features that only one host supports. Running `react-scripts build` produces a folder of static files. All the dynamic work happens in Supabase, which was never on Vercel in the first place.

A static folder can go anywhere. I already had a Cloudflare account from shipping a word game to the App Store last month. Cloudflare's free plan serves static assets from its CDN and handles the certificates, and nothing in the setup asked me to pay for a second contributor.

So I asked Bucky, my assistant, to move it.

## The migration

The actual steps were short.

1. **Connect the repo.** Cloudflare builds from GitHub on every push, the same pattern I had on Vercel.
2. **Copy the environment variables.** A React app bakes its public settings into the bundle at build time, so the Supabase URL, the Stripe keys and a few others had to be present before the first build.
3. **Fix the build.** The first three attempts failed, and none of the failures were Cloudflare's fault. A stale lockfile that Vercel had never looked at. A dependency setting that only resolved one way. Two lint warnings that turn into errors when a build runs in CI mode. Bucky found each one in the build logs, fixed it in a pull request, and merged it. Then it added a small config file so deep links like `/transactions` didn't 404.
4. **Move the domain.** I added the domain to Cloudflare, switched the nameservers at GoDaddy, and attached the domain to the project. The old records for the root and `www` pointed at Vercel, so I deleted them.

Saturday afternoon got the site building and deploying on a temporary address. Sunday morning I moved the domain, and by 9 AM I had logged in and watched my own data load from Supabase. Maybe an hour of attention each day, most of it spent watching a progress bar.

## The surprises

Two things came up that had nothing to do with hosting.

First, the `www` version of my domain had an expired certificate. It had been expired since January. Nobody noticed because the root domain worked fine and nobody was using the app. It only surfaced because my authentication provider's default redirect pointed at `www`, and a login test on the new site fell back to it. Moving hosts fixed it by accident.

Second, one DNS record had to be left alone. My Supabase project has a custom domain, and putting my own proxy in front of that record would likely have broken it. Cloudflare's setup wizard turns the proxy on for everything by default. I only caught the record because I looked at what each one actually did before clicking through.

And after the cutover, Firefox kept showing me the old server for ten minutes because of its own DNS cache. A full quit and relaunch fixed it. If you ever migrate a domain and your browser insists nothing changed, check a different browser before you assume you broke something.

## What I'm taking from this

**Switching costs were low, and that surprised me.** I had been treating my hosting choice as a commitment. It turned out to be a configuration. A standard build command, a folder of files, a handful of environment variables and a DNS change. When your app is built on portable pieces, you can leave a platform in an afternoon, so make sure your next project is built that way.

**Pricing and constraints are where the real lock-in lives.** The technical coupling was almost nonexistent. The thing that actually held me in place for three weeks was a pricing rule that assumed every contributor is a person with a seat. That assumption is baked into a lot of developer tools, and it breaks the moment you give your agents their own identities. I'd now read the account and seat rules of any tool before I read its feature list.

**Silent failures are the expensive ones.** Nothing in my swarm was broken. Every agent did its job, and the pipeline reported success at every stage. Only the final step, the one that matters, was blocked, and nothing told me. If your system can complete work that never takes effect, you need a check at the end of the pipeline that confirms the change is live, not just that the change was merged. I've since added a report that compares what the swarm thinks it has shipped with what GitHub actually shows.

I still like Vercel, and I'll keep using it for the projects where I'm the only author. But I'm glad I found out how cheap leaving was, because the next time a plan boundary gets in the way, I'll know it's a negotiation and not a trap.
