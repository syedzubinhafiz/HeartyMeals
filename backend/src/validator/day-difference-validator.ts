import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import { differenceInDays } from "date-fns";

export function IsDaysDifference(days: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isDaysDifference',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const { startDate, endDate } = args.object as any;
                    if (!startDate || !endDate) {
                        return false;
                    }
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    return differenceInDays(end, start) === days;
                },
                defaultMessage(args: ValidationArguments) {
                    return `The difference between startDate and endDate must be exactly ${days} days`;
                },
            },
        });
    };
}