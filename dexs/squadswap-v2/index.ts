import * as sdk from "@defillama/sdk";
import { DEFAULT_TOTAL_VOLUME_FIELD } from "../../helpers/getUniSubgraphVolume";
import { CHAIN } from "../../helpers/chains";
import { getGraphDimensions2 } from "../../helpers/getUniSubgraph";
import { SimpleAdapter } from "../../adapters/types";

const endpoints = {
  [CHAIN.BSC]: sdk.graph.modifyEndpoint('FDn5m4S3bFqd8TV97P61i3dhZLpSigFwpRQEan2mrjTE'),
};

const v2Graph = getGraphDimensions2({
  graphUrls: endpoints,
  totalVolume: {
    factory: "pancakeFactories",
    field: DEFAULT_TOTAL_VOLUME_FIELD,
  },
  feesPercent: {
    type: "volume",
    Fees: 0.02,
    UserFees: 0.02,
    Revenue: 0.01,
    ProtocolRevenue: 0.005,
    HoldersRevenue: 0.005,
    SupplySideRevenue: 0.004,
  }
});

const adapter: SimpleAdapter = {
  version: 2,
  adapter: {
    [CHAIN.BSC]: {
      fetch: v2Graph(CHAIN.BSC),
      start: '2023-12-12'
    },
  },
};

export default adapter;
