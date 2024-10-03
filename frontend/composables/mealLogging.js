export const useMealLogging = () => {
    const unsavedMealList = useState("mealList", () => useCookie("mealList"));
    const mealType = useState("mealType", () => useCookie("mealType"));
    return {unsavedMealList,mealType}
}