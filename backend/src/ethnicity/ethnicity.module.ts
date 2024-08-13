import { Module } from '@nestjs/common';
import { EthnicityController } from './ethnicity.controller';
import { EthnicityService } from './ethnicity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ethnicity } from './ethnicity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ethnicity])],
  controllers: [EthnicityController],
  providers: [EthnicityService]
})
export class EthnicityModule {}
