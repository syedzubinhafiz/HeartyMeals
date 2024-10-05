<template>
    <div v-if="visible" class="container">
        <img src="@/assets/icon/remove-icon.svg" alt="">
        <span class="header">Are you sure you ?</span>
        <span class="confirmation-msg">Once removed, you cannot undo this action.</span>
        <div class="button-container">
            <div class="remove-button"> Remove</div>
            <div class="cancel-button"> Cancel</div>
        </div>
    </div>

    <div v-if="visible" class="overlay-bg"></div>
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
            required: true
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

*{
    font-family: 'Overpass', sans-serif;
}

.overlay-bg{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 100;
}

.container{
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fefef1;
    width: 30%;
    height: 40%;
    z-index: 101;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.3rem;

}

.container img{
    padding-bottom: 5%;
}

.header{
    font-size: 2rem;
    padding-bottom: 2.5%;
    font-weight: 700;

}

.button-container{
    padding-top: 5%;
    display: flex;
    justify-content: space-between;
    width: 40%;
}


.remove-button{
    background-color: #b84040;
    color: white;
    font-weight: bold;
    padding: 2% 5%;
    border-radius: 5px;
    cursor: pointer;
}

.cancel-button{
    background-color: #87A98D;
    color: white;
    font-weight: bold;
    padding: 2% 5%;
    border-radius: 5px;
    cursor: pointer;
}
</style>