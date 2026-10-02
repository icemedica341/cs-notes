---
title: "DLL Error Control"
aliases: ["networking/dll-error-control/"]
date: 2026-09-23
draft: false
---

Drops the error-free assumption: frames get **lost** (never arrive) or **damaged** (bits flipped). Detection (parity/CRC) spots it; **ARQ** fixes it by retransmission.

## 🔁 ARQ Family

- **FEC** (Hamming/Reed–Solomon) corrects at the receiver with redundant bits; **ARQ** retransmits after a **timeout** or a **NAK**.
- HDLC flavours: **RR** (receive-ready/ACK), **RNR** (not ready), **REJ** (go-back-N reject), **SREJ** (selective reject of frame $n$).
- Builds on [[dll-flow-control|flow control]]: Stop-and-Wait → Stop-and-Wait ARQ; Sliding Window → Go-Back-N + Selective Reject.

## 🛑 Stop-and-Wait ARQ

- Send one frame; destination **ACKs** correct frames, discards or **NAKs** damaged ones; source retransmits on NAK/timeout/damaged-ACK (receiver discards duplicates).
- With per-transmission loss probability $P$:

$$U = (1-P)/(1+2a)$$

- Same link as before plus $P = 0.1$: $U = 0.9/1.5 = 0.6$ (vs $2/3$ error-free) — errors discount the numerator by $(1-P)$.

## ↩️ Go-Back-N vs 🎯 Selective Reject

- **Go-Back-N (cautious)**: receiver accepts strictly **in-sequence**, discards everything after an error; sender resends the bad frame **plus all subsequent** on NAK/timeout. Simple receiver, wasteful resends. Max window $2^k - 1$.
- **Selective Reject (efficient)**: receiver **buffers out-of-order** frames; sender resends **only** the failed frame via **SREJ**; receiver reorders before passing up. Minimal retransmission, complex receiver.
- Selective Reject utilization:

$$U = 1-P$$

  for $N \geq 2a+1$, or $U = N(1-P)/(1+2a)$ when window-limited.

- Exam rule given in the slides: compute **Go-Back-N with the Selective-Reject formula** — the exact GBN formula is not required.
- Tutorial companion: HDLC `I(i,j)` / `RR` / `SREJ` numbering mod $2^k$ with cumulative ACKs and selective recovery triplets like `SREJ(5)` → `I(5,4)` → `RR(0)`.
- *Exam relevance: all ARQ slides are examinable; parity/CRC detail is context.*

## 📌 TL;DR

- Stop-and-Wait ARQ: $U = (1-P)/(1+2a)$.
- Selective Reject: $U = 1-P$ (or $N(1-P)/(1+2a)$) — use this for GBN calculations too.
- **GBN** = discard-all, simple; **SR** = buffer + resend-only-what-failed, efficient.
