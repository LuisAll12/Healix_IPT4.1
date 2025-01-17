import Airtable from 'airtable';
import { getSessionKeyFromCookies } from './GetSessionKey.js';

const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const fitnessTable = "FitnessActivity";
const base = new Airtable({ apiKey }).base(baseId);

export async function fetchLastFourActivities() {
    try {
        const sessionKey = getSessionKeyFromCookies();
        if (!sessionKey) {
            console.log('Session key not found!');
            return null;
        }
        const usersTable = "UserData";
        const usersQuery = await base(usersTable)
            .select({
                filterByFormula: `{SessionKey} = "${sessionKey}"`,
                maxRecords: 1,
            })
            .firstPage();

        if (usersQuery.length === 0) {
            console.log('No user found for the given session key!');
            return null;
        }

        const userRecord = usersQuery[0];
        const userNumber = userRecord.fields.UserId;

        const filterFormula = `{UserData} = "${userNumber}"`;

        const activityQuery = await base(fitnessTable)
            .select({
                filterByFormula: `{UserData} = "1"`, // Extracted from the URL's filterByFormula
                fields: ["CreateDate", "Category", "Duration"], // You can adjust this to include required fields
                sort: [{ field: "CreateDate", direction: "desc" }], // Matches the URL sorting parameters
                maxRecords: 4, // Matches the URL maxRecords parameter
            })
            .all();


        if (activityQuery.length === 0) {
            console.log('No activity data found for this user!');
            return [];
        }

        const activities = activityQuery.map(record => ({
            id: record.id,
            createDate: record.fields.CreateDate,
            category: record.fields.Category,
            duration: record.fields.Duration,
        }));

        return activities;
    } catch (error) {
        console.error('Error fetching last 4 activities from Airtable:', error);
        return null;
    }
}
