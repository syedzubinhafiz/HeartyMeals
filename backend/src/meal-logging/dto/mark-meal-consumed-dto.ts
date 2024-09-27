import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MarkMealConsumedDTO {
  @IsString()
  @IsNotEmpty()
  readonly mealLoggingId: string;

  @IsDateString()
  @IsNotEmpty()
  readonly dateTime: string;

  @IsString()
  @IsNotEmpty()
  readonly timeZone: string;
}
