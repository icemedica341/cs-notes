---
title: "Introduction to Computer Networks"
date: 2026-09-23
draft: false
---

The framing lecture for NTU **SC2008 Computer Network**: course logistics, the birth of the Internet, and the one question Part I keeps asking.

## 🗺️ Course Map

- **Part I (weeks 1–7)** — underlying layers, bottom-up: physical resilience → DLL [[dll-flow-control|flow control]] → DLL [[dll-error-control|error control]] → LAN → [[lan-mac|MAC]] → [[ethernet|Ethernet]] → [[wlan|WLAN]] → [[network-paradigms|network paradigms]].
- **Part II (weeks 8–13)** — higher layers, top-down: applications → TCP → IP → routing.
- References: **Kurose & Ross** (*Top-Down Approach*) and **Comer** (*Computer Networks and Internets*) — one for each direction.
- Assessment (per L1 slide): mid-term 30% (MCQ quiz), final 30%, labs 35%, tutorial attendance 5%.

## 📜 Internet History in Brief

- 1960s: **DARPA** funds packet-network research.
- 1969: **ARPANET** — first node at UCLA; first packets sent 29/10/1969.
- 1972–74: **Cerf & Kahn** define **TCP/IP**.
- 1973: **Metcalfe** invents **Ethernet** at Xerox PARC (named after the luminiferous "ether").
- Then: **DNS**, the 1988 **Morris worm**, the **WWW** (1989–90), and the Cisco/Google/Facebook era.
- Lecture's lesson: **vision + perseverance** of engineers — the network exists because people kept building it.

## 🧵 The Unifying Tension

- Every lecture repeats one trade-off: **efficiency vs. reliability under sharing**.
- The medium is **shared, lossy, and delay-bound** — every formula in the course measures one side of that trade-off.
- Part I's chain: *whether/where* you're connected ([[network-layering-and-physical-resilience|layering + resilience]]) → *how fast* without overflowing anyone ([[dll-flow-control|flow control]]) → *how correctly* despite corruption ([[dll-error-control|error control]]) → *how fairly* a whole LAN shares ([[lan-mac|MAC]] onward).

## 🔬 Labs at a Glance

- **Lab 1** — observe: classify NIC/IP modules into TCP/IP layers, MAC via `ipconfig` + OUI lookup, NTU range via APNIC whois, DHCP/NAT, DNS, gateway/ARP, ping/tracert.
- **Lab 2** — program: RFC 865 Quote-of-the-Day over UDP in Java (`DatagramSocket`), optional TCP threaded server.
- **Lab 3** — capture: Wireshark capture of your own Lab-2 client; dissect Ethernet II / IP / UDP headers in hex.
- **Lab 4** — analyze: parse sFlow CSV logs in Python (Top-5 talkers, TCP/UDP share, total MB = `IP_size × 2048`).
- Chain: **observe → program → capture → analyze**.

## 📌 TL;DR

- **Part I = bottom-up** (wire → link → LAN → paradigms); **Part II = top-down** (apps → TCP → IP → routing).
- Internet history is conceptual framing: DARPA → ARPANET → TCP/IP → Ethernet → DNS → WWW.
- The whole course asks: *how do independent machines talk over a shared, unreliable medium — efficiently and correctly?*
