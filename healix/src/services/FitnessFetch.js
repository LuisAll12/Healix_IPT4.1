import Airtable from 'airtable';
import { getSessionKeyFromCookies } from './GetSessionKey.js';

const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const fitnessTable = "FitnessActivity"; 
const base = new Airtable({ apiKey }).base(baseId);

export async function fetchMostTrainedMuscle() {
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
            console.log('No user found for the given session key!');
            return null;
        }

        const userRecord = usersQuery[0];
        const userNumber = userRecord.fields.UserId;

        const fitnessQuery = await base(fitnessTable)
            .select({
                filterByFormula: `{UserData} = "${userNumber}"`,
            })
            .all();

        const muscleCounts = {};
        fitnessQuery.forEach(record => {
            const muscle = record.fields.Muscle;
            if (muscle) {
                muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 1;
            }
        });

        const mostTrainedMuscle = Object.entries(muscleCounts).reduce((a, b) => b[1] > a[1] ? b : a, [null, 0]);
        return { muscle: mostTrainedMuscle[0], count: mostTrainedMuscle[1] };
    } catch (error) {
        console.error('Error fetching most trained muscle:', error);
        return null;
    }
}


export async function fetchAverageCardioDuration() {
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

        const filterFormula = `
            AND(
                {UserData} = "${userNumber}",
                {Category} = "cardio"
            )
        `;

        const cardioQuery = await base(fitnessTable)
            .select({
                filterByFormula: filterFormula,
            })
            .all();

        const totalDuration = cardioQuery.reduce((sum, record) => {
            const duration = record.fields.Duration;
            const [hours, minutes] = duration.split(':').map(Number);
            return sum + hours * 60 + minutes; 
        }, 0);

        const averageDurationInMinutes = totalDuration / cardioQuery.length;

        const avgHours = Math.floor(averageDurationInMinutes / 60);
        const avgMinutes = Math.round(averageDurationInMinutes % 60);
        const formattedDuration = `${String(avgHours).padStart(2, '0')}:${String(avgMinutes).padStart(2, '0')}`;

        return formattedDuration ;
    } catch (error) {
        console.error('Error calculating average cardio duration:', error);
        return null;
    }
}


export async function fetchBurntCaloriesLastCardio() {
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
        const userWeight = userRecord.fields.Weight; 

        const filterFormula = `
            AND(
                {UserData} = "${userNumber}",
                {Category} = "cardio"
            )
        `;

        const cardioQuery = await base(fitnessTable)
            .select({
                filterByFormula: filterFormula,
                sort: [{ field: "CreateDate", direction: "desc" }],
                maxRecords: 1,
            })
            .firstPage();

        if (cardioQuery.length === 0) {
            return null;
        }

        const lastCardio = cardioQuery[0];
        const duration = lastCardio.fields.Duration; 
        const intensity = lastCardio.fields.Intensity;

        const [hours, minutes] = duration.split(':').map(Number);
        const totalHours = hours + minutes / 60;

        const MET = intensity === 1 ? 2.0 : intensity === 2 ? 4.5 : 8.0;
        const burntCalories = MET * userWeight * totalHours;

        return burntCalories.toFixed(2); 
    } catch (error) {
        console.error('Error calculating burnt calories for last cardio:', error);
        return null;
    }
}




export async function fetchBMR() {
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
        const weight = parseFloat(userRecord.fields.Weight);
        const height = parseFloat(userRecord.fields.Height) * 100;
        const birthDate = new Date(userRecord.fields.BirthDate);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        const gender = userRecord.fields.Gender;

        let bmr;
        if (gender === "male") {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        return  bmr.toFixed(2) ;
    } catch (error) {
        console.error('Error calculating BMR:', error);
        return null;
    }
}

