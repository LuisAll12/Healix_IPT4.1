import Airtable from 'airtable';
import { getSessionKeyFromCookies } from './GetSessionKey.js';

// Airtable configuration
const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const fitnessTable = "FitnessActivity"; 
const base = new Airtable({ apiKey }).base(baseId);


export async function fetchWeightliftingEntriesCount() {
    try {
        const sessionKey = getSessionKeyFromCookies();
        if (!sessionKey) {
            console.log('Session key not found!');
            return null;
        }

        // Step 1: Find user by session key
        const usersTable = "UserData";
        const usersQuery = await base(usersTable)
            .select({
                filterByFormula: `{SessionKey} = "${sessionKey}"`,
                maxRecords: 1,
            })
            .firstPage();

        console.log("User Query Result:", usersQuery);

        if (usersQuery.length === 0) {
            console.log('No user found for the given session key!');
            return null;
        }
        const currentDate = new Date();
        const userRecord = usersQuery[0];
        const userId = userRecord.id;
        const userNumber = userRecord.fields.UserId;
        console.log(userRecord);
        const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        // Step 2: Query records for the user where category is "weightlifting"
        const filterFormula = `
            AND(
                {UserData} = "${userNumber}",
                {Category} = "weightlifting",
                {MonthNumber} = "${currentYearMonth}"
            )
        `;

        const fitnessQuery = await base(fitnessTable)
            .select({
                filterByFormula: filterFormula,
            })
            .all();

        console.log("Weightlifting Query Result:", fitnessQuery);

        // Return the count of entries
        const entryCount = fitnessQuery.length;

        console.log(`Total weightlifting entries for user: ${entryCount}`);
        return { entryCount };

    } catch (error) {
        console.error('Error fetching data from Airtable:', error);
        return null;
    }
}