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

  doStuff(num1: number, num2: number, str1: string, str2: string): any {
    return {sumStr:str1+str2,sumNum:num1+num2}
  }

  getSquare(num: number): string {
    return  `square of ${num} = ${num*num}`;
  }
}
