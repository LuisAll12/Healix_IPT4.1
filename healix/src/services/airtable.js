import Airtable from 'airtable';
// Airtable configuration
const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const FATable = import.meta.env.VITE_APP_TABLE_FA; // Table for form submissions
const base = new Airtable({ apiKey }).base(baseId);
/**
 * @param {string} sessionKey 
 * @returns {Promise<number|null>} 
 */

/**
 * @param {Object} formData  
 * @param {string} sessionKey 
 */
export async function registerInAirtable(formData, sessionKey) {
  try {
      const userRecordId = await getUserIdFromSessionKey(sessionKey); 
      console.log('UserRecordId:', userRecordId);


      if (!userRecordId) {
          console.error("Error: UserRecordId not found for the provided SessionKey.");
          return;
      }

      // Prepare data for Airtable
      const record = {
          Category: formData.Category,
          Intensity: formData.Intensity,
          Duration: formData.Duration,
          Muscle: formData.MuscleGroup,
          Steps: formData.Steps || null, 
          UserData: [userRecordId],
      };


      await base(FATable).create([{ fields: record }]);
      console.log('Data successfully registered in Airtable!');
  } catch (error) {
      console.error('Error registering data in Airtable:', error);
  }
}

async function getUserIdFromSessionKey(sessionKey) {
  try {
      const records = await base('UserData').select({
          filterByFormula: `{SessionKey} = '${sessionKey}'`, 
      }).firstPage();

     
      if (records.length > 0) {
          return records[0].id;
      }

      console.warn('No matching UserId found for the provided SessionKey.');
      return null;
  } catch (error) {
      console.error('Error fetching UserId from Airtable UserData table:', error);
      return null;
  }
}


