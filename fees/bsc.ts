import * as sdk from "@defillama/sdk";
import { Adapter, ProtocolType } from "../adapters/types";
import { BSC } from "../helpers/chains";
import { request, } from "graphql-request";
import type { ChainEndpoints, FetchOptions } from "../adapters/types"
import { Chain } from '@defillama/sdk/build/general';

const endpoints = {
  [BSC]:
    sdk.graph.modifyEndpoint('3a3f5kp31kutZzjmQoE2NKBSr6Ady5rgxRxD2nygYcQo')
}


const graphs = (graphUrls: ChainEndpoints) => {
  return (chain: Chain) => {
    return async ({ createBalances, getFromBlock, getToBlock, toTimestamp }: FetchOptions) => {
      const dailyFees = createBalances()

      const graphQuery = `query txFees {
        yesterday: fee(id: "1", block: { number: ${await getFromBlock()} }) {
          totalFees
        }
        today: fee(id: "1", block: { number: ${await getToBlock()} }) {
          totalFees
        }
      }`;

      const graphRes = await request(graphUrls[chain], graphQuery);

      const dailyFee = graphRes["today"]["totalFees"] - graphRes["yesterday"]["totalFees"]
      console.log(dailyFee, graphRes)
      dailyFees.addGasToken(dailyFee * 1e18)

      return {
        dailyFees,
        // totalFees: finalTotalFee.toString(),
        dailyRevenue: toTimestamp < 1638234000 ? 0: dailyFees.clone(0.1), // https://github.com/bnb-chain/BEPs/blob/master/BEP95.md
      };
    };
  };
};


const adapter: Adapter = {
  version: 2,
  adapter: {
    [BSC]: {
      fetch: graphs(endpoints)(BSC),
      start: '2020-08-29',
    },
  },
  protocolType: ProtocolType.CHAIN
}

export default adapter;
