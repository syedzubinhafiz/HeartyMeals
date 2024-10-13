
export const useDate = () => {
    const getCurrentDate = (adjusted=false) => {
        let currentDate = new Date()
        if(adjusted) {
            currentDate.setTime(currentDate.getTime()+8*60*60*1000)
        }
        return currentDate
    }
    const getFormattedDateLong = (date=null,adjusted=false) => {
        if(date==null) {
            return getCurrentDate(adjusted).toISOString()
        }
        else {
            return getCurrentDate(date, adjusted).toISOString()
        }
    }
    const getFormattedDateShort = (date=null,adjusted=false) => {
        if(date==null) {
            return getFormattedDateLong(adjusted).split('T')[0]
        }
        else {
            return getFormattedDateLong(date, adjusted).split('T')[0]
        }
        
    }
    return {getCurrentDate, getFormattedDateLong, getFormattedDateShort}
}
