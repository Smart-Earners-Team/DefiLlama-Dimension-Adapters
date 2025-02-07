import * as sdk from "@defillama/sdk";
import { SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import { getStartTimestamp } from "../../helpers/getStartTimestamp";
import { DEFAULT_DAILY_VOLUME_FACTORY, DEFAULT_DAILY_VOLUME_FIELD, DEFAULT_TOTAL_VOLUME_FACTORY, DEFAULT_TOTAL_VOLUME_FIELD, getChainVolume2 } from "../../helpers/getUniSubgraphVolume";

const endpoints = {
  [CHAIN.POLYGON]: sdk.graph.modifyEndpoint('743VoDTGxZ1m3QHC3BCnTkKcvXqo8PfyTSs6QGHgcQKd'),
  [CHAIN.BSC]: sdk.graph.modifyEndpoint('xw8NYXanrWADWixeXQ8DBViHtEQvr85eAFcSADEmeDz'),
  // [CHAIN.ETHEREUM]: sdk.graph.modifyEndpoint('EduCYTCLoqd93219xiiVLFmpWbv8T7CXKtQMRNKKEeTY'),
  [CHAIN.AVAX]: sdk.graph.modifyEndpoint('ChLQrP8tJHHuFVHmKWoKfgUVNtYcbA7YAV1Y75Qjy6Sv'),
  // [CHAIN.FANTOM]: sdk.graph.modifyEndpoint('CK42aJEkVpr5kS3wygQrpmDegNcRDbdqtkzNhzRLfW21'),
};

const graphs = getChainVolume2({
  graphUrls: endpoints,
  totalVolume: {
    factory: DEFAULT_TOTAL_VOLUME_FACTORY,
    field: DEFAULT_TOTAL_VOLUME_FIELD,
  },
});

const adapter: SimpleAdapter = {
  version: 2,
  adapter: {
    [CHAIN.POLYGON]: {
      fetch: graphs(CHAIN.POLYGON),
      start: getStartTimestamp({
        endpoints: endpoints,
        chain: CHAIN.POLYGON,
        volumeField: DEFAULT_DAILY_VOLUME_FIELD,
        dailyDataField: `${DEFAULT_DAILY_VOLUME_FACTORY}s`
      })
    },
    [CHAIN.BSC]: {
      fetch: graphs(CHAIN.BSC),
      start: getStartTimestamp({
        endpoints: endpoints,
        chain: CHAIN.BSC,
        volumeField: DEFAULT_DAILY_VOLUME_FIELD,
        dailyDataField: `${DEFAULT_DAILY_VOLUME_FACTORY}s`
      })
    },
    // [CHAIN.ETHEREUM]: {
    //   fetch: graphs(CHAIN.ETHEREUM),
    //   start: getStartTimestamp({
    //     endpoints: endpoints,
    //     chain: CHAIN.ETHEREUM,
    //     volumeField: DEFAULT_DAILY_VOLUME_FIELD,
    //     dailyDataField: `${DEFAULT_DAILY_VOLUME_FACTORY}s`
    //   })
    // },
    [CHAIN.AVAX]: {
      fetch: graphs(CHAIN.AVAX),
      start: getStartTimestamp({
        endpoints: endpoints,
        chain: CHAIN.AVAX,
        volumeField: DEFAULT_DAILY_VOLUME_FIELD,
        dailyDataField: `${DEFAULT_DAILY_VOLUME_FACTORY}s`
      })
    },
    // [CHAIN.FANTOM]: {
    //   fetch: graphs(CHAIN.FANTOM),
    //   start: getStartTimestamp({
    //     endpoints: endpoints,
    //     chain: CHAIN.FANTOM,
    //     volumeField: DEFAULT_DAILY_VOLUME_FIELD,
    //     dailyDataField: `${DEFAULT_DAILY_VOLUME_FACTORY}s`
    //   })
    // },
  },
};

export default adapter;
