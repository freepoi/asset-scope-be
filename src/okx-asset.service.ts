import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BigNumber from 'bignumber.js';

import { EnvOptionName } from './core/enum/config-variable-name';
import { OkxRestClient } from './core/connectors/okx/client/rest-client';
import { ClientBaseService } from './client-base.service';

@Injectable()
export class OkxAssetService extends ClientBaseService<OkxRestClient> {
  constructor(protected configService: ConfigService) {
    super(configService, EnvOptionName.okx, OkxRestClient);
  }

  protected getCreationParams(): ConstructorParameters<typeof OkxRestClient> {
    return [
      {
        apiKey: this.config.key_pairs[0].api_key,
        apiSecret: this.config.key_pairs[0].api_secret,
        apiPassPhrase: this.config.key_pairs[0].api_passphrase,
      },
      this.config.api_endpoint_base,
    ];
  }

  async getTotalBalance(key?: string) {
    const clients = this.getClients(key);
    const assetValuations = await Promise.all(
      clients.map(client =>
        client.getAssetValuation({
          ccy: 'USDT',
        }),
      ),
    );
    // const assetBalancesPromise = this.client.getAssetBalances();
    // const pricesPromise = this.client.marketTickers({ instType: 'SPOT' });
    // const accountBalancesPromise = this.client.getAccountBalances();

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

    return assetValuations.reduce((acc: BigNumber, curr) => {
      return acc.plus(curr[0].totalBal);
    }, BigNumber(0));
  }
}
