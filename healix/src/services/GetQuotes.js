import Airtable from 'airtable';            


// Airtable configuration
const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const base = new Airtable({ apiKey }).base(baseId);

async function fetchRandomRecord() {
  try {
    const records = await base('tblZGy0RyEK4bbLur').select({
      maxRecords: 50,
      view: 'Grid view'
    }).all();

    const randomRecord = records[Math.floor(Math.random() * records.length)];
    console.log("TestInquotes")
    return {
      id: randomRecord.id,
      author: randomRecord.fields['Autor'],
      content: randomRecord.fields['Content'],
      title: randomRecord.fields['Title']
    };
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    return null;
  }
}

export default fetchRandomRecord;