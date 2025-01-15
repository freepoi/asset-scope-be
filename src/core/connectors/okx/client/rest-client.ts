import { AccountBalanceResponse } from '../dto/account-balance-response';
import { AssetBalancesResponse } from '../dto/asset-balance-response';
import { MarketTicker } from '../dto/market-ticker-response';
import { TotalAssetValuationResponse } from '../dto/total-asset-valuation-response';
import { APICredentials } from '../types';
import OkxBaseRestClient from './rest-base';

export class OkxRestClient extends OkxBaseRestClient {
  constructor(credentials: APICredentials, baseUrl: string) {
    super(credentials, baseUrl);
  }

  public getAccountBalances(): Promise<AccountBalanceResponse[]> {
    return this.getPrivate('/api/v5/account/balance');
  }

  public getAssetBalances(): Promise<AssetBalancesResponse[]> {
    return this.getPrivate('/api/v5/asset/balances');
  }

  public getAssetValuation(params?: {
    ccy: string;
  }): Promise<TotalAssetValuationResponse[]> {
    return this.getPrivate('/api/v5/asset/asset-valuation', params);
  }

  /**
   * Fetches the market ticker information for a specific instrument.
   *
   * @param params - The parameters for the request.
   * @param params.instId - The instrument ID for which to fetch the ticker information. eg. 'BTC-USD-SWAP'.
   * @returns A promise that resolves with the market ticker information.
   */
  public marketTicker(params?: { instId: string }) {
    return this.get('/api/v5/market/ticker', params);
  }

  public async marketTickers(params: { instType: string }): Promise<{
    tickers: MarketTicker[];
    tickersMap: Record<string, MarketTicker>;
  }> {
    const tickers = await this.get<MarketTicker[]>(
      '/api/v5/market/tickers',
      params,
    );

    return {
      tickers,
      tickersMap: tickers.reduce(
        (acc: Record<string, MarketTicker>, ticker) => {
          acc[ticker.instId] = ticker;

          return acc;
        },
        {},
      ),
    };
  }
}
