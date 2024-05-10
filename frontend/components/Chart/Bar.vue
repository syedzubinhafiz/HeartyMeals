<template>
	<div>
		<Bar :data="data" :options="options"/>
	</div>
</template>

<script setup>
import { Chart, Title, Tooltip, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "vue-chartjs";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

defineOptions({
	name: "BarChart",
	components: {
		Bar
	},
});

defineProps({
	data: {
		type: Object,
		default: {
			labels: ["Protein", "Carbs", "Sodium", "Fats", "Chol"],
			datasets: [
				{
					backgroundColor: "#FFA17A",
					data: [20, 40, 1, 10, 20],
				},
			],
		},
	},
	options: {
		type: Object,
		default: {
			maintainAspectRatio: true,
			responsive: true,
		},
	},
});
</script>
