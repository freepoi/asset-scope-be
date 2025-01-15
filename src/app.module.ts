import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { GateAssetService } from './gate-asset.service';
import { BinanceAssetService } from './binance-asset.service';
import { OkxAssetService } from './okx-asset.service';
import { BitgetAssetService } from './bitget-asset.service';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [
    GateAssetService,
    BinanceAssetService,
    OkxAssetService,
    BitgetAssetService,
  ],
})
export class AppModule {}
