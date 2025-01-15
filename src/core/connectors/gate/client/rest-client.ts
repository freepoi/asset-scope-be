import { GateWalletTotalBalanceResponse } from '../dto/gate-wallet-total-balance-response';
import { APICredentials } from '../types';
import { GateBaseRestClient } from './rest-base';

export class GateRestClient extends GateBaseRestClient {
  constructor(credentials: APICredentials, baseUrl: string) {
    super(credentials, baseUrl);
  }

  public getAllAccountBalance(): Promise<GateWalletTotalBalanceResponse> {
    return this.getPrivate('/api/v4/wallet/total_balance');
  }
}
