import {
  BitgetEarnAssetsResponse,
  BitgetSpotAssets,
  BitgetAccountBalanceResponse,
} from '../dto';
import { APICredentials } from '../types';
import { BitgetBaseRestClient } from './rest-base';

export class BitgetRestClient extends BitgetBaseRestClient {
  constructor(credentials: APICredentials, baseUrl: string) {
    super(credentials, baseUrl);
  }

  public getAllAccountBalance(): Promise<BitgetAccountBalanceResponse> {
    return this.getPrivate('/api/v2/account/all-account-balance');
  }

  public getSpotAccountAssets(params?: {
    coin: string;
    assetType: string;
  }): Promise<BitgetSpotAssets[]> {
    return this.getPrivate('/api/v2/spot/account/assets', params);
  }

  public getEarnAccountAssets(params?: {
    coin: string;
  }): Promise<BitgetEarnAssetsResponse> {
    return this.getPrivate('/api/v2/earn/account/assets', params);
  }
}
