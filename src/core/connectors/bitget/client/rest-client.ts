import { BitgetAccountBalanceResponse } from '../dto/total-asset-valuation-response';
import { APICredentials } from '../types';
import { BitgetBaseRestClient } from './rest-base';

export class BitgetRestClient extends BitgetBaseRestClient {
  constructor(credentials: APICredentials, baseUrl: string) {
    super(credentials, baseUrl);
  }

  public getAllAccountBalance(): Promise<BitgetAccountBalanceResponse> {
    return this.getPrivate('/api/v2/account/all-account-balance');
  }
}
