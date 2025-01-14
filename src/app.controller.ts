import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GateAssetService } from './gate-asset.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gateAssetService: GateAssetService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('assets')
  getAssets() {
    return this.appService.listAssets();
  }

  @Get('balance/gate')
  async getGateTotalBalance() {
    const total = await this.gateAssetService.getTotalBalance();

    return `${total.total.amount.split('.')[0]} ${total.total.currency}`;
  }
}
