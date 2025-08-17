"use client";

import { usePlaces } from "@/app/features/places/context/PlacesContext";
import { populateDatabase, setPlacesFromDatabase } from "@/app/features/places/utils/database";

export default function Filters() {
    const { setPlaces } = usePlaces();

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const fileInput = event.target; // Reference to the file input element
        const file = fileInput.files?.[0];
        if (file) {
            const text = await file.text();
            const rows = text.split("\n").map((row) => row.split(","));

            await populateDatabase(rows);
            setPlacesFromDatabase(setPlaces)

            fileInput.value = ""; // Clear the input to allow re-uploading the same file
        }
    };

    return (
        <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{
                padding: "8px",
                border: "1px solid #ccc",
                width: "100%"
            }}
        />
    );
}
