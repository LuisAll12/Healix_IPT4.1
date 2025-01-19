import Airtable from 'airtable';
import { getSessionKeyFromCookies } from './GetSessionKey.js';

const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const fitnessTable = "FitnessActivity"; 
const base = new Airtable({ apiKey }).base(baseId);

export async function fetchCaloriesBurntToday() {
    try {
        const sessionKey = getSessionKeyFromCookies();
        if (!sessionKey) {
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
            return null;
        }

        const userRecord = usersQuery[0];
        const userNumber = userRecord.fields.UserId;
        const userWeight = userRecord.fields.Weight; // User's weight to calculate calories burnt

        // Get today's date to filter exercises done today
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        // Filter activities for today
        const filterFormula = `
            AND(
                {UserData} = "${userNumber}",
                {CreateDate} >= "${startOfDay}",
                {CreateDate} <= "${endOfDay}"
            )
        `;

        const fitnessQuery = await base(fitnessTable)
            .select({
                filterByFormula: filterFormula,
            })
            .all();

        // Calculate calories burnt
        const totalCaloriesBurnt = fitnessQuery.reduce((sum, record) => {
            const category = record.fields.Category; // Category (e.g., cardio, weight lifting)
            const duration = record.fields.Duration; // Duration of exercise
            const intensity = record.fields.Intensity; // Intensity level (if cardio)

            // Skip if duration or category is missing
            if (!duration || !category) {
                return sum;
            }

            // Convert duration to total hours
            const [hours, minutes] = duration.split(':').map(Number);
            const totalHours = hours + minutes / 60;

            // Calculate calories burnt based on category
            if (category === 'cardio') {
                const MET = intensity === 1 ? 2.0 : intensity === 2 ? 4.5 : 8.0;
                sum += MET * userWeight * totalHours;
            } else if (category === 'strength') {
                // For strength exercises (a rough estimate of calories burned)
                sum += (6.0 * userWeight * totalHours); // Example: MET of strength training (you can adjust this based on your data)
            }

            return sum;
        }, 0);

        return totalCaloriesBurnt.toFixed(2); // Return the total calories burnt for the day
    } catch (error) {
        console.error('Error fetching calories burnt today:', error);
        return null;
    }
}
