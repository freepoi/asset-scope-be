import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { GateAssetService } from './gate-asset.service';
import { BinanceAssetService } from './binance-asset.service';
import { OkxAssetService } from './okx-asset.service';
import { BitgetAssetService } from './bitget-asset.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
