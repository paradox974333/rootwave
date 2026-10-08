# Rootwave-1: 1 TiB Unified-Memory SoC (architecture draft)

**Status:** concept-level architecture. Numbers are planning estimates, not silicon-validated.

## Key point: 1 TiB cannot be on-die
The largest SRAM caches are hundreds of MB. 1 TiB of "unified memory" means one flat, cache-coherent
physical address space shared by CPU, GPU and NPU, backed by memory **packaged beside** the compute die
(as Apple/NVIDIA-class unified designs do). Rootwave-1 does this with a two-tier package.

## Package overview (2.5D, CoWoS-class interposer)
| Block | Count | Detail |
|---|---|---|
| Compute die (3 nm-class) | 1 (2 chiplets, UCIe-Advanced die-to-die) | 32 CPU cores (Arm/RISC-V, 8-wide), 96 GPU/NPU compute clusters |
| HBM4 stacks (Tier-0) | 4 x 64 GiB = **256 GiB** | ~2 TB/s each, ~8 TB/s aggregate |
| LPDDR6 packages (Tier-1) | 16 x 48 GiB = **768 GiB** | ~64 GB/s each, ~1 TB/s aggregate |
| **Total** | **1 TiB (1024 GiB)** | one 40-bit physical address space |

## Memory system
- **Single address space:** 0x00_0000_0000-0x3F_FFFF_FFFF = HBM4, 0x40_0000_0000-0xFF_FFFF_FFFF = LPDDR6 (see `rtl/um_addr_map.sv`).
- **Coherence:** directory-based, full coherence across CPU/GPU/NPU; system-level cache (SLC) 512 MiB SRAM in front of both tiers.
- **Interleave:** 4 KiB page-granule, XOR-hashed across stacks/packages to avoid stride hot spots.
- **Tiering:** hardware access counters per 2 MiB region promote hot pages to HBM, demote cold to LPDDR6 (OS-visible hints, transparent by default).
- **Integrity:** ECC on all tiers (HBM on-die + link ECC, LPDDR6 inline ECC), memory encryption (AES-XTS) at the controller.
- **MMU:** 48-bit VA, 40-bit PA, 4 KiB/2 MiB/1 GiB pages, shared IOMMU/SMMU for all agents (zero-copy).
- **Expansion (optional):** 2 x CXL 3.x x16 ports for pooled memory beyond 1 TiB.

## Fabric & I/O
- Coherent mesh NoC, 2 TB/s bisection per chiplet; QoS classes for real-time (display/camera) vs bulk traffic.
- PCIe 6.0 x16 x2, 2 x 400G Ethernet, secure enclave + root of trust.

## Estimated budget (planning only)
| Metric | Target |
|---|---|
| Compute die area | ~600 mm2 total over 2 chiplets |
| Power | 350 W TDP (HBM ~90 W, LPDDR6 ~40 W) |
| Peak AI | ~1.5 PFLOPS FP8 (sparse) |

## Open risks
1. HBM4 64 GiB (16-high) supply and yield; fallback is 48 GiB stacks (192 GiB Tier-0, more LPDDR6).
2. Interposer size and warpage with 4 HBM + 2 chiplets + 16 LPDDR packages (LPDDR6 may need an organic-substrate side-mount).
3. Tier-1 bandwidth is 8x lower than Tier-0, so tiering policy quality dominates real-world performance.

## Next steps
RTL for the memory controller front-end and SLC, UVM testbench for coherence, floorplan study, PPA exploration.
