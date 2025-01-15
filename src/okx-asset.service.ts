import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvOptionName } from './core/enum/config-variable-name';
import { OkxRestClient } from './core/connectors/okx/client/rest-client';

@Injectable()
export class OkxAssetService {
  private apiKey: string;
  private apiSecret: string;
  private apiPassPhrase: string;
  private client: OkxRestClient;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get(EnvOptionName.OKX_API_KEY);
    this.apiSecret = this.configService.get(EnvOptionName.OKX_API_SECRET);
    this.apiPassPhrase = this.configService.get(
      EnvOptionName.OKX_API_PASSPHRASE,
    );
    this.client = new OkxRestClient(
      {
        apiKey: this.apiKey,
        apiSecret: this.apiSecret,
        apiPassPhrase: this.apiPassPhrase,
      },
      this.configService.get(EnvOptionName.OKX_API_ENDPOINT_BASE),
    );
  }

  async getTotalBalance() {
    // const assetBalancesPromise = this.client.getAssetBalances();
    // const pricesPromise = this.client.marketTickers({ instType: 'SPOT' });
    // const accountBalancesPromise = this.client.getAccountBalances();
    const assertValuationPromise = this.client.getAssetValuation({
      ccy: 'USDT',
    });

    // const [assetValuation, prices, assetBalances, accountBalances] =
    //   await Promise.all([
    //     assertValuationPromise,
    //     pricesPromise,
    //     assetBalancesPromise,
    //     accountBalancesPromise,
    //   ]);
    // const assetValue = assetBalances
    //   .map(asset =>
    //     BigNumber(asset.bal).multipliedBy(
    //       prices.tickersMap[`${asset.ccy}-USDT`]?.last || 0,
    //     ),
    //   )
    //   .reduce((acc, value) => acc.plus(value), BigNumber(0));

    // return { assetValuation, accountBalance: accountBalances[0], assetValue };

    return (await assertValuationPromise)[0].totalBal;
  }
}
