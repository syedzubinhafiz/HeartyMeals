<!-- AnalyticsMonth.vue -->
<template>
  <div class="analytics-container">
    <Header/>
    <main class="main-content">
      <h1 class="title">Diet Analytics</h1>

      <div class="content-wrapper">
        <div class="view-selector">
          <button :class="{ active: view === 'day' }" @click="setView('day')">Day</button>
          <button :class="{ active: view === 'week' }" @click="setView('week')">Week</button>
          <button :class="{ active: view === 'month' }" @click="setView('month')">Month</button>
        </div>

        <div class="date-navigation">
          <button class="nav-arrow" @click="prevWeek">‹</button>
          <span class="date-range">21 April 2024 - 27 April 2024</span>
          <button class="nav-arrow" @click="nextWeek">›</button>
        </div>

      <div class="layout-container">
        <div class="metrics-section">
            <div class="metrics-grid">
              <div v-for="metric in metrics" :key="metric.title" :class="['metric-card', metric.className]">
                <h3 class="metric-title">
                  <span class="metric-icon">
                      <img :src="metric.icon" alt="" />
                  </span>
                  {{ metric.title }}
                </h3>
                <div class="metric-content">
                  <div v-for="(value, key) in metric.data" :key="key" class="metric-row">
                    <span>{{ key }}</span>
                    <span :class="{ 'positive': value.startsWith('-'), 'negative': value.startsWith('+') }">
                      {{ value }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <div class="chart-section">
            <div class="chart-container">
              <h3 class="chart-title">Daily Protein Intake</h3>
              <Line :data="chartData" :options="chartOptions" />
              <div class="chart-legend">
                <button v-for="dataset in datasets" :key="dataset" 
                        :class="['legend-item', { active: activeDataset === dataset }]" 
                        @click="setActiveDataset(dataset)">
                  {{ dataset }}
                </button>
              </div>
            </div>
          </div>

      </div>
      </div>
    </main>
    <Footer/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import caloriesIcon from '/assets/img/Calories-Icon.svg'
import proteinIcon from '/assets/img/Protein.svg'
import carbsIcon from '/assets/img/Carbo-Icon.svg'
import fatsIcon from '/assets/img/Olive-oil.svg'
import sodiumIcon from '/assets/img/Salt.svg'
import cholesterolIcon from '/assets/img/Egg.svg'



ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

defineOptions({
  name: "AnalyticsMonth",
})

definePageMeta({
  layout: "emptylayout"
})

const view = ref('week')
const setView = (newView) => {
  view.value = newView
}

const prevWeek = () => {
  // Implement previous week logic
}

const nextWeek = () => {
  // Implement next week logic
}

const metrics = [
  {
    title: 'Calories',
    icon: caloriesIcon,
    className: 'calories',
    data: {
      'Guideline per Day': '2000kcal',
      'Average Daily Consumption': '2200kcal',
      'Difference': '+200kcal',
      '% Days Under Guideline': '50%'
    }
  },
  {
    title: 'Protein',
    icon: proteinIcon,
    className: 'protein',
    data: {
      'Guideline per Day': '80g',
      'Average Daily Consumption': '56g',
      'Difference': '-14g',
      '% Days Under Guideline': '75%'
    }
  },
  {
    title: 'Carbohydrates',
    icon: carbsIcon,
    className: 'carbs',
    data: {
      'Guideline per Day': '120g',
      'Average Daily Consumption': '130g',
      'Difference': '+10g',
      '% Days Under Guideline': '25%'
    }
  },
  {
    title: 'Cholesterols',
    icon: cholesterolIcon,
    className: 'cholesterol',
    data: {
      'Guideline per Day': '20g',
      'Average Daily Consumption': '10g',
      'Difference': '-10g',
      '% Days Under Guideline': '100%'
    }
  },
  {
    title: 'Fats',
    icon: fatsIcon,
    className: 'fats',
    data: {
      'Guideline per Day': '60g',
      'Average Daily Consumption': '52g',
      'Difference': '-8g',
      '% Days Under Guideline': '75%'
    }
  },
  {
    title: 'Sodium',
    icon: sodiumIcon,
    className: 'sodium',
    data: {
      'Guideline per Day': '2g',
      'Average Daily Consumption': '1.8g',
      'Difference': '-0.2g',
      '% Days Under Guideline': '50%'
    }
  }
]

const chartData = ref({
  labels: ['21/04/2024', '22/04/2024', '23/04/2024', '24/04/2024', '25/04/2024', '26/04/2024', '27/04/2024'],
  datasets: [
    {
      label: 'Goal',
      borderColor: '#000000',
      backgroundColor: '#000000',
      data: [80, 80, 80, 80, 80, 80, 80],
      borderWidth: 2,
      pointRadius: 0
    },
    {
      label: 'Actual',
      borderColor: '#4CAF50',
      backgroundColor: '#4CAF50',
      data: [60, 40, 70, 50, 90, 0, 0],
      borderWidth: 2,
      pointRadius: 4
    }
  ]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 20
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
}

const datasets = ['Protein', 'Carbs', 'Sugar', 'Fats', 'Sodium']
const activeDataset = ref('Protein')
const setActiveDataset = (dataset) => {
  activeDataset.value = dataset
  // Update chart data based on selected dataset
}

onMounted(() => {
  // Any additional setup can be done here
})
</script>

<style scoped>
.analytics-container {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  padding: 1rem;
  flex-grow: 1;
}

.content-wrapper {
  border-radius: 10px;
  padding: 1rem;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.view-selector {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.view-selector button {
  background-color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  border-radius: 20px;
  cursor: pointer;
}

.view-selector button.active {
  background-color: #87A98D;
  color: white;
}

.date-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.nav-arrow {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #1e5e5e;
}

.date-range {
  margin: 0 1rem;
  font-weight: bold;
}

.layout-container {
  display: flex;
  gap: 1rem;
}

.chart-section {
  flex: 1;
  min-width: 0; /* Allows the flex item to shrink below its minimum content size */
}

.metrics-section {
  flex: 1;
  min-width: 0; /* Allows the flex item to shrink below its minimum content size */
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.metric-card {
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 1rem;
}

.metric-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  font-style: bold;
}

.metric-icon {
  margin-right: 0.5rem;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.positive {
  color: green;
}

.negative {
  color: red;
}

.chart-container {
  background-color: #f7f3eb;
  border-radius: 10px;
  padding: 1rem;
  height: 300px;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.chart-legend {
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding-top: 1rem;
}

.legend-item {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  opacity: 0.5;
}

.legend-item.active {
  opacity: 1;
  font-weight: bold;
}

/* Color classes for metric cards */
.calories .metric-title { background-color: #B8B396; }
.protein .metric-title { background-color: #87A98D; }
.carbs .metric-title { background-color: #83BBBE; }
.cholesterol .metric-title { background-color: #BE9A83; }
.fats .metric-title { background-color: #ECC474; }
.sodium .metric-title { background-color: #EC7455; }

/* Responsive layout */
@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
  }
  
  .top-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .view-selector {
    order: -1;
    margin-bottom: 1rem;
  }
  
  .date-navigation {
    justify-content: center;
    margin-bottom: 1rem;
  }
}
</style>