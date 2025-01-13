import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { FundingAsset } from './core/dto/bitget/funding-asset';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('assets')
  getAssets(): Promise<FundingAsset[]> {
    return this.appService.listAssets();
  }
}
