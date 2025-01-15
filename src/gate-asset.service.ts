import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvOptionName } from './core/enum/config-variable-name';
import { GateRestClient } from './core/connectors/gate/client/rest-client';

@Injectable()
export class GateAssetService {
  private apiKey: string;
  private apiSecret: string;
  private client: GateRestClient;
  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get(EnvOptionName.GATE_API_KEY);
    this.apiSecret = this.configService.get(EnvOptionName.GATE_API_SECRET);
    this.client = new GateRestClient(
      {
        apiKey: this.apiKey,
        apiSecret: this.apiSecret,
      },
      this.configService.get(EnvOptionName.GATE_API_ENDPOINT_BASE),
    );
  }

  async getTotalBalance() {
    const total = await this.client.getAllAccountBalance();

    return total.total.amount;
  }
}
