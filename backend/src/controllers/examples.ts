import { Controller, Get, Post, Param, Req, Query, Body } from '@nestjs/common';
import { ExampleService } from '../services/examples';
import { ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';

class SwaggerBodyExample {
  @ApiProperty({
    type: Number,
  })
  num1: number;
  @ApiProperty({
    type: Number,
  })
  num2: number;
  @ApiProperty({
    type: String,
  })
  str1: string;
  @ApiProperty({
    type: String,
  })
  str2: string;
}
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

  @Post('sum')
  @ApiQuery({ name: 'a', type: Number })
  @ApiQuery({ name: 'b', type: Number }) 
  getSum(@Query() query: any): number {
    return this.appService.getSum(Number(query.a), Number(query.b));
  }

  @Post('doStuff')
  doStuff(@Body() body: SwaggerBodyExample) {
    return this.appService.doStuff(body.num1,body.num2,body.str1,body.str2)
  }

  @Post('square/:num')
  getSquare(@Param('num') num: number): string {
    return this.appService.getSquare(num);
  }
}
