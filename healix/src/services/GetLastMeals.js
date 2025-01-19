import Airtable from 'airtable';
import { getSessionKeyFromCookies } from './GetSessionKey.js';

const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const Table = "Meal";
const base = new Airtable({ apiKey }).base(baseId);

export async function fetchLastFiveMeals() {
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

        const activityQuery = await base(Table)
            .select({
                filterByFormula: `{UserData} = "${userNumber}"`, 
                fields: ["CreateDate", "Name", "calories", "Protein", "Fat", "ServingSize"], 
                sort: [{ field: "CreateDate", direction: "desc" }], 
                maxRecords: 4, 
            })
            .all();

        if (activityQuery.length === 0) {
            console.log('No meal data found for this user!');
            return [];
        }

        const meals = activityQuery.map(record => ({
            id: record.id,
            createDate: record.fields.CreateDate || null,
            name: record.fields.Name || "Unknown", 
            calories: record.fields.calories || 0, 
            protein: record.fields.Protein || 0, 
            fat: record.fields.Fat || 0, 
            servingSize: record.fields.ServingSize || "Not specified" 
        }));

        return meals;
    } catch (error) {
        console.error('Error fetching last 5 meals from Airtable:', error);
        return null;
    }
}
