---
title: "Network Paradigms"
aliases: ["networking/network-paradigms/"]
date: 2026-09-23
draft: false
---

The zoom-out: reserve-then-talk (**circuit**) vs store-and-forward (**packet**, as datagram or virtual-circuit) — and when each wins.

## 📞 Circuit Switching

- Three phases: **establish** a dedicated link-by-link path → transfer **in order** with no per-packet address overhead → **disconnect** and free resources.
- Pros: continuous transfer, reserved/protected connection. Cons: idle connections hold resources, capped rate, paid-for silence, poor scalability (a 10 Gb/s trunk holds ~156k 64-kb/s calls).
- Delay: setup + transmission + propagation — single-shot, no per-hop queueing.
- Real use: PSTN, 1G voice, 2G/3G voice+limited-data.

## 📦 Packet Switching

- Split long messages into ~1000-B **packets** (data + control), send one at a time via **store-and-forward** (receive → buffer → pass on).
- **Datagram**: each packet carries sequence + destination, travels independently (possibly diverse paths), may arrive out of order — like package delivery.
- **Virtual-circuit**: pre-fix a path, stamp a **VCI** (not the destination) on each packet; nodes forward by VCI table; capacity still **shared**, not reserved. (Setup packets themselves still need datagram-style routing.)
- Pros: links dynamically shared, still accepted under heavy load. Cons: queueing delay, possible loss + retransmission.
- Pipeline: while packet 1 traverses hop 2, packet 2 starts hop 1:

$$T = (hops + pkts − 1)·T_f$$

  e.g. 4 packets over 2 hops = $5·T_f$ (first packet's 2 hops + 3 pipelined).

## ⚖️ Crossover

- Circuit: $D_{ckt} = s + x/b + k·d$ (setup $s$, data $x$ at rate $b$, $k$-hop propagation $d$).
- Packet (lightly loaded): $D_{pkt} = x/b + (k-1)·p/b + k·d$ (packet size $p$).
- Packet wins iff the setup time exceeds the extra store-and-forward staggering:

$$(k−1)p/b < s$$

- Switching-time rule of thumb: 10 µs ≈ 2 km of cable — negligible (~2%) on a 5000 km path even with 50 switches.
- Real use: current Internet = datagram; X.25/aeronautical = virtual-circuit; 4G/5G = packet with voice as priority data.

## 📌 TL;DR

- Circuit = **reserve, then talk**; datagram = **independent packets**; virtual-circuit = **fixed path, shared links, VCI**.
- Pipeline: $T = (hops + pkts − 1)·T_f$.
- Packet wins iff $(k−1)p/b < s$ — the Internet scales because it chose per-frame reservation over per-call reservation.
