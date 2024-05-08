<template>
	<div class="relative bg-custom-bg-green shadow-md">
		<div class="mx-auto container px-5">
			<div class="flex items-center justify-between py-3 ">
                <h1 class="text-2xl text-white">Hearty Meals</h1>
                <div class="flex space-x-5">
                    <button class="rounded-md bg-custom-button-orange text-white py-2 px-5">1</button>
                    <button class="rounded-md bg-custom-button-orange text-white py-2 px-5">2</button>
                    <button class="rounded-md bg-custom-button-orange text-white py-2 px-5">3</button>
                    <button class="rounded-md bg-custom-button-orange text-white py-2 px-5">4</button>
                </div>
            </div>
		</div>
	</div>
</template>
<script setup>
defineOptions({
	name: "Header",
});

</script>
