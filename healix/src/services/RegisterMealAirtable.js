import Airtable from 'airtable';

const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const MealTable = 'tbl9yimqa6jkxSZHx'; 
const base = new Airtable({ apiKey }).base(baseId);

export async function registerMeal(formData, sessionKey) {
    try {
        const userRecordId = await getUserIdFromSessionKey(sessionKey);

        if (!userRecordId) {
            throw new Error('User not found for the provided session key.');
        }

        const record = {
            Name: formData.Name,
            calories: formData.calories,
            Protein: formData.Protein,
            Fat: formData.Fat,
            Sugar: formData.Sugar,
            ServingSize: formData.ServingSize, 
            UserData: [userRecordId],
        };

        await base(MealTable).create([{ fields: record }]);
        console.log('Data successfully registered in Airtable!');
    } catch (error) {
        console.error('Error registering data in Airtable:', error);
        throw error; 
    }
}

async function getUserIdFromSessionKey(sessionKey) {
    try {
        const records = await base('UserData').select({
            filterByFormula: `{SessionKey} = '${sessionKey}'`,
        }).firstPage();

        if (records.length > 0) {
            return records[0].id;
        }

        console.warn('No matching UserId found for the provided session key.');
        return null;
    } catch (error) {
        console.error('Error fetching UserId from Airtable UserData table:', error);
        throw error;
    }
}
