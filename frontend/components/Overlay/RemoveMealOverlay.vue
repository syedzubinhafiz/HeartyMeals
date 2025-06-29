<template>
    <div v-if="visible" class="overlay-bg" @click="close">
        <div class="container" @click.stop>
            <div class="icon-container">
                <img src="@/assets/icon/remove-icon.svg" alt="Remove" class="remove-icon">
            </div>
            
            <div class="content">
                <h2 class="header">Are you sure you want to remove this meal?</h2>
                <p class="confirmation-msg">Once removed, you cannot undo this action.</p>
            </div>
            
            <div class="button-container">
                <button class="cancel-button" @click="close">Cancel</button>
                <button class="remove-button" @click="removeMeal">Remove</button>
            </div>
        </div>
    </div>
</template>

<script >

export default {
    props: {
        visible:{
            type: Boolean,
            default: false
        },
        mealInfo: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        removeMeal(){
            
            this.$emit('removeLogMeal', this.mealInfo);
        },
        close(){
            this.$emit('close');
        }
    }
}
    
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:wght@400;500;600;700&display=swap');

* {
    font-family: 'Overpass', sans-serif;
}

.overlay-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
}

.container {
    background: linear-gradient(135deg, #ffffff 0%, #fefef9 100%);
    width: min(400px, 90vw);
    max-width: 400px;
    border-radius: 20px;
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 24px;
    position: relative;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.icon-container {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.remove-icon {
    width: 32px;
    height: 32px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.content {
    text-align: center;
    margin-bottom: 32px;
    max-width: 320px;
}

.header {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 12px 0;
    line-height: 1.3;
    letter-spacing: -0.025em;
}

.confirmation-msg {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
    font-weight: 400;
}

.button-container {
    display: flex;
    gap: 12px;
    width: 100%;
    max-width: 280px;
}

.cancel-button,
.remove-button {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    outline: none;
    text-transform: none;
}

.cancel-button {
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    color: #374151;
    border: 1px solid #d1d5db;
}

.cancel-button:hover {
    background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cancel-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.remove-button {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.remove-button:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

.remove-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

/* Mobile responsiveness */
@media (max-width: 480px) {
    .container {
        padding: 24px 20px;
        margin: 20px;
    }
    
    .header {
        font-size: 1.25rem;
    }
    
    .confirmation-msg {
        font-size: 0.9rem;
    }
    
    .button-container {
        flex-direction: column;
        gap: 8px;
    }
    
    .cancel-button,
    .remove-button {
        width: 100%;
    }
}
</style>