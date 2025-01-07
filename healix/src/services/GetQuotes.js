import Airtable from 'airtable';
// Airtable configuration
const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const Table = "tblZGy0RyEK4bbLur"; // Table for form submissions
const base = new Airtable({ apiKey }).base(baseId);


async function fetchRandomRecord() {
    try {
      // Get all records from the specified table
      const records = await base(Table).select({
        maxRecords: 40,  // Limiting to the first 50 records
        view: 'Grid view'  // Specify the view (optional)
      }).all();
  
      // Pick a random record
      const randomRecord = records[Math.floor(Math.random() * records.length)];
  
      // Return the desired fields (ID, Author, Content, Title)
      return {
        id: randomRecord.id,
        author: randomRecord.fields['Autor'],  // Replace 'Author' with your actual field name
        content: randomRecord.fields['Content'],  // Replace 'Content' with your actual field name
        title: randomRecord.fields['Title']  // Replace 'Title' with your actual field name
      };
    } catch (error) {
      console.error('Error fetching data from Airtable:', error);
      return null;
    }
  }
  
  export default fetchRandomRecord;