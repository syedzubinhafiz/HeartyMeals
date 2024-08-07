import { MeasuringUnit } from "src/library/recipe/component/measuring-unit.enum";
import { UserService } from "src/user/user.service";

export class CommonService{

    convertUnits(originalUnit: MeasuringUnit, originalAmount: number, newUnit: MeasuringUnit, newAmount: number): number{

        return 0
    }

    /***
     * Method to check if id is admin
     */
    isAdmin(userId){
        // uses role to check
        // get userId first
    }
}