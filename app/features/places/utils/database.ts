import { Place } from "@/app/types";

export const openDatabase = (
  dbName: string,
  version: number,
  objectStoreName: string
) => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const dbRequest = indexedDB.open(dbName, version);

    dbRequest.onupgradeneeded = () => {
      const db = dbRequest.result;
      if (!db.objectStoreNames.contains(objectStoreName)) {
        db.createObjectStore(objectStoreName, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    dbRequest.onsuccess = () => {
      resolve(dbRequest.result);
    };

    dbRequest.onerror = (event) => {
      console.error("IndexedDB Error:", event);
      reject(new Error("Error opening IndexedDB"));
    };
  });
};

export const fetchAllRecords = (db: IDBDatabase, objectStoreName: string) => {
  return new Promise<Place[]>((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, "readonly");
    const store = transaction.objectStore(objectStoreName);

    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result as Place[]);
    };

    request.onerror = () => {
      reject([]);
    };
  });
};

const clearObjectStore = (db: IDBDatabase, objectStoreName: string) => {
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, "readwrite");
    const store = transaction.objectStore(objectStoreName);

    const clearRequest = store.clear();
    clearRequest.onsuccess = () => {
      resolve();
    };

    clearRequest.onerror = () => {
      reject(new Error("Error clearing object store"));
    };
  });
};

export const populateDatabase = async (rows: string[][]) => {
  try {
    const db = await openDatabase("PlacesDB", 1, "places");
    await clearObjectStore(db, "places");

    const parsedPlaces: Place[] = [];

    rows.forEach((row) => {
      if (!parseInt(row[22])) {
        console.warn("Skipping row with missing MLS ID:", row);
        return; // Skip rows without MLS ID
      }

      const place = {
        id: parseFloat(row[22]),
        type: row[2],
        address: row[3],
        city: row[4],
        state: row[5],
        zip: parseInt(row[6]),
        price: parseFloat(row[7]),
        beds: parseInt(row[8]),
        baths: parseFloat(row[9]),
        squareFeet: parseFloat(row[11]) || null,
        yearBuilt: parseInt(row[13]) || null,
        daysOnMarket: parseFloat(row[14]),
        priceSquareFoot: parseFloat(row[15]) || null,
        hoaMonth: parseFloat(row[16]) || null,
        status: row[17] === "Active",
        nextOpenHouseStartTime: row[18],
        nextOpenHouseEndTime: row[19],
        url: row[20],
        mlsId: parseFloat(row[22]),
        latitude: parseFloat(row[25]),
        longitude: parseFloat(row[26]),
      };
      const transaction = db.transaction("places", "readwrite");
      const store = transaction.objectStore("places");
      store.put(place);
      parsedPlaces.push(place);

      return place;
    });
  } catch (error) {
    console.error(error);
  }
};

export const setPlacesFromDatabase = async (
  setPlaces: (places: Place[]) => void
) => {
  try {
    const db = await openDatabase("PlacesDB", 1, "places");
    const data = await fetchAllRecords(db, "places");
    const sortedData = data.sort((a: Place, b: Place) => b.price - a.price);

    setPlaces(sortedData);
  } catch (error) {
    console.error(error);
  }
};

const getPlacesData = async (): Promise<string> => {
  const db = await openDatabase("PlacesDB", 1, "places");
  const places = await fetchAllRecords(db, "places");

  // Convert the data into a string format for LLaMA
  return places
    .map(
      (place: Place) =>
        `Place ID: ${place.mlsId}, Address: ${place.address}, Price: ${place.price}, Beds: ${place.beds}, Baths: ${place.baths}, Square Feet: ${place.squareFeet}`
    )
    .join("\n");
};

export const preprocessData = async (): Promise<string> => {
  const data = await getPlacesData();
  const base64Data = Buffer.from(
    `Here is the data about properties:\n${data}`
  ).toString("base64");
  return base64Data;
};
