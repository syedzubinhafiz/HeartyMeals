import { Controller, Get, Post, Param, Req, Query } from '@nestjs/common';
import { ExampleService } from '../services/examples';
import { ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
@ApiTags('examples')
@Controller('examples')
export class ExampleController {
  constructor(private readonly appService: ExampleService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('goodbye')
  getGoodbye(): string {
    return this.appService.getGoodbye();
  }

  @Get('sum')
  getSum(@Query() query: any): number {
    return this.appService.getSum(Number(query.a), Number(query.b));
  }

  @Get(':num')
  getSquare(@Param('num') num: number): string {
    return this.appService.getSquare(num);
  }
}
