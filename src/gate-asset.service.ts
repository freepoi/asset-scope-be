import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvOptionName } from './core/enum/config-variable-name';
import { GateRestClient } from './core/connectors/gate/client/rest-client';
import { ClientBaseService } from './client-base.service';
import { KeyPair } from './config/configuration';
import BigNumber from 'bignumber.js';

@Injectable()
export class GateAssetService extends ClientBaseService<GateRestClient> {
  constructor(protected configService: ConfigService) {
    super(configService, EnvOptionName.gate, GateRestClient);
  }

  protected getCreationParams(
    pair: KeyPair,
  ): ConstructorParameters<typeof GateRestClient> {
    return [
      { apiKey: pair.api_key, apiSecret: pair.api_secret },
      this.config.api_endpoint_base,
    ];
  }

  async getTotalBalance(key?: string) {
    const clients = this.getClients(key);
    const multipleWalletBalances = await Promise.all(
      clients.map(client => client.getAllAccountBalance()),
    );

    multipleWalletBalances.forEach((wallet, i) =>
      console.log(`gate ${this.config.key_pairs[i].name}`, wallet),
    );

    return multipleWalletBalances.map((wallet, i) => ({
      name: this.config.key_pairs[i].name,
      uid: this.config.key_pairs[i].uid,
      balance: BigNumber(wallet.total.amount),
      wallets: Object.entries(wallet.details).map(([accountName, account]) => ({
        name: accountName,
        ...account,
      })),
    }));
  }
}
