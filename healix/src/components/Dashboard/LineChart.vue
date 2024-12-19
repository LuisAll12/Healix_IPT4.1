<script setup>
import { LineChart } from "vue-chart-3";
import { defineChartConfig } from "vue-chart-3";

const chartConfig = defineChartConfig({
  type: "line",
  data: {
    labels: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
    datasets: [
      {
        label: "Heart Rate",
        data: [92, 85, 88, 92, 89, 94, 90],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  },
});
</script>

<template>
  <LineChart :chartConfig="chartConfig" />
</template>
