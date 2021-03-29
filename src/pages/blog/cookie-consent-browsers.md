---
templateKey: "blog-post"
title: "Why can't browsers natively handle cookie consent?"
date: 2021-03-29T00:00:00.000Z
description: "Cookie consent banners suck really hard, why can't we have the option to handle them with browsers?"
tags:
  - thoughts
  - browsers
  - privacy
  - data
  - cookies
---

With the implementation of GDPR and CCPA, it seems like every website has to have their own half-baked implementation of a cookie consent banner. For the uninitiated, these are the banners that appear at the bottom of webpages that say "Accept Cookies" or "Decline". These banners can sometimes take up half the viewport or not be responsive on mobile. Moreover, it seems really common that these [banners often have serious accessibility issues that might make them non-compliant](https://uxdesign.cc/cookie-banners-and-accessibility-d476bf9ee4fc).

It seems there should be a better way.

What if browsers could have a similar native UX implementation for cookie consent as with getting access to the microphone, for example? The user experience I'm thinking about here is as follows: the user would be prompted in the browser context whether or not to allow access to cookies when navigating to a webpage. There's a lot of room in the design space here to make sure that the user is in control while minimizing the damage to the user experience on the web.

Before I get in to a few roadblocks I see, there could be ongoing work in this space, but some googling didn't help me here. If it's not being worke don, there's probably a few other reasons this hasn't been done yet (this is just a random thought I had), so please leave a comment if I've missed something.

#### Roadblock 1: Old browser versions

This is inevitably a huge roadblock. But we already have a bad patchwork of implementations, so it seems like that damage has been done here. Why not try to move towards a better standard?

#### Roadblock 2: Not granular enough

It's probable that a cookie interface for the browser wouldn't be granular enough to support all use cases (say, missing different levels of cookies to opt-in to). But, again, I think websites that want to support use cases outside of regulatory frameworks should probably implement their own interfaces. Getting 95% of the way there seems worth it.

#### Roadblock 3: Regulatory patchwork

This seems like the main roadblock for the near future. A lot of these laws are in their infancy, and many jurisdictions are considering their regulatory frameworks on data privacy right now.

To me, and this could be totally naive, this is actually an argument for writing a standard now. If there's a consistent standard that gets negotiated with all parties at the table, it seems like it's way easier to lobby governments across the world that they should write regulation that matches the standard.

I'll just reiterate: I'm not super familiar with this area or what ongoing work or discussions have been had in the past here. Just sketching out some thoughts I had and found it difficult to find any information about decisions in this space.

Thanks for reading!
