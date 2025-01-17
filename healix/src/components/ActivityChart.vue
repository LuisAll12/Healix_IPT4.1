<template>
  <div class="chart-container">
    <div class="header">
      <h2>Overview</h2>
      <select v-model="timeframe" class="timeframe-select">
        <option value="monthly">Monthly</option>
        <option value="weekly">Weekly</option>
      </select>
    </div>
    
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchStepsGroupedByWeekAndMonth } from '../services/GetActivityChartData.js'
import Chart from 'chart.js/auto'

const chartRef = ref(null)
const timeframe = ref('monthly')

let chartInstance = null

// Define these as refs so they are accessible throughout the component
const monthlyData = ref([])
const weeklyData = ref([])

// Function to get the dynamic min and max values for the y-axis based on data
const getYAxisRange = (data) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  // Add a dynamic padding based on the range
  const range = max - min;
  const padding = range * 0.1; // Add 10% padding
  
  return {
    min: min - padding,
    max: max + padding
  };
};

// Chart options and data configuration
const createChart = (data, labels) => {
  const { min, max } = getYAxisRange(data)
  
  const ctx = chartRef.value.getContext('2d')

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Steps',
      data: data,
      borderColor: '#cb80ff',
      backgroundColor: '#6c35de',
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 8,
      pointBackgroundColor: '#FF69B4',
      pointHoverBackgroundColor: '#FF69B4',
      pointBorderColor: '#FFF',
      pointHoverBorderColor: '#FFF',
      pointBorderWidth: 2,
      fill: true
    }]
  }

  const config = {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `${context.parsed.y.toLocaleString()} Steps`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#ffffff',
            font: {
              size: 12
            }
          }
        },
        y: {
          display: true,
          min: min,
          max: max,
          grid: {
            display: true
          }
        }
      }
    }
  }

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx, config)
}

onMounted(async () => {
  const { weeklyData: weekly, monthlyData: monthly } = await fetchStepsGroupedByWeekAndMonth()
  weeklyData.value = weekly.map(d => d.totalSteps) // Store data in refs
  monthlyData.value = monthly.map(d => d.totalSteps)

  // Set initial chart based on the timeframe
  if (timeframe.value === 'monthly') {
    createChart(monthlyData.value, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
  } else {
    createChart(weeklyData.value, ['Week 1', 'Week 2', 'Week 3', 'Week 4'])
  }
})

// Watch for changes in timeframe and update the chart data
watch(timeframe, (newTimeframe) => {
  if (newTimeframe === 'monthly') {
    createChart(monthlyData.value, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
  } else {
    createChart(weeklyData.value, ['Week 1', 'Week 2', 'Week 3', 'Week 4'])
  }
})
</script>


<style scoped>
@import '../assets/global.css';
.chart-container {
  width: 100%;
  max-width: 1000px;
  padding: 24px;
  border-radius: 16px;
  background-image: linear-gradient(to bottom, var(--primary), var(--bg));
  color: var(--text);
  animation: gradient 9s linear infinite;
  box-shadow: 10px 20px 20px rgba(120, 87, 255, 0.3);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.timeframe-select {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text);
  padding: 4px 12px;
  border-radius: 20px;
  border: none;
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
  text-align: center;
}

.stat-box {
  padding: 8px;
}

.stat-label {
  color: var(--text);
  font-size: 14px;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin: 4px 0;
}

.stat-period {
  color: var(--text);
  font-size: 14px;
  margin: 4px 0 0 0;
}

canvas {
  margin: 16px 0;
}
option{
    background-color: var(--primary);
    color: var(--text);
}
</style>
