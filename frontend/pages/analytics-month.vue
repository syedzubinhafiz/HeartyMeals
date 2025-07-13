<!-- AnalyticsMonth.vue -->
<template>
  <div class="analytics-container">
    <Header/>
    <main class="main-content">
      <div class="top-section">
      <h1 class="title">Diet Analytics</h1>
      <div class="content-wrapper">
          <div class="view-selector">
            <button :class="{ active: view === 'day' }" @hover="" @click="setView('day')">Day</button>
            <button :class="{ active: view === 'week' }" @click="setView('week')">Week</button>
            <button :class="{ active: view === 'month' }" @click="setView('month')">Month</button>
          </div>
      </div>
    </div>

        <div class="date-navigation">
          <button class="nav-arrow" @click="prevMonth">‹</button>
          <span class="date-range">{{ formattedStartDate }}</span>
          <button class="nav-arrow" @click="nextMonth">›</button>
        </div>

      <div class="layout-container">
        <div class="metrics-section">
            <div class="metrics-grid">
              <div v-for="metric in metrics" :key="metric.title" :class="['metric-card', metric.className]">
                <h3 class="metric-title">
                  <span class="metric-icon-wrapper">
                      <img :src="metric.icon" alt="" class="metric-icon"/>
                  </span>
                  {{ metric.title }}
                </h3>
                <div class="metric-content">
                  <div class="metric-row-with-border">
                  <span class="metric-label">Guideline per Day</span>
                  <span class="metric-value">
                      {{ metric.data['Guideline per Day'] }}
                    </span>
                </div>

                <div class="metric-row-with-border">
                  <span class="metric-label">Average Daily Consumption</span>
                  <span class="metric-value">
                      {{ metric.data['Average Daily Consumption'] }}
                    </span>
                </div>
                
                <div class="metric-row-with-border">
                  <span class="metric-label">Difference</span>
                  <span :class="['metric-value', { 'negative': metric.data['Difference'].startsWith('-'), 'positive': !metric.data['Difference'].startsWith('-') }]">
                      {{ metric.data['Difference'] }}
                    </span>
                </div> 

                  <div class="metric-row">
                    <span class="metric-label">% Days Under Guideline</span>
                    <span class="metric-value">
                        {{ metric.data['% Days Under Guideline'] }}
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
                <div class="chart-legend-wrapper">
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
    </div>
    <div class="fixed-footer ">
            <Footer />
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
  import { useNuxtApp } from '#app'
  
  const {$axios} = useNuxtApp()
  
  
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
  
  defineOptions({
    name: "AnalyticsMonth",
  })
  
  definePageMeta({
    layout: "emptylayout"
  })
  
  const view = ref('month')
  const setView = async (newView) => {
    view.value = newView
    await navigateTo(`/analytics-${newView}`)
  }
  
  const datasets = ['Protein', 'Carbs', 'Cholestrol', 'Fats', 'Sodium']
  const activeDataset = ref('Protein')
  
  
  const proteinData = computed(() => {
    if (!monthlyData.value) return [] // Return empty array if data is not yet loaded
    return {
      daily_budget: monthlyData.value.protein.daily_budget,
      days: monthlyData.value.protein.days
    }
  })
  
  
  const carbsData = computed(() => {
    if (!monthlyData.value) return [] // Return empty array if data is not yet loaded
    return {
      daily_budget: monthlyData.value.carbs.daily_budget,
      days: monthlyData.value.carbs.days
    }
  })
  
  
  const cholestrolData = computed(() => {
    if (!monthlyData.value) return [] // Return empty array if data is not yet loaded
    return {
      daily_budget: monthlyData.value.cholesterol.daily_budget,
      days: monthlyData.value.cholesterol.days
    }
  })
  
  const fatsData = computed(() => {
    if (!monthlyData.value) return [] // Return empty array if data is not yet loaded
    return {
      daily_budget: monthlyData.value.fat.daily_budget,
      days: monthlyData.value.fat.days
    }
  })
  
  const sodiumData = computed(() => {
    if (!monthlyData.value) return [] // Return empty array if data is not yet loaded
    return {
      daily_budget: monthlyData.value.sodium.daily_budget,
      days: monthlyData.value.sodium.days
    }
  })
  
  
  
  const setActiveDataset = (dataset) => {
    activeDataset.value = dataset
    console.log('Active dataset:', proteinData.value)
    // Update chart data based on selected dataset
    switch (dataset) {
      case 'Protein':
        chartData.value = proteinData
        break
      case 'Carbs':
        chartData.value = carbsData
        break
      case 'Fats':
        chartData.value = fatsData
        break
      case 'Sodium':
        chartData.value = sodiumData
        break
      case 'Cholestrol':
        chartData.value = cholestrolData
        break
    }
  }
  
  const chartData = computed(() => {
    if (!monthlyData.value) return { labels: [], datasets: [] }; // Return empty chart data if weeklyData is not loaded
  
    let activeData;
    let unit = '';
    switch (activeDataset.value) {
      case 'Protein':
        activeData = monthlyData.value.protein;
        unit = 'g';
        break;
      case 'Carbs':
        activeData = monthlyData.value.carbs;
        unit = 'g';
        break;
      case 'Cholestrol':
        activeData = monthlyData.value.cholesterol;
        unit = 'mg';
        break;
      case 'Fats':
        activeData = monthlyData.value.fat;
        unit = 'g';
        break;
      case 'Sodium':
        activeData = monthlyData.value.sodium;
        unit = 'mg';
        break;
      default:
        activeData = monthlyData.value.calories;
        unit = 'kcal';
    }
  
    return {
      labels: activeData.days.map(day => day.date),
      datasets: [
        {
          label: `Daily Budget (${unit})`,
          borderColor: '#000000',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          data: Array(activeData.days.length).fill(activeData.daily_budget),
          borderWidth: 2,
          pointRadius: 0,
          fill: true
        },
        {
          label: `Daily Consumption (${unit})`,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          data: activeData.days.map(day => day.consumption),
          borderWidth: 2,
          pointRadius: 4,
          fill: true
        }
      ]
    };
  });
  
  
