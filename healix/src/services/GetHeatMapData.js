import Airtable from 'airtable';
import { getSessionKeyFromCookies } from './GetSessionKey.js';

// Airtable configuration
const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const fitnessTable = "FitnessActivity";
const base = new Airtable({ apiKey }).base(baseId);

export async function fetchActivityLevelsForMonth() {
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

        if (usersQuery.length === 0) {
            console.log('No user found for the given session key!');
            return null;
        }

        const userRecord = usersQuery[0];
        const userNumber = userRecord.fields.UserId;

        // Step 2: Fetch activity data for the current month
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

        const filterFormula = `
            AND(
                {UserData} = "${userNumber}",
                IS_AFTER({CreateDate}, "${startOfMonth}"),
                IS_BEFORE({CreateDate}, "${endOfMonth}")
            )
        `;

        const activityQuery = await base(fitnessTable)
            .select({
                filterByFormula: filterFormula,
                fields: ["CreateDate"],
                sort: [{ field: "CreateDate", direction: "asc" }]
            })
            .all();

        if (activityQuery.length === 0) {
            console.log('No activity data found for this user this month!');
            return [];
        }

        // Step 3: Group activity by day
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const activityCounts = Array(daysInMonth).fill(0);

        activityQuery.forEach(record => {
            const date = new Date(record.fields.CreateDate);
            const day = date.getDate();
            activityCounts[day - 1] += 1; // Increment count for the specific day
        });

        // Step 4: Map activity counts to levels
        const getStatus = (count) => {
            if (count === 0) return 'none';
            if (count === 1) return 'low';
            if (count === 2) return 'medium';
            if (count === 3) return 'high';
            if (count >= 4) return 'best';
        };

        const activityLevels = activityCounts.map(getStatus);

        // Step 5: Group days into weeks (rows with max 7 items)
        const rows = [];
        for (let i = 0; i < activityLevels.length; i += 7) {
            rows.push(activityLevels.slice(i, i + 7));
        }
        console.log(rows.map((row, rowIndex) => ({ rowIndex, cells: row })))
        return rows.map((row, rowIndex) => ({ rowIndex, cells: row })); // Add rowIndex
    } catch (error) {
        console.error('Error fetching activity levels from Airtable:', error);
        return null;
    }
}

