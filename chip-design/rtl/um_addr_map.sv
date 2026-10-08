// Rootwave-1 unified memory address decoder.
// One flat 1 TiB physical address space (40 bits) over two tiers:
//   [0x00_0000_0000, 0x3F_FFFF_FFFF]  Tier-0  HBM4   256 GiB  (4 stacks)
//   [0x40_0000_0000, 0xFF_FFFF_FFFF]  Tier-1  LPDDR6 768 GiB  (16 packages)
// Within a tier, 4 KiB-granule hash interleave spreads pages across channels.
module um_addr_map #(
  parameter int PA_W        = 40,
  parameter int HBM_STACKS  = 4,
  parameter int LP_PKGS     = 16
) (
  input  logic [PA_W-1:0]                 pa,
  output logic                            tier,        // 0 = HBM4, 1 = LPDDR6
  output logic [$clog2(HBM_STACKS)-1:0]   hbm_stack,
  output logic [$clog2(LP_PKGS)-1:0]      lp_pkg,
  output logic [PA_W-1:0]                 dev_addr     // address inside the device
);
  localparam logic [PA_W-1:0] TIER1_BASE = 40'h40_0000_0000; // 256 GiB

  // Tier-1 holds 768 GiB = 3 * 256 GiB, so pkg select is a divide by 48 GiB.
  // Use page-granule modulo instead of a divider: page = pa[39:12].
  logic [PA_W-13:0] page, page_t1;
  logic [11:0]      off;
  assign off  = pa[11:0];
  assign page = pa[PA_W-1:12];
  assign page_t1 = page - (TIER1_BASE >> 12);

  always_comb begin
    tier      = (pa >= TIER1_BASE);
    hbm_stack = '0;
    lp_pkg    = '0;
    dev_addr  = '0;
    if (!tier) begin
      // XOR-fold hash of upper page bits avoids power-of-two stride hot spots.
      hbm_stack = page[$clog2(HBM_STACKS)-1:0] ^ page[2*$clog2(HBM_STACKS)-1:$clog2(HBM_STACKS)];
      dev_addr  = PA_W'((PA_W'(page) >> $clog2(HBM_STACKS)) << 12) | PA_W'(off);
    end else begin
      lp_pkg    = page_t1 % LP_PKGS;
      dev_addr  = PA_W'((PA_W'(page_t1) / LP_PKGS) << 12) | PA_W'(off);
    end
  end
endmodule
