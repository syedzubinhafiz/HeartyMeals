<template>
<div class="meal-card-wrapper">
  <div class="p-6 rounded-lg w-72 h-200 flex-shrink-0 flex flex-col items-center justify-between transition-all duration-300">
    <div class="relative w-full">
    <img :src="cardInfo.image" alt="Meal Image" class="absolute w-20 h-20 object-cover rounded-full mb-4 z-10 left-1/2 absolute transform -translate-x-1/2 -top-1" />
            <div class="bg-custom-bg-lightgreen p-6 rounded-lg w-full flex flex-col items-center justify-center text-center shadow-md mt-12 pt-16"
            :style="cardStyle"
            @mouseover="grow"
            @mouseleave="shrink">
              <h2 class="text-white text-lg font-semibold mb-4 text-center">{{ cardInfo.title }}</h2>
              <p class="text-white">{{ cardInfo.description }}</p>
            </div>
          </div>  
   </div>
</div>
</template>

<script>
export default {
  name: 'MealCard',
  props: {
    cardInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      cardWrapperStyle: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '15rem',
        transition: 'all 0.3s ease',
        zIndex: '1',
      },
      cardStyle: {
        height: '15rem',
        transition: 'all 0.3s ease',
        // transformOrigin: 'top', // Ensure the card grows from the top
        overflow: 'hidden',
        backgroundColor : '#427573',// Change background color when hovered
      }
    };
  },
  methods: {
    grow() {
      this.cardWrapperStyle.height = '20rem';
      this.cardStyle.height = '20rem'; // Adjust the height as needed
      this.cardWrapperStyle.zIndex = '2';
      this.cardStyle.backgroundColor =  '#366767'; // Change background color when hovered

    },
    shrink() {
      this.cardWrapperStyle.height = '15rem';
      this.cardStyle.height = '15rem'; // Reset height
      this.cardWrapperStyle.zIndex = '1';
      this.cardStyle.backgroundColor =  '#427573'; // Change background color when hovered


    }
  }
};
</script>

<style scoped>
.meal-card-wrapper {
  position: relative;
  width: 100%;
  height: 15rem; /* Match the initial height of your card */
}
</style>