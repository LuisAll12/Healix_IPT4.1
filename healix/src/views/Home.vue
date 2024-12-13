<script setup>

</script>

<template>

</template>



<!-- <template>
    <div>
      <h1>Airtable Records</h1>
      <ul>
        <li v-for="record in records" :key="record.id">
          {{ record.fields.FirstName }}
        </li>
      </ul>
    </div>
  </template>
  
<script>
import { fetchRecords } from '../services/airtable';
  
export default {
    data() {
    return {
        records: [],
    };
    },
    async created() {
    try {
        this.records = await fetchRecords();
    } catch (error) {
        console.error('Error loading records:', error);
    }
    },
};
</script>
-->