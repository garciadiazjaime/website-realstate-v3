"use client";

import { usePlaces } from "@/app/features/places/context/PlacesContext";
import { populateDatabase, setPlacesFromDatabase } from "@/app/features/places/utils/database";

export default function Filters() {
    const { setPlaces, minPrice, setMinPrice, maxPrice, setMaxPrice, minPlacePrice, maxPlacePrice } =
        usePlaces();

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

    const rangeStyle = {
        width: "100%",
    };

    return (
        <div
            style={{
                display: "flex",
                backgroundColor: "white",
                marginBottom: 16,
                padding: 16,
                gap: 60
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    width: "80vw",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "80%",
                    }}
                >
                    <span>Min: ${minPrice.toLocaleString()}</span>
                    <span>Max: ${maxPrice.toLocaleString()}</span>
                </div>
                <input
                    type="range"
                    min={minPlacePrice}
                    max={maxPlacePrice}
                    step="10000"
                    value={minPrice}
                    onChange={(e) => {
                        if (Number(e.target.value) < maxPrice) {
                            setMinPrice(Number(e.target.value));
                        }
                    }}
                    style={rangeStyle}
                />
                <input
                    type="range"
                    min={minPlacePrice}
                    max={maxPlacePrice}
                    step="10000"
                    value={maxPrice}
                    onChange={(e) => {
                        if (Number(e.target.value) > minPrice) {
                            setMaxPrice(Number(e.target.value));
                        }
                    }}
                    style={rangeStyle}
                />
            </div>
            <div style={{ overflowX: "scroll" }}>
                <label
                    htmlFor="csv-upload"
                    style={{ marginBottom: "8px", display: "block" }}
                >
                    Upload CSV File:
                </label>
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
            </div>
        </div>
    );
}
