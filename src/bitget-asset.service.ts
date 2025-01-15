import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvOptionName } from './core/enum/config-variable-name';
import { BitgetRestClient } from './core/connectors/bitget/client/rest-client';
import BigNumber from 'bignumber.js';

@Injectable()
export class BitgetAssetService {
  private apiKey: string;
  private apiSecret: string;
  private apiPassPhrase: string;
  private client: BitgetRestClient;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get(EnvOptionName.BITGET_API_KEY);
    this.apiSecret = this.configService.get(EnvOptionName.BITGET_API_SECRET);
    this.apiPassPhrase = this.configService.get(
      EnvOptionName.BITGET_API_PASSPHRASE,
    );
    this.client = new BitgetRestClient(
      {
        apiKey: this.apiKey,
        apiSecret: this.apiSecret,
        apiPassPhrase: this.apiPassPhrase,
      },
      this.configService.get(EnvOptionName.BITGET_API_ENDPOINT_BASE),
    );
  }

  async getTotalBalance() {
    const total = await this.client.getAllAccountBalance();

    return total.reduce(
      (acc, value) => acc.plus(value.usdtBalance),
      BigNumber(0),
    );
  }
}
