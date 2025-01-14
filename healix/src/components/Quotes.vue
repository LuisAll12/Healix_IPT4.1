<script setup>
    import { ref, onMounted } from 'vue';
    import fetchRandomRecord from '../services/GetQuotes.js';

    // Reactive state for the loader
    const LoaderState = ref(true); // Start with the loader visible

    // Reactive state for the record
    const record = ref({
        id: null,
        author: '',
        content: '',
        title: ''
    });

    // Fetch random record from Airtable
    const fetchRandomData = async () => {
        try {
            const randomRecord = await fetchRandomRecord();
            if (randomRecord) {
                record.value = randomRecord;
                console.log(record)
            } else {
                alert('Error fetching record');
            }
        } catch (error) {
            alert('Error fetching record');
        } finally {
            LoaderState.value = false; // Hide the loader once data is fetched
        }
    };

    // Fetch data when the component is mounted
    onMounted(() => {
        fetchRandomData();
    });
</script>

<template>
    <div class="quotes">
        <div class="quotestext" v-if="!LoaderState">
            <h2 class="title">{{ record.title }}</h2>
        <div class="lowercontent">
            <h3 class="content">"{{ record.content }}"</h3>
            <h4 class="author">--{{ record.author }}</h4>
        </div>
        </div>

        <div class="loader" v-if="LoaderState">
            <div class="wrapper">
                <div class="line-1"></div>
                <div class="line-2"></div>
                <div class="line-3"></div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    @import '../assets/components/Quotes.css';
</style>