// const currentDate = ref(new Date());


const currentDate = ref(new Date())

const formattedStartDate = computed(() => {
return currentDate.value.toLocaleDateString('en-GB', {
  month: 'long',
  year: 'numeric',
})
})

const prevMonth = () => {
currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
const newDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
if (newDate <= new Date()) {
  currentDate.value = newDate
} else {
  alert("You cannot view future data")
}
}

const startOfMonth = computed(() => {
const year = currentDate.value.getFullYear()
const month = currentDate.value.getMonth() + 1 
return `${year}-${month.toString().padStart(2, '0')}-01`
})

const endOfMonth = computed(() => {
const year = currentDate.value.getFullYear()
const month = currentDate.value.getMonth() + 1
const lastDay = new Date(year, month, 0).getDate() 
return `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
})

let monthlyData = ref(null)

// Function to fetch data from API
async function fetchWeeklyData() {
// const startDate = new Date(currentStartDate.value).toISOString().split('T')[0]
// const endDate = new Date(currentDate.value)

// const startOfMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1).toISOString().split('T')[0];
// const endOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).toISOString().split('T')[0];

console.log(`${startOfMonth.value} `); //2024-09-01 
console.log(endOfMonth.value); //2024-09-30
console.log(currentDate.value);

try {
  const result = await $axios.get('/analytics/monthly', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      'Content-Type': 'application/json',
    },
    params: {
      startDate: startOfMonth.value,
      endDate: endOfMonth.value,
      timeZone: 'Asia/Kuala_Lumpur'
    }
  })
  monthlyData.value = result.data
  console.log('Monthly data fetched:', monthlyData.value)
  console.log(monthlyData.value.calories.days.map(day => day.date))
} catch (error) {
  console.error('Error fetching monthly data:', error.response?.message || error.message)
}
}

// Watch for changes in currentDate and fetch new data
watch(currentDate, fetchWeeklyData)

fetchWeeklyData()

const metrics = computed(() => {
  if (!monthlyData.value) return [] // Return empty array if data is not yet loaded

  return [
    {
      title: 'Calories',
      icon: caloriesIcon,
      className: 'calories',
      data: {
        'Guideline per Day': `${monthlyData.value.calories.daily_budget}kcal`,
        'Average Daily Consumption': `${monthlyData.value.calories.average_daily}kcal`,
        'Difference': `${monthlyData.value.calories.difference}`,
        '% Days Under Guideline': `${(monthlyData.value.calories.percentage_of_daily_budget)}%`
      }
    },
    {
      title: 'Protein',
      icon: proteinIcon,
      className: 'protein',
      data: {
        'Guideline per Day': `${monthlyData.value.protein.daily_budget}g`,
        'Average Daily Consumption': `${monthlyData.value.protein.average_daily}g`,
        'Difference': `${monthlyData.value.protein.difference}`,
        '% Days Under Guideline': `${(monthlyData.value.protein.percentage_of_daily_budget)}%`
      }
    },
    {
      title: 'Carbohydrates',
      icon: carbsIcon,
      className: 'carbs',
      data: {
        'Guideline per Day': `${monthlyData.value.carbs.daily_budget}g`,
        'Average Daily Consumption': `${monthlyData.value.carbs.average_daily}g`,
        'Difference': `${monthlyData.value.carbs.difference}`,
        '% Days Under Guideline': `${(monthlyData.value.carbs.percentage_of_daily_budget)}%`
      }
    },
    {
      title: 'Cholesterols',
      icon: cholesterolIcon,
      className: 'cholesterol',
      data: {
        'Guideline per Day': `${monthlyData.value.cholesterol.daily_budget}g`,
        'Average Daily Consumption': `${monthlyData.value.cholesterol.average_daily}g`,
        'Difference': `${monthlyData.value.cholesterol.difference}`,
        '% Days Under Guideline': `${(monthlyData.value.cholesterol.percentage_of_daily_budget)}%`
      }
    },
    {
      title: 'Fats',
      icon: fatsIcon,
      className: 'fats',
      data: {
        'Guideline per Day': `${monthlyData.value.fat.daily_budget}g`,
        'Average Daily Consumption': `${monthlyData.value.fat.average_daily}g`,
        'Difference': `${monthlyData.value.fat.difference}`,
        '% Days Under Guideline': `${(monthlyData.value.fat.percentage_of_daily_budget)}%`
      }
    },
    {
      title: 'Sodium',
      icon: sodiumIcon,
      className: 'sodium',
      data: {
        'Guideline per Day': `${monthlyData.value.sodium.daily_budget}g`,
        'Average Daily Consumption': `${monthlyData.value.sodium.average_daily.toFixed(0)}g`,
        'Difference': `${monthlyData.value.sodium.difference}`,
        '% Days Under Guideline': `${(monthlyData.value.sodium.percentage_of_daily_budget)}%`
      }
    }
  ]
})




const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 40 /* Increased bottom padding for better aesthetics */
    }
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 0,
        font: {
          size: 10
        }
      }
    }
  },
  plugins: {
    legend: {
      display: true
    }
  }
}


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100..900;1,100..900&family=Source+Code+Pro&display=swap');
*{
    font-family: 'Overpass', sans-serif;
}

.top-section{
display: flex;
justify-content: space-between;
align-items: center;
/* margin-bottom: 0.5rem; */
width: 50%;
}

/* Mobile: Center title and selector */
@media (max-width: 768px) {
  .top-section {
    width: 100%;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
  }
  
  .title {
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .content-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
.analytics-container {
display: flex;
flex-direction: column;
}

.main-content {
  padding: 1rem;
}

.content-wrapper {
  border-radius: 10px;
  padding: 1rem;
}
.title {
  font-size: 2rem; /* Smaller title */
  margin: 0;
  font-weight: semibold;
}

.view-selector {
  background-color: #ffffff;
  border-radius: 20px;
  display: flex;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  overflow: hidden;

}

.view-selector button {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  color: #718096;
}

.view-selector button.active {
  background-color: #87A98D;
  color: white;
}

.view-selector button:hover {
  background-color: #02B5B1;
  color: white;
}

.date-navigation {
font-size: 1rem; /* Smaller title */
display: flex;
align-items: center;
margin-bottom: 0rem;
font-weight: normal;
}

/* Mobile: Center date navigation */
@media (max-width: 768px) {
  .main-content {
    text-align: center; /* Center everything in main content */
  }
  
  .date-navigation {
    justify-content: center !important;
    margin: 1rem auto !important;
    text-align: center !important;
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
  }
  
  .nav-arrow {
    font-size: 24px;
    padding: 0.5rem;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .date-range {
    font-size: 1.2rem !important;
    margin: 0 1rem !important;
    text-align: center !important;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.nav-arrow {
  background: none;
  border: none;
  font-size: 36px;
  cursor: pointer;
  color: #1e5e5e;
}

.date-range {
margin: 0 1rem;
font-size: 1.5rem; /* Smaller title */

}

.layout-container {
display: flex;
gap: 1rem;
margin-top: 0.5rem; 

}
.chart-section {
background-color: #F3EADA;
flex: 1;
min-width: 0; /* Allows the flex item to shrink below its minimum content size */
min-height: 0;
height: 540px;
border-radius: 10px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

}

.metrics-section {
flex: 1;
min-width: 0; /* Allows the flex item to shrink below its minimum content size */
gap: 0.5rem; /* Reduce gap for tighter layout */
grid-template-columns: repeat(2, 1fr); /* Adjust as necessary */

}

.metrics-grid {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 1rem;
margin-bottom: 0.25rem;
}

/* Mobile: Single column metrics grid */
@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

.metric-card {
  background-color: #F3EADA;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

}

.metric-title {
font-size: 1.2rem;
display: flex;
align-items: center;
font-style: bold;
border-radius: 10px;
}

.metric-icon-wrapper {
  margin: 0.5rem;
}
.metric-icon{
width: 15px;
height: 15px;
}

.metric-value{
color: #919191
}

.metric-label{
color: #555555;
}

.metric-row-with-border{
display: flex;
justify-content: space-between;
margin-bottom: 0.25rem;
}

.metric-row{
display: flex;
justify-content: space-between;
margin-bottom: 0.2rem;
}


.metric-row-with-border {
border-bottom: 1px solid #000000;
}
.metric-content {
margin: 0.5rem;
}

.negative {
color: green;
}

.positive {
color: red;
}

.chart-container {
  /* background-color: #f7f3eb; */
  border-radius: 10px;
  padding: 1rem;
  height: 400px;
  display: flex;
  flex-direction: column;
}
.chart-title {
font-size: 35px;
margin-bottom: 0.5rem;
}

/* Mobile: Responsive chart title */
@media (max-width: 768px) {
  .chart-title {
    font-size: 1.5rem;
    text-align: center;
  }
}
.chart-legend {
display: flex;
justify-content: center;
margin-bottom: 0;
background-color: #FFFEF1;
/* width: 460px; */
border-radius: 20px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Mobile: Responsive chart legend */
@media (max-width: 768px) {
  .chart-legend {
    width: 100%;
    max-width: calc(100vw - 2rem);
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .legend-item {
    flex: 1;
    min-width: calc(50% - 0.25rem);
    text-align: center;
    padding: 0.75rem 0.5rem;
    margin: 0;
    font-size: 0.9rem;
  }
  
  .legend-item.active {
    background-color: #87A98D !important; /* Force correct green color on mobile */
    color: white !important;
  }
}


.chart-legend-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.legend-item {
transition: opacity 0.3s;
border: none;
cursor: pointer;
opacity: 0.5;
padding: 0.5rem 1.2rem;
margin-left: 1zrem;
border-radius: 20px;
}

.legend-item.active {
  opacity: 1;
  font-weight: bold;
  background-color: #87A98D;
  color: white;
}

.legend-item:hover {
  opacity: 1;
  font-weight: bold;
  background-color: #02B5B1;
  color: white;
}


.fixed-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

/* Mobile: Make footer non-fixed to prevent content overlap */
@media (max-width: 768px) {
  .fixed-footer {
    position: relative;
    margin-top: 2rem;
  }
  
  .analytics-container {
    padding-bottom: 12rem; /* Increased bottom padding */
  }
  
  .chart-section {
    height: auto; /* Auto height to accommodate legend */
    margin-bottom: 1rem;
    padding: 0 1rem; /* Add horizontal padding to prevent overflow */
    /* Removed overflow: hidden to show legend buttons */
  }
  
  .chart-container {
    height: 450px; /* Increased height for more space below x-axis */
    padding: 1rem 0.5rem 2rem 0.5rem; /* More bottom padding for x-axis space */
    /* Removed overflow: hidden to show all chart content */
  }
  
  .chart-legend-wrapper {
    margin-bottom: 6rem; /* Much more space before footer area */
    padding: 0 1rem; /* Add horizontal padding */
    margin-top: 1rem; /* Space above legend */
  }
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
  .top-section{
    flex-direction: column;
    align-items: flex-start;
  }
  .layout-container {
    flex-direction: column;
  }
  
  .top-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .view-selector {
    margin-top: 1rem;
  }
  
  .date-navigation {
    justify-content: center;
    margin-bottom: 1rem;
  }
}
</style>

