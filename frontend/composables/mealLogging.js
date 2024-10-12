export const useMealLogging = () => {
    const unsavedMealList = useState("mealList", () => useCookie("mealList"));
    const mealDate = useState("mealDate", () => useCookie("mealDate"));
    return {unsavedMealList, mealDate}
}