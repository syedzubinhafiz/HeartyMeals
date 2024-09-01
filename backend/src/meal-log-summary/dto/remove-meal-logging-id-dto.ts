import { IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { DateValidationDTO } from "src/common/dto/date-validation-dto";
import { MealType } from "src/meal-logging/enum/meal-type.enum";

export class RemomeMealLoggingIdDTO{
   
    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsString()
    mealLoggingId: string;

    @IsNotEmpty()
    @IsEnum(MealType)
    mealType: MealType

}