---
title: "Formula Reference"
aliases: ["networking/formula-reference/"]
date: 2026-09-23
draft: false
---

Every key formula from Part I in one place. See the per-topic notes for derivations and worked numbers.

## ⏱️ Delays and Utilization

| Quantity | Formula |
|---|---|
| Transmission delay | $T_{tx} = L/C$ |
| Propagation delay | $T_{prop} = d/v$ |
| Normalized propagation | $a = T_{prop}/T_{tx}$ |
| Stop-and-Wait | $U = 1/(1+2a)$ |
| Sliding Window | $U = \min(1, N/(1+2a))$ |
| Stop-and-Wait ARQ | $U = (1-P)/(1+2a)$ |
| Selective Reject | $U = 1-P$ (or $N(1-P)/(1+2a)$) |

## 🛡️ Availability

| Quantity | Formula |
|---|---|
| Availability | $r = 1-b$ |
| Series | $\prod r$ (all must survive) |
| Parallel | $\prod b$ (all must break) |
| MTBF | $MTBF = MTTF + MTTR$ |
| Downtime | $(1-r) \times \text{seconds/year}$ |

## 📡 Sharing

| Quantity | Formula |
|---|---|
| Slotted Aloha | $S = G e^{-G}$, max $1/e$ at $G = 1$ |
| Pure Aloha | $S = G e^{-2G}$, max $1/(2e)$ at $G = 0.5$ |
| MARP | $S = u/(u+v/S_r)$ |
| Ethernet min frame | $L_{min} = 2·T_{e2e}·R$ → 64 B |
| BEB | $K \times 51.2\ \mu s$, $K \leq 1023$, abort at 16 |

## 🔀 Switching

| Quantity | Formula |
|---|---|
| Store-and-forward pipeline | $T = (hops + pkts − 1)·T_f$ |
| Circuit vs packet | packet wins iff $(k−1)p/b < s$ |

## 🧭 Exam Reflex Order

- Convert units (B↔b, km↔µs, Mbps↔b/µs) → compute $a$ / $W$ / $1+2a$ → reduce topology to series–parallel blocks or pipeline setup → *then* arithmetic.
- Report throughput as useful-over-cycle; enumerate slots/outcomes completely; state crossovers symbolically.

## 📌 TL;DR

- **Delays** feed **utilization**; **availability** multiplies along paths; **sharing** peaks at $1/e$; **switching** pipelines or reserves.
- Full story: [[dll-flow-control|flow control]] → [[dll-error-control|error control]] → [[lan-mac|MAC]] → [[ethernet|Ethernet]] → [[wlan|WLAN]] → [[network-paradigms|paradigms]].
