import { SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import { DEFAULT_TOTAL_VOLUME_FIELD, getGraphDimensions2 } from "../../helpers/getUniSubgraph";

const v3Endpoints = {
  [CHAIN.MANTLE]: "https://agni.finance/graph/subgraphs/name/agni/exchange-v3"
}

const v3Graphs = getGraphDimensions2({
  graphUrls: v3Endpoints,
  totalVolume: {
    factory: "factories",
    field: DEFAULT_TOTAL_VOLUME_FIELD,
  },
  feesPercent: {
    type: "fees",
    ProtocolRevenue: 0,
    HoldersRevenue: 0,
    Fees: 0,
    UserFees: 100, // User fees are 100% of collected fees
    SupplySideRevenue: 100, // 100% of fees are going to LPs
    Revenue: 0 // Revenue is 100% of collected fees
  }
});

const adapter: SimpleAdapter = {
  version: 2,
  adapter: {
    [CHAIN.MANTLE]: {
      fetch: v3Graphs(CHAIN.MANTLE),
      start: '2023-07-19',
    },
  },
};

export default adapter;
