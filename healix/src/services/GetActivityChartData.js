import Airtable from 'airtable';
import { getSessionKeyFromCookies } from './GetSessionKey.js';

// Airtable configuration
const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const fitnessTable = "FitnessActivity";
const base = new Airtable({ apiKey }).base(baseId);

export async function fetchStepsGroupedByWeekAndMonth() {
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

        const currentDate = new Date();
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1).toISOString();
        const endOfYear = new Date(currentDate.getFullYear(), 11, 31).toISOString();

        const filterFormula = `
            AND(
                {UserData} = "${userNumber}",
                {Category} = "cardio",
                IS_AFTER({CreateDate}, "${startOfYear}"),
                IS_BEFORE({CreateDate}, "${endOfYear}")
            )
        `;

        const fitnessQuery = await base(fitnessTable)
            .select({
                filterByFormula: filterFormula,
                fields: ["Steps", "CreateDate"],  
                sort: [{ field: "CreateDate", direction: "asc" }]  
            })
            .all();

        if (fitnessQuery.length === 0) {
            console.log('No step data found for this user this year!');
            return {
                monthlyData: [],
                weeklyData: []
            };
        }
        const stepsData = fitnessQuery.map(record => ({
            steps: record.fields.Steps,
            date: new Date(record.fields.CreateDate) 
        }));
        const getWeekOfYear = (date) => {
            const start = new Date(date.getFullYear(), 0, 1);
            const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
            console.log(Math.ceil(diff / (7 * 24 * 60 * 60 * 1000)))
            return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
        };
        const weeks = {};
        const months = {};
        for (const entry of stepsData) {
            const week = `Week ${getWeekOfYear(entry.date)}`;
            const month = entry.date.toLocaleString('default', { month: 'short' });

            if (!weeks[week]) weeks[week] = 0;
            if (!months[month]) months[month] = 0;
            weeks[week] += entry.steps;
            months[month] += entry.steps;
        }

        const weeklyData = Object.entries(weeks).map(([label, totalSteps]) => ({ label, totalSteps }));
        const monthlyData = Object.entries(months).map(([label, totalSteps]) => ({ label, totalSteps }));

        return { weeklyData, monthlyData };
    } catch (error) {
        console.error('Error fetching step data from Airtable:', error);
        return null;
    }
}
