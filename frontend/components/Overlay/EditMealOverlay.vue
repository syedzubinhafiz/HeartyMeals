<template>
    <div v-if="visible" class="container">
        <div class="edit-meal-header">
            <h2>Edit Meal</h2>
        </div>

        <div class="body">
            <div class="meal-time-container">
                <span class="meal-time-label">Meal Time:</span>
                <SingleSelectionDropdown
                    :items="meal_time_dropdown_options"
                    @item-selected="selectedMealTime.value = $event"
                    v-model="selectedMealTime"
                    defaultText="Select Meal Time"
                    button-style="width:90%; height: 10%;" 
                    dropdown-style="margin-right: 10%; width: 90%; height: 150px; overflow-y: auto;"
                />
            </div>

            <div class="meal-portion-container">
                <span class="meal-portion-label">Portion:</span>
                <input type="number" v-model="portion" class="meal-portion-input" placeholder="Enter Portion" min="0.5" step="0.5" />
            </div>

            <div class="button-container">
                <div class="save-button" @click="saveChanges"> Save</div>
                <div class="cancel-button" @click="confirmCancel"> Cancel</div>
            </div>
        </div>
    </div>

    <div v-if="visible" class="overlay-bg" @click="confirmCancel"></div>
</template>

<script>
import { ref, watch, nextTick } from 'vue';
import SingleSelectionDropdown from '../Dropdown/SingleSelectionDropdown.vue';

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        mealInfo: {
            type: Object,
            required: true
        },
    },
    components: {
        SingleSelectionDropdown
    },
    setup(props, { emit }) {
        const meal_time_dropdown_options = ref([
            { id: 'Breakfast', display: 'Breakfast' },
            { id: 'Lunch', display: 'Lunch' },
            { id: 'Dinner', display: 'Dinner' },
            { id: 'Other', display: 'Other' },
        ]);
        const selectedMealTime = ref(null);
        const portion = ref(null);
        const originalMealTime = ref(null);
        const originalPortion = ref(null);

        const resetValues = () => {
            selectedMealTime.value = null;
            portion.value = null;
            originalMealTime.value = null;
            originalPortion.value = null;
        };

        watch(() => props.visible, (newVal) => {
            if (!newVal) {
                resetValues();
            } else {
                nextTick(() => {
                    selectedMealTime.value = props.mealInfo.type;
                    portion.value = props.mealInfo.portion;
                    originalMealTime.value = props.mealInfo.type;
                    originalPortion.value = props.mealInfo.portion;
                });
            }

            console.log('Visible:', newVal);
            console.log('Meal Info:');
            console.log(props.mealInfo);
            console.log('Selected Meal Time:');
            console.log(selectedMealTime.value);

        });

        const closeOverlay = () => {
            resetValues();
            emit('update:visible', false);
        };

        const confirmCancel = () => {
            if (selectedMealTime.value !== originalMealTime.value || portion.value !== originalPortion.value) {
                if (confirm('You have unsaved changes. Do you really want to cancel?')) {
                    closeOverlay();
                }
            } else {
                closeOverlay();
            }
        };

        const saveChanges = () => {
            // Implement save logic here
            
            emit('editLogMeal', {
                portion: portion.value,
                mealType: selectedMealTime.value,
                mealInfo: props.mealInfo
            } );
        };

        return {
            meal_time_dropdown_options,
            selectedMealTime,
            portion,
            closeOverlay,
            confirmCancel,
            saveChanges
        };
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;500;600;700&display=swap');
* {
    font-family: 'Overpass', sans-serif;
}

.container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 40%;
    width: 30%;
    background-color: #FEFEF1;
    border-radius: 10px;
    z-index: 101;
}

.overlay-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 100;
}

.edit-meal-header {
    position: absolute;
    top: 6%;
    left: 42%;
    margin-bottom: 15%;
    font-size: 1.5rem;
    font-weight: bold;
}

.body {
    margin-top: 20%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.meal-time-container {
    display: flex;
    flex-direction: row;
    width: 80%;
    justify-content: center;
    margin-bottom: 5%;
}

.meal-time-container span {
    margin-right: 10px;
    font-size: 1rem;
    text-align: center;
    width: 80%;
}

.meal-portion-container {
    display: flex;
    flex-direction: row;
    width: 80%;
    justify-content: center;
    margin-bottom: 5%;
}

.meal-portion-container span {
    font-size: 1rem;
    text-align: center;
    width: 95%;
}

.meal-portion-input {
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-left: 10%;
    margin-right: 5%;
    width: 120%;
    text-align: center;
}

.button-container {
    display: flex;
    flex-direction: row;
    width: 80%;
    justify-content: space-around;
    margin-top: 5%;
    font-size: 1.2rem;
    font-weight: 600;
}

.save-button {
    background-color: #87A98D;
    color: white;
    padding: 2% 4%;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.save-button:hover {
    background-color: #6C8C6A;
}

.cancel-button {
    background-color: #b84040;
    color: white;
    padding: 2% 4%;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cancel-button:hover {
    background-color: #8C2D2D;
}
</style>
