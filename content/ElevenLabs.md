---
created: 2026-10-15
updated: 2026-10-15
categories:
  - Technologies
tags:
  - technology
status: learning
aliases: []
related: []
docs:
---

# ElevenLabs

![[Pasted image 20261015092710.png]]

Its main appeal is that you can get a functional conversational agent running without independently building every component of the real-time audio pipeline

## Agent Creation

ElevenLabs provides a platform for building conversational agents with speech recognition, speech generation, conversation management, and integrations. You can configure an agent through a visual interface or build it programmatically.

## Speech Pipeline

![[Pasted image 20261015091622.png]]


The dashboard provides is the recommended way to design workflows because of the visual graph editor. Workflows are stored in the agent’s top-level `workflow` field, so you can also pull, edit, and push the JSON via the CLI or update it via the SDK, useful for version control and CI/CD.

More info at https://elevenlabs.io/docs/eleven-agents/customization/agent-workflows

## Tool Calling

![[Pasted image 20261015091748.png]]

They provide system prompt examples and how to use on their docs itself, you can use system prompts to fully customize the model and configure how it should behave.

## Customization

![[Pasted image 20261015091915.png]]

Using your own custom LLM is supported by specifying the endpoint we should make requests to and providing credentials through our secure secret storage. Learn more about [custom LLM integration](https://elevenlabs.io/docs/eleven-agents/customization/llm/custom-llm).

## Deployment 

![[Pasted image 20261015092145.png]]

## Monitoring 

![[Pasted image 20261015092207.png]]

## Languages 

![[Pasted image 20261015092923.png]]
## Projects Using It

https://elevenlabs.io/customer-stories/agents

## Pricing

https://elevenlabs.io/pricing/api