import Airtable from 'airtable';
import { getSessionKeyFromCookies } from './GetSessionKey.js';

// Airtable configuration
const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const Table = "UserData"; // Assuming 'UserData' is the name of your table
const base = new Airtable({ apiKey }).base(baseId);

export async function getLoggedInUserData() {
    const sessionKey = getSessionKeyFromCookies();

    if (!sessionKey) {
        console.error("No session key found in cookies.");
        return null;
    }

    try {
        const records = await base(Table)
            .select({
                filterByFormula: `{SessionKey} = "${sessionKey}"`,
                maxRecords: 1
            })
            .firstPage();

        if (records.length > 0) {
            return records[0].fields; // Return the first matching user's data
        } else {
            console.warn("No user found with the provided session key.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching logged-in user data:", error);
        return null;
    }
}
