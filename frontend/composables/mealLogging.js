export const useMealLogging = () => {
    const unsavedMealList = useState("mealList", () => useCookie("mealList"));
    return {unsavedMealList}
}