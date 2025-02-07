import { SimpleAdapter, ChainBlocks, FetchResultFees, FetchOptions } from "../adapters/types";
import { CHAIN } from "../helpers/chains";
import { getPrices } from "../utils/prices";
import { queryFlipside } from "../helpers/flipsidecrypto";
import { Chain } from "@defillama/sdk/build/general";


type IGasTokenId = {
  [l: string | Chain]: string;
}
const gasTokenId: IGasTokenId = {
  [CHAIN.ETHEREUM]: "coingecko:ethereum",
  [CHAIN.BSC]: "coingecko:binancecoin",
  [CHAIN.POLYGON]: "coingecko:matic-network",
  [CHAIN.FANTOM]: "coingecko:fantom",
  [CHAIN.AVAX]: "coingecko:avalanche-2",
  [CHAIN.ARBITRUM]: "coingecko:ethereum",
  [CHAIN.OPTIMISM]: "coingecko:ethereum"
}

interface ILog {
  data: string;
  transactionHash: string;
  topics: string[];
  chain: string;
}

const chains: string[] = [...new Set([CHAIN.ETHEREUM, CHAIN.BSC, CHAIN.POLYGON, CHAIN.OPTIMISM, CHAIN.ARBITRUM, CHAIN.AVAX])];

const build_link_query = (from: number, to: number): string => {
  return chains.map((chain: Chain) => `
    SELECT
      data,
      topics,
      tx_hash as transactionHash,
      '${chain}' as chain
    from
      ${chain === "avax" ? "avalanche" : chain}.core.fact_event_logs logs
    WHERE
      block_number > 10000000
      and logs.BLOCK_TIMESTAMP BETWEEN '${from * 1000}' AND '${to * 1000}'
      and topics[0] = '0xd8d7ecc4800d25fa53ce0372f13a416d98907a7ef3d8d3bdd79cf4fe75529c65'`).join(" union all ")
}

const fetchRequests = (chain: Chain) => {
  return async ({ fromTimestamp, toTimestamp }: FetchOptions) => {
    const query_paid = build_link_query(fromTimestamp, toTimestamp)

    const linkPaid_logs: ILog[] = (await queryFlipside(query_paid, 260))
      .map(([data, topics, transactionHash, chain]: [string, string[], string, string]) => {
        return {
          data,
          topics,
          transactionHash,
          chain
        } as ILog
      }).filter((e: ILog) => e.chain === chain);

    const link_amount: number = linkPaid_logs.map((e: ILog) => {
      const data = e.data.replace('0x', '');
      const payments = Number('0x'+data.slice(128, 192)) / 10 ** 18;
      return payments;
    }).reduce((a: number, b: number) => a + b, 0);

    const linkAddress = "coingecko:chainlink";
    const gasToken = gasTokenId[chain];
    const prices = (await getPrices([linkAddress, gasToken], fromTimestamp))
    const linkPrice = prices[linkAddress].price
    const dailyFeesUsd = link_amount * linkPrice;

    return {
      dailyFees: dailyFeesUsd.toString()
    }
  }

}


const adapter: SimpleAdapter = {
  version: 2,
  adapter: {
    [CHAIN.ETHEREUM]: {
      fetch: fetchRequests(CHAIN.ETHEREUM),
      start: '2023-02-03',
    },
    [CHAIN.BSC]: {
      fetch: fetchRequests(CHAIN.BSC),
      start: '2023-02-03',
    },
    [CHAIN.POLYGON]: {
      fetch: fetchRequests(CHAIN.POLYGON),
      start: '2023-02-03',
    },
    [CHAIN.OPTIMISM]: {
      fetch: fetchRequests(CHAIN.OPTIMISM),
      start: '2023-02-03',
    },
    [CHAIN.ARBITRUM]: {
      fetch: fetchRequests(CHAIN.ARBITRUM),
      start: '2023-02-03',
    },
    [CHAIN.AVAX]: {
      fetch: fetchRequests(CHAIN.AVAX),
      start: '2023-02-03',
      runAtCurrTime: true,
    },
  },
  isExpensiveAdapter: true,
}
export default adapter;
