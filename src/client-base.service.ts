import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvOptionName } from './core/enum/config-variable-name';
import { ExchangeConfig, KeyPair } from './config/configuration';

type KeyPairKeyString = string;

@Injectable()
export abstract class ClientBaseService<Client> {
  protected config: ExchangeConfig;
  protected clients: Client[] = [];
  protected clientsMap: Record<KeyPairKeyString, Client> = {};

  constructor(
    protected configService: ConfigService,
    clientName: EnvOptionName,
    clientClass: new (...args: any[]) => Client,
  ) {
    this.config = this.configService.get<ExchangeConfig>(clientName);
    if (
      !this.config ||
      !this.config.key_pairs ||
      !this.config.key_pairs.length
    ) {
      console.log(`No key pairs found for ${clientName}`);

      return;
    }

    this.clients = this.config.key_pairs.map(
      pair => new clientClass(...this.getCreationParams(pair)),
    );
    this.clientsMap = this.clients.reduce(
      (acc: Record<KeyPairKeyString, Client>, client, i) => {
        acc[this.config.key_pairs[i].api_key] = client;

        return acc;
      },
      {},
    );
  }

  protected abstract getCreationParams(pair: KeyPair): any[];

  protected getClients(key?: string): Client[] {
    return key
      ? this.clientsMap[key]
        ? [this.clientsMap[key]]
        : []
      : this.clients;
  }
}
