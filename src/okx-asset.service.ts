import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvOptionName } from './core/enum/config-variable-name';
import { OkxRestClient } from './core/connectors/okx/client/rest-client';
import { ClientBaseService } from './client-base.service';
import { KeyPair } from './config/configuration';
import BigNumber from 'bignumber.js';

@Injectable()
export class OkxAssetService extends ClientBaseService<OkxRestClient> {
  constructor(protected configService: ConfigService) {
    super(configService, EnvOptionName.okx, OkxRestClient);
  }

  protected getCreationParams(
    pair: KeyPair,
  ): ConstructorParameters<typeof OkxRestClient> {
    return [
      {
        apiKey: pair.api_key,
        apiSecret: pair.api_secret,
        apiPassPhrase: pair.api_passphrase,
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

    return assetValuations.map((assetValuation, i) => ({
      name: this.config.key_pairs[i].name,
      uid: this.config.key_pairs[i].uid,
      balance: BigNumber(assetValuation[0]?.totalBal || 0),
      wallets: Object.entries(assetValuation[0]?.details || {}).map(
        ([accountName, balance]) => ({
          account: accountName,
          balance,
        }),
      ),
    }));
  }
}

// 博弈论 meta数据 场外大资金买盘卖盘 泄零点
// （localbit）
// 进出场时间 meta进，择时卖

// DCA建仓

// 找反身性最小的数据进行meta分析，找到泄零点 《=》博弈论
// ceita衰减值不能到权利金1 / 3
// 币圈波动率和价格低点合一

// 卖put 买call

// 超我 自我 本我
// 信仰 兴趣 利益
// popmart：手下的人经常建议玩偶加u盘，把兴趣爱好变成有用的东西，自我到本我
