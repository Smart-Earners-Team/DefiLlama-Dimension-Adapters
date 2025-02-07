import { SimpleAdapter } from "../adapters/types";
import { MANTLE, CHAIN } from "../helpers/chains";
import {
  DEFAULT_TOTAL_VOLUME_FIELD,
  getGraphDimensions2,
} from "../helpers/getUniSubgraph";

type TStartTime = {
  [key: string]: number;
};
const startTimeV2: TStartTime = {
  [CHAIN.MANTLE]: 1704326400,
};

const v2Endpoints = {
  [CHAIN.MANTLE]:
    "https://subgraph-api.mantle.xyz/subgraphs/name/cleoexchange/cl-subgraph",
};

const v2Graphs = getGraphDimensions2({
  graphUrls: v2Endpoints,
  totalVolume: {
    factory: "factories",
    field: DEFAULT_TOTAL_VOLUME_FIELD,
  },
  feesPercent: {
    type: "fees",
    HoldersRevenue: 72,
    ProtocolRevenue: 8,
    UserFees: 100, // User fees are 100% of collected fees
    Revenue: 80, // Revenue is 50% of collected fees
    SupplySideRevenue: 20,
  },
});

const methodology = {
  UserFees: "User pays 0.3% fees on each swap.",
  ProtocolRevenue: "Revenue going to the protocol.",
  HoldersRevenue: "User fees are distributed among holders.",
};

const adapter: SimpleAdapter = {
  version: 2,
  adapter: {
    [CHAIN.MANTLE]: {
      fetch: v2Graphs(MANTLE),
      start: startTimeV2[CHAIN.MANTLE],
      meta: {
        methodology: {
          ...methodology,
          UserFees: "User pays 0.05%, 0.30%, or 1% on each swap.",
        },
      },
    },
  },
};

export default adapter;
