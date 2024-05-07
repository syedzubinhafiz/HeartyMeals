import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleService {
  getHello(): string {
    return 'Hello World!';
  }

  getGoodbye(): string {
    return 'Goodbye World!';
  }

  getSum(a: number, b: number): number {
    return a + b
  }

  getSquare(num: number): string {
    return  `square of ${num} = ${num*num}`;
  }
}
