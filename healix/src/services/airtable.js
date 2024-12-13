const apiKey = "patImOYWAwodargRv.44d81f923227c3b20f152376445deda8718809f33d7827db1f0c73fc2ca50e45";
const baseId = "appkLsmbizlvsZx5c";
const tableName = "tblVlzyXNO3hzLVRB";

const airtableBaseURL = `https://api.airtable.com/v0/${baseId}/${tableName}`;

// Funktion, um alle Datensätze abzurufen
export const fetchRecords = async () => {
  try {
    const response = await fetch(airtableBaseURL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching records: ${response.statusText}`);
    }

    const data = await response.json();
    return data.records;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Funktion, um einen neuen Datensatz hinzuzufügen
export const addRecord = async (fields) => {
  try {
    const response = await fetch(airtableBaseURL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!response.ok) {
      throw new Error(`Error adding record: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Funktion, um einen Datensatz zu löschen
export const deleteRecord = async (id) => {
  try {
    const response = await fetch(`${airtableBaseURL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting record: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
