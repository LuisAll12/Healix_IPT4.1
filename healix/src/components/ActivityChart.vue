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
  import Chart from 'chart.js/auto'
  
  const chartRef = ref(null)
  const timeframe = ref('monthly')
  
  // Sample monthly data
  const monthlyData = [8200, 8800, 8600, 9178, 8900, 9100, 8700, 8950, 5000, 8800, 8800, 8800]
  // Sample weekly data (replace with real data as needed)
  const weeklyData = [800, 600, 700, 850, 900, 1100, 1200]
  
  // Get the last 4 calendar weeks
  function getLast4CalendarWeeks() {
    const today = new Date();
    
    // Helper function to get the week number of the year
    const getWeekNumber = (date) => {
      const startDate = new Date(date.getFullYear(), 0, 1); // January 1st of the current year
      const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000)); // Days difference
      return Math.ceil((days + 1) / 7); // Calculate week number
    };
  
    // Get the current week number
    let currentWeek = getWeekNumber(today);
    
    const weeks = [];
    
    // Get the current week and the last 3 weeks
    for (let i = 0; i < 4; i++) {
      weeks.push(`Week ${currentWeek}`);
      currentWeek--;
    }
    
    return weeks.reverse(); // Reverse to display the correct order
  }
  
  const last4Weeks = ref(getLast4CalendarWeeks())
  
  let chartInstance = null
  
  // Function to get the dynamic min and max values for the y-axis based on data
  const getYAxisRange = (data) => {
    const min = Math.min(...data) - 100;  // 100 is added for padding
    const max = Math.max(...data) + 100;  // 100 is added for padding
    return { min, max }
  }
  
  // Chart options and data configuration
  const createChart = (data, labels) => {
    const { min, max } = getYAxisRange(data)
    
    const ctx = chartRef.value.getContext('2d')
  
    const chartData = {
      labels: labels, // Use dynamic labels for weeks or months
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
            display: false, // Hide y-axis lines and labels
            min: min,
            max: max,
            grid: {
              display: false, // Hide grid lines
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
  
  onMounted(() => {
    // Initialize chart with monthly data as default
    createChart(monthlyData, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
  })
  
  // Watch for changes in timeframe and update the chart data
  watch(timeframe, (newTimeframe) => {
    if (newTimeframe === 'monthly') {
      createChart(monthlyData, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    } else {
      createChart(weeklyData, last4Weeks.value) // Use dynamic week labels here
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