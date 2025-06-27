export const useDate = () => {
    const getCurrentDate = (adjusted=false) => {
        let currentDate = new Date()
        if(adjusted) {
            currentDate.setTime(currentDate.getTime()+8*60*60*1000)
        }
        return currentDate
    }
    const getFormattedDateLong = (date=null, adjusted=false) => {
        let targetDate;
        if(date==null) {
            targetDate = getCurrentDate(adjusted);
        } else {
            targetDate = new Date(date);
            if(adjusted){
                targetDate.setTime(targetDate.getTime()+8*60*60*1000);
            }
        }
        return targetDate.toISOString();
    }
    const getFormattedDateShort = (date=null, adjusted=false) => {
        let targetDate;
        if(date==null) {
            targetDate = getCurrentDate(adjusted);
        } else {
            targetDate = new Date(date);
            if(adjusted){
                targetDate.setTime(targetDate.getTime()+8*60*60*1000);
            }
        }
        // format YYYY-MM-DD in local timezone (no UTC shift)
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth()+1).padStart(2,'0');
        const day = String(targetDate.getDate()).padStart(2,'0');
        return `${year}-${month}-${day}`;
    }
    return {getCurrentDate, getFormattedDateLong, getFormattedDateShort}
}
