'use client'

import { useState } from "react";
import { handleQuestion } from "@/app/features/places/utils/aiAgent";
import { usePlaces } from "@/app/features/places/context/PlacesContext";
import { Place } from "@/app/types";

export default function Agent() {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const { visibleFilteredPlaces, setVisibleFilteredPlaces, setVisiblePlaces } = usePlaces();

    const handleSubmit = async () => {
        if (!question.trim()) {
            setResponse("Please enter a question.");
            return;
        }

        setLoading(true);
        try {
            const base64Data = await preprocessData(visibleFilteredPlaces);
            const aiResponse = await handleQuestion(question, base64Data);
            setResponse(aiResponse);

            const placeIds = getPlaceIds(aiResponse);
            const places = visibleFilteredPlaces.filter(place => placeIds.includes(place.mlsId));

            setVisiblePlaces(places);
            setVisibleFilteredPlaces(places)
        } catch (error) {
            console.error("Error handling question:", error);
            setResponse("An error occurred while processing your request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontSize: '1.2rem' }}>
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // Prevent adding a new line
                        handleSubmit(); // Call the submit function
                    }
                }}
                placeholder="Ask anything about the properties"
                rows={4}
                cols={50}
                style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    marginBottom: "10px",
                    resize: "none",
                    fontFamily: "'Arial', sans-serif",
                }}
                maxLength={500}
            />
            <br />
            <button onClick={handleSubmit} disabled={loading} style={styles.button}>
                {loading ? "Processing..." : "Ask AI"}
            </button>
            {response && (
                <div style={{
                    marginTop: "20px",
                    padding: "10px",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                    color: "#444",
                    lineHeight: "1.8",
                }} dangerouslySetInnerHTML={{ __html: response }}>
                </div>
            )}
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    button: {
        width: "100%",
        padding: "10px",
        fontSize: "16px",
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#007BFF",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
        cursor: "not-allowed",
    }
};

export const getPlaceIds = (aiResponse: string): number[] => {
    const placeIdRegex = /(<code>Place ID<\/code>:|<strong>Place ID<\/strong>:|<code>Place ID:|Place ID:)\s*(\d+)/g
    const matches: number[] = [];
    let match;
    while ((match = placeIdRegex.exec(aiResponse)) !== null) {
        matches.push(+match[2]); // Extract the Place ID (group 1) and convert to number
    }

    return matches; // Return an array of all Place IDs
};

const preprocessData = async (
    visibleFilteredPlaces: Place[]
): Promise<string> => {
    const data = visibleFilteredPlaces
        .map(
            (place: Place) =>
                `Place ID: ${place.mlsId}, Address: ${place.address}, Price: ${place.price}, Beds: ${place.beds}, Baths: ${place.baths}, Square Feet: ${place.squareFeet}, Zip Code: ${place.zip}`
        )
        .join("\n");
    const base64Data = Buffer.from(
        `Here is the data about properties:\n${data}`
    ).toString("base64");
    return base64Data;
};
