<template>
  <div class="p-6 rounded-lg w-72 h-200 flex flex-col items-center justify-between transition-all duration-300">
      <img :src="cardInfo.image" alt="Meal Image" class="absolute w-20 h-20 object-cover rounded-full mb-4 z-10" />
            <div class="bg-custom-bg-lightgreen p-6 rounded-lg w-full flex flex-col items-center justify-center text-center shadow-md mt-12 pt-16"
            :style="cardStyle"
            @mouseover="grow"
            @mouseleave="shrink">
              <h2 class="text-white text-lg font-semibold mb-4 text-center">{{ cardInfo.title }}</h2>
              <p class="text-white">{{ cardInfo.description }}</p>
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
      cardStyle: {
        height: '15rem',
        transition: 'all 0.3s ease',
        transformOrigin: 'top', // Ensure the card grows from the top
        overflow: 'hidden',
        backgroundColor : '#427573',// Change background color when hovered
      }
    };
  },
  methods: {
    grow() {
      this.cardStyle.height = '20rem'; // Adjust the height as needed
      this.cardStyle.backgroundColor =  '#366767'; // Change background color when hovered

    },
    shrink() {
      this.cardStyle.height = '15rem'; // Reset height
      this.cardStyle.backgroundColor =  '#427573'; // Change background color when hovered


    }
  }
};
</script>

<style scoped>
</style>