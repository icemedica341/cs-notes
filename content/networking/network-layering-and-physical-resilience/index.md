---
title: "🧱 Network Layering and Physical Resilience"
date: 2026-09-23
draft: false
---

Where in the stack the data link lives, and whether the physical graph underneath is even connected.

## 🎂 Why Layer?

- **Layer $n$** offers services to layer $n+1$ via **SAPs** (Service Access Points) and passes data down through a defined interface.
- **Peers** (layer-$n$ entities on different machines) exchange **PDUs**; each PDU wraps the layer-above **SDU** plus a header (**encapsulation**).
- Benefits: **simplicity**, **flexibility**, **incremental change** — modify one layer transparently to the rest.
- Caveat flagged in the slides: *layering harmful? (design vs implementation)* — not elaborated.

## 🏗️ OSI 7 vs TCP/IP 5

| OSI layer | Unit | Job |
|---|---|---|
| 7 Application | data | File transfer, email, remote login |
| 6 Presentation | data | Format, encryption, compression |
| 5 Session | data | Dialogues, checkpoints |
| 4 Transport | segment | Process-to-process, in-sequence delivery |
| 3 Network | packet | Routing, logical addressing, congestion |
| 2 Data Link | frame | Framing, boundaries, ACK + retransmission, flow control |
| 1 Physical | bit | Voltage, timing, rates, connectors |

- **TCP/IP 5 layers**: Application (FTP/SMTP/HTTP) → Transport (TCP/UDP) → Network (IP/routing) → Link (PPP/Ethernet) → Physical (bits on the wire).
- Each layer adds its header descending the stack; routers act at the **network layer**; intermediate nodes process only headers at their own layer.
- Part I of the course = the lower layers (physical/link/network region).

## 🛡️ Physical Resilience

- **Reliability** = probability the network performs satisfactorily over a period.
- $MTBF = MTTF + MTTR$ — mean cycle = mean up-time + mean repair time.
- Per-link **availability** $r = 1-b$, where $b$ is the **break probability**.
- Assume link failures are **independent**, then:
  - **Series** (all must survive): multiply $r$ — $\prod r$.
  - **Parallel** (all must break to disconnect): multiply $b$ — $\prod b$.
  - **Hybrid**: decompose into paths (**path-based approach**), compute per-path availability, then combine.
- **Downtime** from availability: $(1-r) \times \text{seconds/year}$ — e.g. 99.9999% ("six nines") allows only ~31.5 s/year.
- Motive: the 2006 Taiwan (M7.1) earthquake severed 6 undersea cable systems — even a perfect DLL cannot deliver over a disconnected graph.

## 🧮 Worked Example

- Single link, $b = 0.05$: $r = 1 - 0.05 = 0.95$.
- Series of two ($b = 0.05$ each): $r = 0.95 \times 0.95 = 0.9025$, break prob $0.0975$.
- Parallel pair: break prob $0.05 \times 0.05 = 0.0025$.
- Hybrid (direct link in parallel with a two-link series path): $0.0975 \times 0.05 = 0.0045125$ disconnection probability.
- Tutorial archetype: reduce to series–parallel blocks first (complement ↔ multiply along series, multiply failures across parallel), *then* do arithmetic.

## 📌 TL;DR

- **Layering** = services up, PDUs across, headers added going down and stripped coming up.
- **Resilience** = $r = 1-b$; series ⇒ $\prod r$, parallel ⇒ $\prod b$; $MTBF = MTTF + MTTR$.
- A link-layer protocol is pointless if the physical path has a **single point of failure** with no alternative.
