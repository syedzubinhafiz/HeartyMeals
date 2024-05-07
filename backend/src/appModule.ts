import { Module } from '@nestjs/common';
import { ExampleController } from './controllers/examples';
import { ExampleService } from './services/examples';

@Module({
  imports: [],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class AppModule {}
