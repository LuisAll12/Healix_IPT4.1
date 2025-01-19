import Airtable from 'airtable';
import { getSessionKeyFromCookies } from './GetSessionKey.js';

const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const mealTable = "Meal";
const base = new Airtable({ apiKey }).base(baseId);

// Function to fetch total calories consumed today
export async function fetchCaloriesConsumedToday() {
    try {
        const sessionKey = getSessionKeyFromCookies();
        if (!sessionKey) {
            console.log('Session key not found!');
            return null;
        }

        // Fetch user data using the session key
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

        // Get today's date to filter meals
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        // Filter meals for today
        const filterFormula = `
            AND(
                {UserData} = "${userNumber}",
                {CreateDate} >= "${startOfDay}",
                {CreateDate} <= "${endOfDay}"
            )
        `;

        const mealQuery = await base(mealTable)
            .select({
                filterByFormula: filterFormula,
                fields: ["CreateDate", "calories"],  // Only fetching necessary fields
            })
            .all();

        if (mealQuery.length === 0) {
            console.log('No meals found for today!');
            return 0;  // No meals consumed today
        }

        // Calculate total calories consumed today
        const totalCalories = mealQuery.reduce((sum, record) => {
            const calories = record.fields.calories || 0;
            return sum + calories;
        }, 0);

        return totalCalories;  // Return the total calories consumed today
    } catch (error) {
        console.error('Error fetching calories consumed today:', error);
        return null;
    }
}

// Function to fetch total protein consumed today
export async function fetchProteinConsumedToday() {
    try {
        const sessionKey = getSessionKeyFromCookies();
        if (!sessionKey) {
            console.log('Session key not found!');
            return null;
        }

        // Fetch user data using the session key
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

        // Get today's date to filter meals
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        // Filter meals for today
        const filterFormula = `
            AND(
                {UserData} = "${userNumber}",
                {CreateDate} >= "${startOfDay}",
                {CreateDate} <= "${endOfDay}"
            )
        `;

        const mealQuery = await base(mealTable)
            .select({
                filterByFormula: filterFormula,
                fields: ["CreateDate", "Protein"],  // Only fetching necessary fields
            })
            .all();

        if (mealQuery.length === 0) {
            console.log('No meals found for today!');
            return 0;  // No meals consumed today
        }

        // Calculate total protein consumed today
        const totalProtein = mealQuery.reduce((sum, record) => {
            const protein = record.fields.Protein || 0;
            return sum + protein;
        }, 0);
        console.log(totalProtein)
        return totalProtein;  // Return the total protein consumed today
    } catch (error) {
        console.error('Error fetching protein consumed today:', error);
        return null;
    }
}
export async function fetchTodaysMealCount() {
    try {
        const sessionKey = getSessionKeyFromCookies();
        if (!sessionKey) {
            console.log('Session key not found!');
            return null;
        }

        // Fetch user data using the session key
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

        // Get today's date to filter meals
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        // Filter meals for today
        const filterFormula = `
            AND(
                {UserData} = "${userNumber}",
                {CreateDate} >= "${startOfDay}",
                {CreateDate} <= "${endOfDay}"
            )
        `;

        const mealQuery = await base(mealTable)
            .select({
                filterByFormula: filterFormula,
                fields: ["CreateDate"],  // Only fetching necessary fields
            })
            .all();

        // Return the count of meals registered today
        return mealQuery.length;
    } catch (error) {
        console.error('Error fetching meals count for today:', error);
        return null;
    }
}