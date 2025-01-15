import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BigNumber from 'bignumber.js';

import { EnvOptionName } from './core/enum/config-variable-name';
import { BitgetRestClient } from './core/connectors/bitget/client/rest-client';
import { ClientBaseService } from './client-base.service';

@Injectable()
export class BitgetAssetService extends ClientBaseService<BitgetRestClient> {
  constructor(protected configService: ConfigService) {
    super(configService, EnvOptionName.bitget, BitgetRestClient);
  }

  protected getCreationParams(): ConstructorParameters<
    typeof BitgetRestClient
  > {
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
    const multipleBalances = await Promise.all(
      clients.map(client => client.getAllAccountBalance()),
    );

    return multipleBalances.reduce(
      (acc: BigNumber, curr) =>
        acc.plus(
          curr.reduce(
            (acc, value) => acc.plus(value.usdtBalance),
            BigNumber(0),
          ),
        ),
      BigNumber(0),
    );
  }
}
