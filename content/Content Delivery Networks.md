---
title: Content Delivery Networks
date: 2026-05-09
category: concept
status: seedling
tags:
  - "#dsa"
  - "#algorithms"
  - "#tools"
  - "#concepts"
  - system-design
related:
  - "[[Open Questions]]"
  - "[[Learning DSA in C++ fast]]"
---

# Content Delivery Networks

A Content Delivery Network (CDN) is a geographically distributed group of servers that caches content close to users, making the delivery of images, videos, and HTML faster. By reducing the physical distance data travels, CDNs minimize latency, lower bandwidth costs, and improve site reliability.

## Key Benefits of a CDN

- **Faster Load Times**: By distributing content to "edge servers" nearer to users, websites load faster.
- **Reduced Bandwidth Costs**: Caching reduces the data the origin server must provide.
- **Increased Content Availability**: Distributed servers handle more traffic and withstand hardware failures better than origin servers.

## How a CDN Functions

When a user requests content (e.g., a video or image), the CDN intercepts the request and serves the data from the closest "edge" server rather than the original host server.
- **Origin Server**: The main server hosting the original content.
- **Edge Server**: A server located on the edge of the network, closer to the user, that caches content.
- **DNS**: Directs user requests to the most appropriate edge server.

## Common Use Cases

- **Streaming Content**: Delivering high-quality video for platforms like Netflix or live events.
- **Static Assets**: Serving CSS, JavaScript, and images for websites.
- **E-commerce**: Speeding up product page loading to increase sales.
## Major CDN Providers

- **Akamai**: Large-scale global infrastructure.Cloudflare: Widespread network offering security services.
- **Amazon CloudFront**: Integrates with AWS services.
- **Microsoft Azure CDN**: Part of the Azure cloud ecosystem.cdnjs: Specialized free, open-source CDN for web developers
## Connections

- [[Related note]] - The closest note this should talk to, even if the connection is still rough.
- [[Unmade note]] - The note this is quietly asking me to create later.
- [[Bigger pattern]] - The wider idea this probably belongs inside.
