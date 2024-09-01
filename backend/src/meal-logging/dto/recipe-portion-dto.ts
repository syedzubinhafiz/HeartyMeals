import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RecipePortionDTO {
  @IsString()
  @IsNotEmpty()
  readonly recipeId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly portion: number;
}
