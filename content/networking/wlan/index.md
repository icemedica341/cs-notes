---
title: "📶 WLAN"
date: 2026-09-23
draft: false
---

Copper's assumptions break over radio: fading, inaudibility, and no collision detection — so 802.11 avoids instead of detecting, and reserves airtime via MARP.

## 👻 Hidden and Exposed Terminals

- Wireless impairments: **path loss**, **ISM-band interference** (2.4 GHz phones/microwaves), **multipath** reflections.
- **Hidden terminal**: A and C mutually inaudible but jointly audible at B (barrier or attenuation) — they unknowingly interfere at B. Ethernet has no such case.
- **Exposed terminal**: a station needlessly defers though its transmission would not disturb the ongoing one.
- Cure: reserve with short **RTS**, rebroadcast **CTS** heard by all, others set **NAV** and defer — RTS may still collide but is short. Full exchange: **RTS–CTS–DATA–ACK** on **DIFS/SIFS/NAV** timing.
- No CD because a transmitting radio cannot hear weak faded receptions; access is **CSMA/CA** (DCF, distributed contention) with optional **PCF** polling for time-bound traffic; reliability via DATA–ACK retransmission.

## 🏗️ Architecture in Brief

- Modes: **infrastructure** (via APs) vs **ad-hoc** (no AP); **BSS** = stations + their AP; **ESS** = linked BSSs.
- Join: scan beacons/probes (SSID/MAC) → select AP → authenticate → associate → DHCP.
- 802.11 frame carries up to four 6-B addresses (receiver/transmitter/AP-side router interface), 0–2312 B payload, 4-B CRC.

## 📊 MARP Utilization

- **MARP** (reservation protocol): Phase 1 — contend via some MAC until one reservation succeeds; Phase 2 — winner sends one DATA frame. Reservation trials are geometric with success $S_r$ per trial, so mean trials $E[X] = 1/S_r$ and mean window $u + v/S_r$ ($u$ = data time, $v$ = reservation-frame time):

$$S = u/(u+v/S_r)$$

- With data bits inside the reservation frame the denominator becomes $(u-v) + v/S_r$.
- Worked: $u = 1$ s, $v = 5$ ms, $S_r = 0.5$ → $S = 1/(1 + 0.005/0.5) \approx 0.99$.
- Tutorial form with reservation overhead: $S = (\mu+\nu)/(\mu+\nu/S_r)$; with slotted-Aloha reservation $S_r = Ge^{-G}$, optimum $G = 1$ ($p = 1/n$) gives $S_r = 1/e$.
- *Exam relevance: MARP scheme + utilization calculation/maximization is the examinable calculation; the rest is context.*

## 📌 TL;DR

- Hidden/exposed terminals force **CSMA/CA** with **RTS–CTS–DATA–ACK** and NAV.
- $S = u/(u+v/S_r)$ — contend to claim, then send collision-free.
- BSS/ESS, beacons/probes/association, and 4-address frames are the supporting vocabulary.
