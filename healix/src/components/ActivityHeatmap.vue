<script setup>
import { ref, onMounted } from 'vue'; 
import { fetchActivityLevelsForMonth } from '../services/GetHeatMapData.js'
const rows = ref([]); 
const rowsloading = ref(true)
    onMounted(async () => { 
        rowsloading.value = true;
        rows.value = await fetchActivityLevelsForMonth();
        rowsloading.value = false;
    });

</script>

<template>
    <div class="heatmap"> 
        <div class="header"> 
            <h2>Weekly Engagement</h2> 
            </div> 
            <div class="legend"> 
                <span class="low">Low</span> 
                <span class="medium">Medium</span> 
                <span class="high">High</span> 
                <span class="best">Best</span> 
                </div> 
            <div class="heatmap-grid"> 
                <div class="row" v-for="(row, rowIndex) in rows" :key="rowIndex" v-if="!rowsloading"> 
                    <div class="cell" 
                        v-for="(cell, cellIndex) in row.cells" 
                        :key="`${rowIndex}-${cellIndex}`" 
                        :class="cell">
                    </div> 
                </div> 
                <div v-if="rowsloading" class="row" v-for="(row, rowIndex) in rows" :key="rowIndex" > 
                    <div 
                        class="cell" 
                        v-for="(cell, cellIndex) in row.cells" 
                        :key="`${rowIndex}-${cellIndex}`" 
                        :class="cell">
                    </div> 
                    <div 
                        class="cellloading" 
                        v-for="(cell, cellIndex) in row.cells" 
                        :key="`loading-${rowIndex}-${cellIndex}`">
                    </div> 
                </div>
            </div>
        </div>
</template>
<style scoped>
 @import '../assets/components/DashboardComps/BodyMuscle.css'; 
</style>