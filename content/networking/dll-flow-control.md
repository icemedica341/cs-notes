---
title: "DLL Flow Control"
aliases: ["networking/dll-flow-control/"]
date: 2026-09-23
draft: false
---

Stops a fast sender overflowing a slow receiver's buffers — assuming **no errors** (errors belong to [[dll-error-control|error control]]).

## ⏱️ The Three Delays

- **Transmission delay** $T_{tx} = L/C$ — frame bits $L$ over rate $C$ (pump-out time).
- **Propagation delay** $T_{prop} = d/v$ — distance $d$ at signal speed $v$.
- **Normalized propagation** $a = T_{prop}/T_{tx}$ — how many frame-times fit in one trip.
- **Link utilization** $U = T_{frame}/T_{cycle}$ — useful time over total cycle time.

## 🛑 Stop-and-Wait

- Send **one frame**, wait for its **ACK** before the next; 1-bit numbering (`f0/f1`) suffices.
- Timeouts rescue lost frames/ACKs; duplicates are discarded.
- Saturated, error-free, negligible processing/ACK time:

$$U = 1/(1+2a)$$

- Worked: 2.4 Mbps, 300 B, 50 km → $T_p = 250\ \mu s$, $T_f = 1000\ \mu s$, $a = 0.25$, $U = 2/3$.
- Problem: when $a$ is large the sender sits idle — and the denominator $1+2a$ **cannot be improved**, only the numerator can (via windows).

## 🪟 Sliding Window

- Sender and receiver each hold an **$N$-frame buffer**; up to $N$ unacknowledged frames may be in flight.
- **$k$-bit numbering** (modulo $2^k$), constraint $N \leq 2^k$; ACK carries the **next expected** number.
- Extras: **RNR** (receive-not-ready — ACK without permission to continue) and **piggybacking** (ACK riding on reverse data).
- Performance (error-free):

$$U = \min(1, N/(1+2a))$$

- That is: $U = 1$ if $N \geq 2a+1$ (pipe stays full), else $U = N/(1+2a)$.
- Exam reflex: convert units → compute $a$ → compare $N$ against $1+2a$ → apply the formula; round window sizes **up**.
- *Exam relevance: flow-control slides are the examinable core of this lecture; framing/topology background is context.*

## 📌 TL;DR

- $T_{tx} = L/C$, $T_{prop} = d/v$, $a = T_{prop}/T_{tx}$.
- Stop-and-Wait: $U = 1/(1+2a)$ — simple, idle-bound.
- Sliding Window: $U = \min(1, N/(1+2a))$ — pipeline up to $N$ frames so the numerator grows.
