import Airtable from 'airtable';
import { getSessionKeyFromCookies } from './GetSessionKey.js';


// Airtable configuration
const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const usersTable = "tblVlzyXNO3hzLVRB"; // Table name for users
const fitnessTable = "FitnessActivity"; // Table name for fitness activities
const base = new Airtable({ apiKey }).base(baseId);

async function fetchUserStepsInMonth() {
  try {
    // Step 1: Get the session key from the imported function
    const sessionKey = getSessionKeyFromCookies();

    if (!sessionKey) {
      console.log('Session key not found!');
      return null;
    }

    // Step 2: Retrieve the user based on session key from the 'Users' table
    const usersQuery = await base(usersTable).select().all();
    console.log(usersQuery);
    const userRecord = usersQuery.find(record => record.fields['SessionKey'] === sessionKey);

    if (!userRecord) {
      console.log('User not found for the given session key!');
      return null;
    }

    // Step 3: Get all fitness activities for that user from the 'FitnessActivity' table
    const fitnessQuery = await base(fitnessTable).select().all();
    const userStepsThisMonth = [];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Get the current month (0-11)
    const currentYear = currentDate.getFullYear(); // Get the current year

    // Filter the records based on the user and current month
    for (let activity of fitnessQuery) {
      const userId = activity.fields['User']; // Assuming 'User' is a linked record field
      const activityDate = new Date(activity.fields['Date']); // Assuming you have a 'Date' field for when the activity took place
      
      if (userId && userId[0].id === userRecord.id && activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear) {
        userStepsThisMonth.push(activity.fields['Steps']); // Assuming 'Steps' is the field containing step count
      }
    }

    // Calculate total steps
    const totalSteps = userStepsThisMonth.reduce((acc, steps) => acc + steps, 0);

    // Return the result
    return {
      userId: userRecord.id,
      totalSteps: totalSteps
    };
    
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    return null;
  }
}

export default fetchUserStepsInMonth;
