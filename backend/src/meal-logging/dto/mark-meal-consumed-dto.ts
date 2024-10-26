import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MarkMealConsumedDTO {
  /**
   * @example 2024-10-26:12:00
   */
  @IsDateString()
  @IsNotEmpty()
  readonly dateTime: string;

  /**
   * @example "Asia/Kuala_Lumpur"
   */
  @IsString()
  @IsNotEmpty()
  readonly timeZone: string;

  @IsString()
  @IsNotEmpty()
  readonly mealLoggingId: string;
}
