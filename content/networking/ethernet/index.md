---
title: "🔌 Ethernet"
date: 2026-09-23
draft: false
---

**1-persistent CSMA/CD** made manufacturable: addresses, frames, minimum size, backoff, and scaling by segmentation.

## 🖼️ Frame and Address

- **48-bit addresses**: unicast vs multicast by the 2nd hex digit (even = unicast, odd = multicast); `FF:FF:FF:FF:FF:FF` = **broadcast**.
- Frame: preamble `7×10101010` + SFD `10101011` (clock sync) → dest/src → **Type** (demux key) → body up to **1500 B** → **pad** (stretch shorts) → **FCS** (CRC over address→pad).
- Min **64 B** = 14 (header) + 46 (min payload) + 4 (FCS); **9.6 µs** inter-frame gap; receivers accept own/broadcast/subscribed-multicast (or everything in **promiscuous** mode).
- Sender rule: idle → send; busy → wait then send immediately; on collision → stop, jam (32–48 bits), retry later.

## 📏 Minimum Size and Backoff

- Principle: the sender must still be transmitting when a worst-case collision returns — frame time $\geq 2\tau$ ($\tau$ = longest one-way propagation):

$$L_{min} = 2·T_{e2e}·R$$

- 802.3 identity: max $2T$ = **51.2 µs** ↔ 2500 m; at 10 Mbps one bit = 0.1 µs, so 512 bits = 51.2 µs → **64 B** floor. Tutorial form: worst path (5 segments + 4 repeaters) → $T_{e2e} = 18\ \mu s$ → $L_{min} = 36\ \mu s \times 20\ \text{Mbps} = 720$ bits.
- **Binary Exponential Backoff**: after collision $n$, delay $K \times 51.2\ \mu s$ with $K \leq 1023$, abort at 16 tries. First retry collides w.p. 0.5, second w.p. 0.25, and so on.

## 🔀 Domains and Evolution

- **Collision domain**: where collisions propagate — hubs/repeaters forward them; bridges/switches/routers stop them.
- **Broadcast domain**: where broadcasts propagate — hubs/bridges/switches (L2) forward; routers split (L3). Keep LANs small, join with routers.
- **Hub** repeats everything out all ports (collisions kill throughput); **switch** buffers and forwards only to destination — no collisions, higher aggregate bandwidth.
- Experience rules: >30% load = heavy; ~200 hosts typical (spec ≤1024); evolution Fast → Gigabit → 10-Gigabit keeps framing while changing PHY.
- *Exam relevance: address typing, minimum-size math, BEB probabilities, and domain counting are the examinable skills; history/version detail is context.*

## 📌 TL;DR

- $L_{min} = 2·T_{e2e}·R$ → **64 B**; BEB $K \times 51.2\ \mu s$, $K \leq 1023$, abort at 16.
- 48-bit addresses; 1500-B MTU; 1-persistent CSMA/CD sender.
- Scale by segmentation: hubs extend collisions, switches/bridges split them, routers split broadcasts.
