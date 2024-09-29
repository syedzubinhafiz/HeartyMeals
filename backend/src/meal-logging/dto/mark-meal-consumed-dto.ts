import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MarkMealConsumedDTO {
  @IsDateString()
  @IsNotEmpty()
  readonly dateTime: string;

  @IsString()
  @IsNotEmpty()
  readonly timeZone: string;

  @IsString()
  @IsNotEmpty()
  readonly mealLoggingId: string;
}
