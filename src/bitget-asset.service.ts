import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BigNumber from 'bignumber.js';

import { EnvOptionName } from './core/enum/config-variable-name';
import { BitgetRestClient } from './core/connectors/bitget/client/rest-client';
import { ClientBaseService } from './client-base.service';
import { KeyPair } from './config/configuration';

@Injectable()
export class BitgetAssetService extends ClientBaseService<BitgetRestClient> {
  constructor(protected configService: ConfigService) {
    super(configService, EnvOptionName.bitget, BitgetRestClient);
  }

  protected getCreationParams(
    pair: KeyPair,
  ): ConstructorParameters<typeof BitgetRestClient> {
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
    const multipleBalances = await Promise.all(
      clients.map(client => client.getAllAccountBalance()),
    );

    return multipleBalances.map((balances, i) => ({
      name: this.config.key_pairs[i].name,
      uid: this.config.key_pairs[i].uid,
      balance: balances.reduce(
        (acc, value) => acc.plus(value.usdtBalance),
        BigNumber(0),
      ),
      wallets: balances.map(account => ({
        name: account.accountType,
        balance: account.usdtBalance,
      })),
    }));
  }

  async getSpotAssets() {
    const accounts = await Promise.all(
      this.getClients().map(client => client.getSpotAccountAssets()),
    );

    return accounts;
  }

  async getEarnAssets() {
    const accounts = await Promise.all(
      this.getClients().map(client => client.getEarnAccountAssets()),
    );

    return accounts;
  }
}
