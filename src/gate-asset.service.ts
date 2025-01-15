import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvOptionName } from './core/enum/config-variable-name';
import { GateRestClient } from './core/connectors/gate/client/rest-client';
import { ClientBaseService } from './client-base.service';
import BigNumber from 'bignumber.js';

@Injectable()
export class GateAssetService extends ClientBaseService<GateRestClient> {
  constructor(protected configService: ConfigService) {
    super(configService, EnvOptionName.gate, GateRestClient);
  }

  protected getCreationParams(): ConstructorParameters<typeof GateRestClient> {
    return [
      {
        apiKey: this.config.key_pairs[0].api_key,
        apiSecret: this.config.key_pairs[0].api_secret,
      },
      this.config.api_endpoint_base,
    ];
  }

  async getTotalBalance(key?: string) {
    const clients = this.getClients(key);
    const multipleBalances = await Promise.all(
      clients.map(client => client.getAllAccountBalance()),
    );

    return multipleBalances.reduce(
      (acc, curr) => acc.plus(curr.total.amount),
      BigNumber(0),
    );
  }
}
