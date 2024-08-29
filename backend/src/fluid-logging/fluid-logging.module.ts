import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FluidLogging } from './fluid-logging.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FluidLogging])],
    controllers: [],
    exports: []
})
export class FluidLoggingModule {}
