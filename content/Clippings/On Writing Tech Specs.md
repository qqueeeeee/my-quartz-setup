---
title: "On Writing Tech Specs"
source: "https://codeburst.io/on-writing-tech-specs-6404c9791159"
author:
  - "[[Chuck Groom]]"
published: 2017-11-01
created: 2026-04-03
description: "On Writing Tech Specs Before writing code to solve all but the most trivial of software problems, a software engineer should write a tech spec. Some software engineers may regard writing specs as …"
tags:
  - "clippings"
---

![](https://miro.medium.com/v2/resize:fit:1200/format:webp/1*AHiGNvpa9IYFWFQscT3RGA.png)

Before writing code to solve all but the most trivial of software problems, a software engineer should write a tech spec.

Some software engineers may regard writing specs as unnecessary process that gets in the way of the agile approach. The point of a tech spec is not to impede progress, but to take a brief step back and think things through. Remember: [[goal.|a software engineer’s job isn’t to write code but to solve problems]].

> A tech spec forces you to think through complicated issues and to get everyone on the same page. This helps to avoid wasting time on dead-end solutions or building the wrong thing.

There are other benefits, too:

- Improve the accuracy of estimates and timelines.
- Consider operational and long-term support costs.
- Prevent security and privacy problems.
- Provide documentation for future teams.

Experienced engineers know that the majority of their time won’t be spent writing code. It’s reasonable to set aside time for thinking through problems, planning, and communication. The tech spec is an excellent tool for this.

This post is intended to follow (in both structure and spirit)

[Gaurav Oberoi](https://medium.com/u/bc865a359d6d?source=post_page---user_mention--6404c9791159---------------------------------------)’s excellent articles on best software practices:

- [On Writing Product Specs](https://goberoi.com/on-writing-product-specs-5ca697b992fd)
- [On Writing Product Roadmaps](https://goberoi.com/on-writing-product-roadmaps-a4d72f96326c)

Ideally, a tech spec is based on a solid product spec. (Or as often happens, the product manager shows a draft product spec to an engineering lead, who then writes a draft tech spec, which leads to a bit of horse-trading on features, SLAs, and assumptions. This is probably the healthiest approach.) That said, many organizations don’t quite have product management figured out, or don’t think that technical projects need a product spec. If a project’s purpose and requirements aren’t clear, you’ll need put on your “product manager” hat and nail these down.

## First, an Example

### Suppose we work at:

A modest web startup. We currently use the web app’s default framework for sending emails (like welcome emails on sign-up).

The product teams would like us to improve our transactional emails. They don’t have the bandwidth to give us a product spec, but instead file a ticket:

> Currently, all emails are owned by engineering, and are sent using our own servers. That means marketing and product need to go through engineering to modify emails and see what they look like. We’ve gotten reports of poor deliverability, but can’t easily verify this. We have no way of tracking open and click rates. It takes 2+ weeks to add a new email. We request these improvements: (1) marketing & design can edit templates without involving engineering; (2) track metrics on open rates and deliverability; and (3) it should only take a few days to plug in a new email. In a few months, we’ll probably want to talk about A/B testing.

### And you don’t write tech specs:

The engineering team has a productive one-hour meeting:

- Sending emails using our own SMTP server has been a huge pain. We should switch to a hosted service that can trigger emails via an API.
- The hosted service shouldn’t just do the nuts and bolts of sending a blob of HTML/text to an email address (like Amazon SES), but should also host email templates with variable substitutions and simple if-then-else logic.
- The service will provide click rate, open rate, and deliverability metrics.

The team settles on **MailChimp transactional emails** because it’s an all-in-one service that meets the requirements; it has a solid track record; and some team members are familiar with MailChimp.

This seems pretty straightforward, so you start hammering out code.

### This works, but…

Over time, we run into a few problems.

- There’s a bug in our code that sends the same email to some customers 10 times in a row. → *Oops! Should we have included a safeguard throttle?*
- Several customers complain that they never received important receipts from us (and, yes, they checked their spam folder). Did *we* drop the ball, or should we yell at our email service provider? → *There needs to be reliable logging and audibility.*
- The business team wants to send an email when customers start their first check-out. They file a ticket to engineering and expect this to be live in 2 days. → *We didn’t set expectations about this process.*
- We keep adding new emails. Each has its own template and set of variables. But now marketing wants to include attribution tracking to all emails, so we’ll need to update every piece of code that sends emails. → *Uh-oh, maybe we should standardize variables and send using a common mechanism.*
- Our web app is sending emails synchronously as part of the web app request, but the API call is sometimes slow and therefore slows down the end customer experience. *→ How should we send emails in a way that doesn’t impact the user experience?*
- Our testing DB accidentally pulled in some real customer emails. During testing, we sent a slew of staging emails to real customers. → *D’oh! Staging should only send emails to our company.*
- MailChimp was unreachable for 3 hours and our transactional emails were lost → *We need monitoring and alerts; and we need a plan for outages.*

### Instead, suppose there is a tech spec.

Here’s my example tech spec. It defines our goals and requirements, then steps through our approach.

**→** [**Read the example Transactional Email Tech Spec (15 minutes)**](https://docs.google.com/document/d/1m9VGy8y3b64DBIfcp56TsMKhr8WpX47CWGyR3YQep-4/edit?usp=sharing) **←**

This example is a bit on the longer side. It’s a bit chatty because the process of explaining a plan has moments of “oh, yeah, there’s also *this to* think about…”

### Have you read the example tech spec yet? The next section makes more sense if you’ve read it first.

## How to Write a Tech Spec

In this section I’ll lay out some ground rules, then walk through the template I used in my example.

### Ground Rules

- **There is only one author**. There may be many team members who get credit for the big ideas, but it’s easiest if only one person puts everything together into a consistent proposal.
- **This isn’t a manual.** A tech spec maps the unknown, but doesn’t need to plan out every little thing. Avoid getting too deep in gory details, listing every API, etc, unless they truly matter.
- **Skip the boring stuff.** If *you* think what you’re writing is uninteresting, then I guarantee nobody will want to read it, either.
- **It’s OK to be incomplete.** You’re *absolutely* allowed to hand-wave in places or list sections as TBD. Just tell the reader that’s what you’re doing, and make sure you tie up loose ends before the go-live.
- **Assume there’s no v2.** It’s a common fallacy to believe that you can propose a throw-away, short-term solution because a rewrite is around the corner. Sorry, this probably won’t happen; systems tend to be patched and extended over time, but rarely replaced. Call out components and processes that can be improved later on, but assume core design decisions will persist for a long time.

### Header

The header should include the project name; the date; the author; and contributing team members. These names and dates are surprisingly useful years down the road when someone needs to know “hey, who knows how to maintain this crufty old thing?”

### Overview

Summarize the project and link to external documents.

- Give context by pointing the product specs, marketing documents, and engineering documents.
- Summarize the general approach.
- Give a rough overall time estimate (project size).

### Goals and Product Requirements

These sections are optional if a product spec has already clearly defined the project goals and requirements; but if not, defining these will be the most important area of your spec.

## Get Chuck Groom’s stories in your inbox

Join Medium for free to get updates from this writer.

The cornerstone of all successful projects is having clear goals — knowing what problem we’re solving. I cannot over-state the importance of agreeing on the goal; the biggest failures I’ve witnessed were due to various stakeholders running off in different directions because they didn’t take the time to make sure everyone *really agreed* about what they were supposed to do.

![](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*mRSqTKI9Y4T_otPRkjgMfw.png)

The correct engineering response to projects without a purpose.

### Assumptions

This is an engineering-centric bullet list that digests the product requirements as technical behaviors and limitations. It tells external stakeholders precisely what you will build and how much your system can handle. Be specific, detailed, and nerdy. Define SLAs, capacity, and failure tolerances.

### Out of Scope

This is a counterpart to “assumptions”, but written in the negative. It’s a bullet list of what’s off the table, in particular features that aren’t included and internal process that you won’t own. Spend a lot of time on this list, it’s your opportunity to prevent unwanted work and misunderstandings!

### Open Questions

As you write your tech spec, don’t stop to fill in all holes and TBD items. Just list them in the “Open Questions” section and keep going.

### Approach

Describe your solution in whatever level of detail is appropriate for you and your audience. Each subsystem, new technology choice, standard, etc. should have its own sub-section. You should also describe what other options you considered; or put this in a section “Other Options Considered.”

### Components

This is optional, but recommended. Here, you give a recap of your proposed approach in an easy-to-read bullet list format that enumerates all the systems that will be changed or created.

### Schema Changes

List all data storage changes, no matter how minor. You can go as deep as providing complete schemas or UML diagrams, but I’ve found this level of detail can derail early conversations. What matters most is agreeing at a high level about the kind of data you’ll be storing, how much, and how relational it should be — you can work through the specifics later.

### Security and Privacy

It’s always a good idea to think about customer data protection, personal information, encryption, vectors of attack, etc, no matter how small a project may seem. Always include this section so people know you’ve thought about this, even if you just say “There should be no security or privacy concerns here.”

### Test Plan

Describe the testing strategy, both within your engineering team(unit and integration tests) and for QA (manual test plan and automated test suites). Give the QA team as much of a heads-up as possible.

### Deployment and Rollout

Consider the logistics and order of operations for go-live; and for subsequent releases. Discuss configuration management, secrets management, database changes, migrations, and your sign-off process.

### Rollback Plan

Explain what happens if something goes wrong with the deployment — if there’s a failed integration, or if customers hate a feature. What metrics and alerts should we watch? Is it possible to move backwards and restore our previous system? How?

### Monitoring and Logging

Show how we’ll know we’ll know if there are problems in our software, how we can track our SLAs, know if the system is healthy, and be able to search through logs to track down bugs or customer issues.

### Metrics

Show how we’ll be able to answer business-level questions about the benefits and impact of a feature.

### Long-term Support

Consider questions like: who owns maintaining this software going forward? What are the long-term costs and “gotchas”? What happens if key people leave and we need to transfer knowledge?

### Timeline and Components

Give a rough task break-down, by owner, in day-sized estimates (e.g. “The compliance engineering team creates widget X: ~3 person-days”). Be realistic; use actual person-calendar-days and not theoretical “if we were 100% focused…” estimates; and include padding for integrations, risks, and meetings. Account for tasks required for all teams, not just your own.

## No time for a spec? Tell a duck.

OK, sure, nobody has time to write a tech spec. But… that’s kind of a penny-wise, pound-foolish argument; if you don’t have time to deliberately think through problems up-front, can you find the time to fix bugs and shore up limitations later on?

At the very least, before you dive into implementation-mode, take a few minutes to talk through your ideas with someone. Anyone.

[Even if it’s just a rubber ducky.](http://wiki.c2.com/?RubberDucking=)

If your company doesn’t believe in tech specs, I suggest you buy a rubber duck. Give it a place of honor (slash passive-aggressive resentment) on your desk. When you’re asked to start a new project, schedule a meeting room for an hour. Take your duck into the meeting room and carefully place it at the head of the table. Then start talking to the duck (yes, out loud). Explain what you’re doing, and what you think the best solution will be. Use the whiteboard to draw diagrams — but make sure to occasionally pause and make firm eye contact. If something doesn’t quite make sense as you’re saying it, take a note, and thank the duck.

![](https://miro.medium.com/v2/resize:fit:1100/format:webp/1*IZ90TZGgVIus8grqi2jMPQ.png)

Talking to a rubber duck is less crazy than jumping into writing code.

## Writing a Tech Spec is Writing

Writing is a skill that takes practice and discipline, but it’s worth the effort. Improving your communication skills is essential to becoming a clearer thinker and better leader. Your first tech spec will be slow going; you just need to do it; and then do another; and another. It gets easier.

You know who’s good at writing things people pay money to read? Stephen King. The single most useful book I’ve read in my engineering career is his memoir *On Writing.* (#2 is Strunk and White’s *The Elements of Style*, followed by Kernighan and Ritchie’s *The C Programming Language*). King’s book is half painfully honest self-examination, and half bare-knuckles practical advice about the craft. While his topic is creative writing, I feel much of it applies to technical problem-solving. I especially resonated with:

> Write with the door closed, rewrite with the door open. Your stuff starts out being just for you, in other words, but then it goes out. Once \[it’s out there\] it belongs to anyone who wants to read it. Or criticize it. If you’re very lucky … more will do want to do the former than the latter.

**Write with the door closed.** Write your first draft without any distractions. Clear your calendar for several hours, turn off Slack, silence your phone, tell people to leave you alone. Focus. And write out what’s in your mind. Don’t revise too much, just get your thoughts out there so there’s a consistent narrative of “because X, we do Y.”

**Rewrite with the door open**. Once your raw thoughts are out there, it’s time for collaboration to begin. Share your drafts, get feedback, go back and fill in the missing details. Be transparent about how you’re updating your technical proposal as you make discoveries.

**Share your work.** After the tech spec is in a reasonably finalized state, publish it. Now for the hard part: getting people to read it.

My approach is:

- I email and Slack my tech spec to as broad a distribution list within the company as possible and ask for *anyone’s* feedback. It’s surprising who responds; often totally unrelated people in other teams are just curious, or junior engineers say they learned something new. Sometimes I discover my proposal is reinventing the wheel, or I missed some subtle problem. I’ve never felt like I over-shared my tech spec.
- I make a list of *stakeholders.* These are people who have a legitimate right to veto my approach. This includes the product manager, customers who will use my new software, and teams who will be significantly impacted (don’t forget DevOps, QA, and security).
- I make another list of *interested parties*. These are people who should be in the loop, including my manager, the CTO, peers, and service owners.
- I schedule a 90 minute review meeting. The stakeholders are required attendees, and the interested parties are optional. The meeting invite includes a link to my tech spec and gives the itinerary as: 30 minutes quiet time to review the document (a.k.a. read it for the first time), 55 minutes to discuss, and 5 minutes for stakeholder sign-off.

By signing off, the stakeholders are on hook with me. We share responsibility for the project success and timeline, which discourages last-minute changes and feature creep. Work now feels more collegial, sane, and deliberate.