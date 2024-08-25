import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class MealLoggingListDTO {
  @IsString()
  @IsNotEmpty()
  readonly recipeId: string;

  @IsInt()
  @IsNotEmpty()
  readonly portion: number;
}
