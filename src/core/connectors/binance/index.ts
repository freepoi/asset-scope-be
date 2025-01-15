import { Spot } from '@binance/connector-typescript';
import { BnWallet } from './modules/interface/wallet';
import type { AxiosProxyConfig } from 'node_modules/.pnpm/axios@1.7.9/node_modules/axios';

interface SpotOptions {
  baseURL?: string;
  timeout?: number;
  proxy?: AxiosProxyConfig | false;
  httpsAgent?: boolean;
  privateKey?: Buffer;
  privateKeyPassphrase?: string;
  privateKeyAlgo?: 'RSA' | 'ED25519';
}

export class BnAPI extends Spot implements BnWallet {
  constructor(apiKey?: string, apiSecret?: string, options?: SpotOptions) {
    super(apiKey, apiSecret, options);
  }
  getWalletBalances(): Promise<
    {
      activate: boolean;
      balance: string;
      walletName: string;
    }[]
  > {
    return this.makeRequest(
      'GET',
      this.prepareSignedPath('/sapi/v1/asset/wallet/balance'),
    );
  }
}
