import { IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { DateValidationDTO } from "src/common/dto/date-validation-dto";
import { MealType } from "src/meal-logging/enum/meal-type.enum";

export class RemomeMealLoggingIdDTO{
   
    @IsNotEmpty()
    @IsDateString()
    readonly date: string;

    @IsNotEmpty()
    @IsString()
    readonly mealLoggingId: string;

    @IsNotEmpty()
    @IsEnum(MealType)
    readonly mealType: MealType

}