import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MealLoggingListDTO {
  @IsString()
  @IsNotEmpty()
  readonly recipeId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly portion: number;
}
