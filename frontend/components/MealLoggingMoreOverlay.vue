<template>
    <div v-if="visible" class="container">
        <div class="nutrient-container">
            <div class="nutrient">
                <img src="@/assets/icon/calories-icon.svg" alt="">
                <span class="ml-2">{{(dishInfo.recipe.nutrition_info.calories * (dishInfo.portion/dishInfo.recipe.serving_size)).toFixed(1)}} cal</span>
            </div>
            <div class="nutrient">
                <img src="@/assets/icon/carbs-icon.svg" alt="">
                <span class="ml-2">{{(dishInfo.recipe.nutrition_info.totalCarbohydrate * (dishInfo.portion/dishInfo.recipe.serving_size)).toFixed(1)}} g</span>
            </div>
            <div class="nutrient">
                <img src="@/assets/icon/protein-icon.svg" alt="">
                <span class="ml-2">{{(dishInfo.recipe.nutrition_info.protein * (dishInfo.portion/dishInfo.recipe.serving_size)).toFixed(1)}} g</span>
            </div>
            <div class="nutrient">
                <img src="@/assets/icon/fat-icon.svg" alt="">
                <span class="ml-2">{{(dishInfo.recipe.nutrition_info.fat * (dishInfo.portion/dishInfo.recipe.serving_size)).toFixed(1)}} g</span>
            </div>
            <div class="nutrient">
                <img src="@/assets/icon/sodium-icon.svg" alt="">
                <span class="ml-2">{{(dishInfo.recipe.nutrition_info.sodium * (dishInfo.portion/dishInfo.recipe.serving_size)).toFixed(1)}} mg</span>
            </div>
            <div class="nutrient">
                <img src="@/assets/icon/cholesterol-icon.svg" alt="">
                <span class="ml-2">{{(dishInfo.recipe.nutrition_info.cholesterol * (dishInfo.portion/dishInfo.recipe.serving_size)).toFixed(1)}} mg</span>
            </div>
        </div>

        <div class="edit-button-container">
            <div :class="['remove-button', { 'disabled': !isToday(dishInfo.consumed_date_time) }]" @click="removeMeal(dishInfo)">
                Remove
            </div>
            <div :class="['edit-button', {'disabled': !isToday(dishInfo.consumed_date_time)}]" @click="EditMealPopUp(dishInfo)">
                Edit
            </div>
        </div>

        <div :class="['consume-button', { 'consumed': !canFoodBeConsumed()}]" @click="consumeMeal" :disabled="dishInfo.is_consumed">
            {{ dishInfo.is_consumed ? "Consumed" : "Consume Now" }}
        </div>
    </div>
</template>

<script>
import { isSameDay, isToday, isWithinInterval, subDays } from 'date-fns';

export default {
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        dishInfo: {
            type: Object,
            required: true
        },
        mealLogTime: {
            type: Date,
            required: true
        }
    },
    methods: {
        consumeMeal() {
            if (!this.dishInfo.is_consumed) {
                this.$emit('consume', this.dishInfo.id);
            }
        },
        isToday() {
            const today = new Date();
            return isSameDay(this.mealLogTime, today);
        },
        withinAWeek() {
            const today = new Date();
            const weekAgo = subDays(today, 7);
            return isWithinInterval(this.mealLogTime, { start: weekAgo, end: today });
        },
        canFoodBeConsumed() {
            console.log(this.dishInfo);
            console.log(this.isToday());
            if (!this.dishInfo.is_consumed) {
                if (this.isToday()) {
                    return true;
                }
            } 
            return false;
    },
        hidePopup() {
            this.$emit('update:visible', !this.visible);
        },
        removeMeal(dishInfo) {
            console.log(dishInfo);
            this.$emit('remove', dishInfo);
        },
        EditMealPopUp(dishInfo) {
            this.$emit('edit', dishInfo);
            console.log(dishInfo);
        }
    },


}
</script>

<style scoped>
.container {
    height: 220%;
    width: 50%;
    background-color: #FEFEF1;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.nutrient-container {
    width: 100%;
    column-gap: 2.5%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 5%;
    row-gap: 5%;
}

.nutrient {
    width: 100%;
    display: flex;
    align-items: center;
    margin-left: 8%;
    font-size: 0.8rem;
}

.edit-button-container {
    width: 80%;
    display: flex;
    justify-content: space-between;
    padding: 5%;
}

.edit-button,
.remove-button {
    background-color: rosybrown;
    color: white;
    padding: 7% 6%;
    display: flex;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    align-items: center;
    justify-self: center;
    border-radius: 8px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.edit-button.disabled,
.remove-button.disabled {
    background-color: #d3d3d3;
    cursor: not-allowed;
    pointer-events: none;
}

.consume-button {
    background-color: #87A98D;
    width: 80%;
    padding: 5% 5%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
}

.consume-button.consumed {
    background-color: #d3d3d3;
    cursor: not-allowed;
    pointer-events: none;
}
</style>
