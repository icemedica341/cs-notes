---
title: "LAN MAC"
date: 2026-09-23
draft: false
---

The sharing math: from the ideal benchmark through Aloha to listen-before-talk and listen-while-talk.

## 🎯 Ideal Benchmark

- Single shared broadcast channel: ≥2 simultaneous transmitters = **collision**.
- A **MAC protocol** is a distributed sharing algorithm whose coordination messages must themselves use the shared channel.
- **Ideal (genie-aided)**: one active node sends at full rate $R$; $M$ contenders each average $R/M$; fully decentralized, no clock/slot sync, simple. Everything below is measured against this.

## 🎰 Aloha

- **Slotted Aloha**: slots of one frame, synchronized starts; 0/1/≥2 transmissions = empty/success/collision. Offered load $G = Np$:

$$S = G e^{-G}$$

  max $1/e \approx 0.37$ at $G = 1$.

- **Pure (unslotted) Aloha**: transmit immediately; vulnerable window $[t_0-1, t_0+1]$ frame times (either half overlapping kills):

$$S = G e^{-2G}$$

  max $1/(2e) \approx 0.184$ at $G = 0.5$ (differentiate to find it).

- Per-node reasoning: slotted $\Pr(S_i) = p(1-p)^{N-1}$ sums to $Np(1-p)^{N-1} \to Ge^{-G}$; pure squares the silence factor.
- Good for bursty traffic at light load; collapses under heavy load.

## 👂 CSMA and CSMA/CD

- **CSMA** (listen-before-talk): sense the carrier, defer if busy — exploits tiny LAN propagation delay. Residual collisions when stations start within one propagation window (**vulnerable time** = max propagation).
- Variants: **non-persistent** (deferential — random backoff then re-sense), **1-persistent** (selfish — transmit immediately when idle), **p-persistent** (slotted: transmit w.p. $p$, else wait one max-propagation slot).
- **CSMA/CD** (listen-while-talk): abort on collision, emit 48-bit **jam** so all discard, back off and retry. Worst-case detection time $2a$ ($a$ = max one-way propagation).
- Throughput-vs-load ranking (qualitative): Aloha < CSMA < CSMA/CD.

## 📌 TL;DR

- Slotted Aloha: $S = G e^{-G}$, max $1/e$; Pure Aloha: $S = G e^{-2G}$, max $1/(2e)$.
- CSMA adds **carrier sense** (non-/1-/p-persistent); CSMA/CD adds **abort + jam**, detecting within $2a$.
- Next: [[ethernet|Ethernet]] turns 1-persistent CSMA/CD into manufacturable hardware.
