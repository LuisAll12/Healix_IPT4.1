import Airtable from 'airtable';
import { getSessionKeyFromCookies } from './GetSessionKey.js';

// Airtable configuration
const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const fitnessTable = "FitnessActivity"; 
const base = new Airtable({ apiKey }).base(baseId);

export async function fetchUserStepsInMonth() {
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

        const userRecord = usersQuery[0];
        const userId = userRecord.id;

        // Step 2: Generate current year and month
        const currentDate = new Date();
        const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        console.log("Current year-month:", currentYearMonth);

        // Step 3: Log all fitness records for debugging
        const allFitnessRecords = await base(fitnessTable).select().all();
        console.log("All FitnessActivity Records:", allFitnessRecords);

        // Step 4: Check records for the user without date filter
        const userOnlyFilter = `{UserData} = "${userId}"`;
        const userFitnessRecords = await base(fitnessTable)
            .select({
                filterByFormula: userOnlyFilter,
            })
            .all();
        console.log("Records Matching User:", userFitnessRecords);

        // Log CreateDate fields for these records
        userFitnessRecords.forEach(record => {
            console.log("Record CreateDate:", record.fields.CreateDate);
        });

        // Step 5: Query records for the user for the current month
        const filterFormula = `
            AND(
                {UserData} = "${userId}",
                DATETIME_FORMAT({CreateDate}, "YYYY-MM") = "${currentYearMonth}"
            )
        `;
        console.log("User ID:", userId);
        console.log("Generated filter formula:", filterFormula);

        const fitnessQuery = await base(fitnessTable)
            .select({
                filterByFormula: filterFormula,
            })
            .all();

        console.log("Fitness Query Result:", fitnessQuery);

        if (fitnessQuery.length === 0) {
            console.log('No fitness activities found for this user this month.');
            return { totalSteps: 0 };
        }

        // Calculate total steps
        const totalSteps = fitnessQuery.reduce((sum, record) => {
            const steps = parseInt(record.fields['Steps'], 10) || 0;
            return sum + steps;
        }, 0);

        console.log(`Total steps for user this month: ${totalSteps}`);
        return { totalSteps };

    } catch (error) {
        console.error('Error fetching data from Airtable:', error);
        return null;
    }
}
