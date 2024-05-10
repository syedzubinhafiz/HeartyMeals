<template>
    <div :class="['flex flex-col space-y-2  shadow-md rounded-md p-2',overlayColour,props.class]">
        <slot/>
    </div>

</template>
<script setup>
defineOptions({
	name: "Overlay",
});

const props = defineProps({
	level: {
		type: Number,
		default: 1,
	},
    colour: {
        type: String,
		default: null,
    },
    class: {
        type: String,
		default: "",
    }
});

const overlayColour = computed({
	get() {
        if(props.colour != null) {
            return props.colour
        }
		else if(props.level==0) {
            return "bg-custom-bg-brown"
        }
        else if(props.level==1) {
            return "bg-custom-overlay-brown"
        }
        else if(props.level==2) {
            return "bg-custom-overlay-light"
        }
        else {
            return ""
        }
	},
});

</script>