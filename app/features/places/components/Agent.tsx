'use client'

import { useState } from "react";
import { handleQuestion } from "@/app/features/places/utils/aiAgent";
import { preprocessData } from "@/app/features/places/utils/database";
import { usePlaces } from "@/app/features/places/context/PlacesContext";

export default function Agent() {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const { places, setVisibleFilteredPlaces } = usePlaces();

    const handleSubmit = async () => {
        if (!question.trim()) {
            setResponse("Please enter a question.");
            return;
        }

        setLoading(true);
        try {
            const base64Data = await preprocessData();
            const aiResponse = await handleQuestion(question, base64Data);
            setResponse(aiResponse);
            const extractedPlaces = extractPlaces(aiResponse);
            const visiblePlaces = places.filter(place => extractedPlaces.includes(place.mlsId));
            console.log({ visiblePlaces, extractedPlaces, places })
            setVisibleFilteredPlaces(visiblePlaces)
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
                    lineHeight: "1.6",
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

const extractPlaces = (aiResponse: string): number[] => {
    // Regex to match "Place ID <number>" or "ID <number>" in various formats
    const placeIdRegex = /(?:Place ID|ID)[:\s]*[`]?(\d+)[`]?/g;
    const matches: number[] = [];
    let match;

    // Use regex to find all matches
    while ((match = placeIdRegex.exec(aiResponse)) !== null) {
        matches.push(+match[1]); // Extract the Place ID (group 1)
    }

    return matches; // Return an array of all Place IDs
};
