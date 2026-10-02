---
title: "LAN Introduction"
aliases: ["networking/lan-introduction/"]
date: 2026-09-23
draft: false
---

What a LAN is, how it maps to the stack, and the menu of ways to share one medium.

## 📌 LAN Basics

- **LAN** = small (few km), owner-operated network on **shared media** — home/office/campus, normally no leased lines.
- Maps to **IEEE 802 PHY** + a split DLL: **LLC** (flow/error control, the L3/L4-style half) and **MAC** (framing, addressing, medium arbitration — the part traditional L2 lacks).
- Several MAC options can sit under the same LLC.

## 🔀 Topologies and Media

- **Bus/tree**: multipoint medium, every transmission heard everywhere — needs unique addresses, **framing** (small blocks, not streams), terminators absorbing ends.
- **Ring**: repeaters on unidirectional links in a loop; destination copies its frame, source removes it on return; MAC decides insertion timing.
- **Star**: each station full-duplex to a central node — a **hub** (rebroadcasts: physically star, logically bus, one-at-a-time or collision) or a **switch** (forwards only to destination — today's technology).
- Media: Cat 3 voice-grade UTP (cheap, slow) → Cat 5/5e/6 (fast, switched star) → STP/coax → **fiber** (isolated, high-capacity, costly install) → **wireless** (fading channel).
- Choice criteria: **reliability, expandability, performance** in the context of medium, wiring, and access control.

## 🎛️ Static vs Dynamic Allocation

- **Static (synchronous)**: dedicated capacity per connection — **TDM** (one slot each, wasted when idle), **FDM** (split frequency bands), **CDM** (code division). Efficient only with a constant, backlogged population.
- **Dynamic (asynchronous)**: capacity on demand —
  - **Round robin**: turn-taking up to a data limit; good when most stations are backlogged, else turn-passing overhead dominates.
  - **Reservation**: slotted time reserved centrally or distributively.
  - **Contention**: all contend, listen, retransmit on collision (Aloha, CSMA) — great for bursty traffic at light/moderate load, bad under heavy load.
- Central MAC decision = simple stations but single point of failure/bottleneck; distributed = the [[lan-mac|MAC]] lecture's territory.

## 📌 TL;DR

- LAN = PHY + **LLC** (flow/error) + **MAC** (arbitrate the medium).
- Topologies: **bus/tree** (broadcast), **ring** (circulate-and-remove), **star** (hub-broadcast vs switch-forward).
- Sharing: **static** (TDM/FDM/CDM) vs **dynamic** (round-robin / reservation / contention).
