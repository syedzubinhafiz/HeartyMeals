import { IsDateString, IsNotEmpty } from 'class-validator';
import { IsDaysDifference } from '../../validator/day-difference-validator';

export class GetWeeklyAnalyticsDTO {
    @IsNotEmpty()
    @IsDateString()
    readonly startDate: string;

    @IsNotEmpty()
    @IsDateString()
    @IsDaysDifference(6, { message: 'The difference between startDate and endDate must be exactly 7 days' })
    readonly endDate: string;
}

export class GetMonthlyAnalyticsDTO {
    @IsNotEmpty()
    @IsDateString()
    readonly startDate: string;

    @IsNotEmpty()
    @IsDateString()
    @IsDaysDifference(29, { message: 'The difference between startDate and endDate must be exactly 30 days' })
    readonly endDate: string;
}

export class getDailyAnalyticsDTO {
    @IsNotEmpty()
    @IsDateString()
    readonly date: string;
}