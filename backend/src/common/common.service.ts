import { MeasuringUnit } from "src/library/recipe/component/measuring-unit.enum";

export class CommonService{

    convertUnits(originalUnit: MeasuringUnit, originalAmount: number, newUnit: MeasuringUnit, newAmount: number): number{

        return 0
    }

    /**
     * Method to validate path
     * @param userId - user id
     * @param recipeId - recipe id
     * @param eduId - educational content id
     * @param files - files
     * @returns True if path exists, false if path does not exist
     */
    pathValidation(userId, recipeId, eduId){
        // check if all ids are null (no specific path)
        // check if both userId and educationalId is not null (either one must be null else will have path conflict)
        // last check if the file is empty or no file is uploaded

        if (userId == null && recipeId == null && eduId == null){
            // no specific path to save the files, return no specific id error
            return false;
        }

        if (userId != null || recipeId != null){
            // save to user 
            if (eduId != null){
                // conflict
                // educational id and recipe id are not null
                // multiple path detected
                // returns multiple path detected, please select a proper path
                return false;
            }
            else {
                return true;
            }
        }

        // input is clean
        // means either saves as user profile picture photo
        // or saves as user custom recipe photos/videos
        // or saves as official recipe photos/videos
        // or educational content photos/videos
    }
}