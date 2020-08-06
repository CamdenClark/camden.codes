---
templateKey: "blog-post"
title: "Github Actions: What you might want to know"
date: 2020-08-06T00:00:00.000Z
description: "An experience report with github actions"
tags:
  - github
  - actions
  - ci
  - cd
  - devops
---

I really wanted to try out [github actions](https://docs.github.com/en/actions) for my newest project, [plaud.io](https://plaud.io). So I did.

It's a CI/CD tool that's fully integrated into your github repo workflow.

The jist is this: you have workflows, which run completely independently. You have jobs inside those workflows, which can run independently or based on a a DAG style dependency model. And, inside jobs you have steps. Each step is either a shell command you specify, or there are pre-baked steps built by the community.

## What I liked

It's absurdly easy to get started. I was able to go from nothing to building my projects in about 30 minutes, which is really excellent.

Secrets are available right at your fingertips, there's no misdirection, you just set up secrets in your environment and you can inject them anywhere.

Everything is in the same space. I don't have to integrate with another CI/CD tool, and for a simple project it is nice to have things all in the same space.

I used a few pre-baked steps: google cloud cli setup, publish to npm if there's a new version, and a cached npm install. All of the pre-baked steps I used worked without much fanfare. One of these was a pretty nascent open source project, so it's nice that they work well and are reliable!

It's also really easy to change the things that trigger a specific workflow. Built into each workflow you can specify which files changing would run a specific workflow, only trigger them on PR, only on certain tags, etc. This is really batteries included.

## What was kind of cumbersome

Let's say I had this project structure:

- `lib/` - a private node library deployed to a private npm repo
- `frontend/` - depends on lib from npm
- `backend/` - depends on lib from npm

I wanted to be able to build and publish lib first, then build the frontend and backend. This is totally possible and quite easy.

There's a few caveats here:

1. [It's my understanding that] you have to specify the working directory on _every single step_. It would be really nice to be able to specify a working directory once per job. I guess you can specify an environment variable and then use that, but it's still a lot of boilerplate.

2. You can't conditionally run jobs based on changes in the repo. It would be awesome to avoid building and deploying the backend if there are no changes to `backend/` or `lib/`. I guess I could build my own pre-baked step in a docker container and just short-circuit the job if there's no changes...but that's a lot of work I feel like I shouldn't have to do. This functionally means you're forced to run a long deploy script even if there are no changes, or you split them all into different workflows.

3. I was a little frustrated that some of the pre-baked steps didn't allow you to specify working-directories. I think it would be nice to be able to run a step in the context of a working-directory even if the step doesn't have an explicit setting for it. There's probably some technical reason for being unable to do this, but not super clear to me.

#### A couple other separate things

I have a background in clojure, and the tooling for that didn't seem very well developed. I'd definitely do some investigation if you're using a less popular technology if you don't want to do a ton of bootstrapping.

One other separate thing: I really couldn't get the workflow exclude paths feature to work. Kind of annoying, but I didn't end up doing it.

### Conclusion

Overall, a really positive experience using github actions. I think as it matures it will be much easier to use, but for now, if you're taking on a heavy project with lots of weird build steps, you might want to pick up something more tried and true.
