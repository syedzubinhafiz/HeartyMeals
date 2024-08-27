<template>
    <div class="border border-custom-button-green rounded-md w-full flex justify-between">
        <div v-for="(section, i) in sections" class="grow flex items-center justify-between space-x-2 text-wrap">
            <div v-if="progress<i" class="border border-custom-button-green rounded-full h-10 w-10 flex items-center justify-center m-2">
                <p class="text-custom-button-green">{{ i+1 }}</p>
            </div>
            <div v-else-if="progress==i" class="border border-custom-button-green rounded-full h-10 w-10 flex items-center justify-center m-2 bg-custom-button-green">
                <p class="text-white">{{ i+1 }}</p>
            </div>
            <svg v-else class="m-2" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="20" fill="#87A98D"/>
                <path d="M18 23.586L14.707 20.293L13.293 21.707L18 26.414L27.707 16.707L26.293 15.293L18 23.586Z" fill="#FFFEF1"/>
            </svg>

            <p class="text-wrap text-custom-button-green m-2">{{ section }}</p>
            <svg v-if="i!=sections.length-1" width="18" height="65" viewBox="0 0 18 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.33398 1L16.334 37L1.33398 72.5" stroke="#87A98D" stroke-width="1" stroke-linejoin="round"/>
            </svg>
            <div v-else class="w-2"/>

        </div>
    </div>
</template>
<script setup>
defineOptions({
	name: "CustomDishProgressBar",
});

const props = defineProps({
    sections: {
        default: ["Select raw ingredients","Select seasoning","Set recipe","Summary"]
    },
    progress: {
        default: 2
    }
})

</script>