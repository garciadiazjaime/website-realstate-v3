"use client";
import { useEffect, useState } from "react";

import { usePlaces } from "@/app/features/places/context/PlacesContext";

const STEP = 10_000;

export default function Filters() {
    const { minPrice, setMinPrice, maxPrice, setMaxPrice, minPlacePrice, maxPlacePrice } =
        usePlaces();

    const [maxStep, setMaxStep] = useState(STEP);

    useEffect(() => {
        const range = maxPrice - minPrice;
        const newMaxStep = range % STEP === 0 ? STEP : range / Math.ceil(range / STEP);
        setMaxStep(newMaxStep);
    }, [maxPrice, minPrice]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
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
                step={maxStep}
                value={maxPrice}
                onChange={(e) => {
                    if (Number(e.target.value) > minPrice) {
                        setMaxPrice(Number(e.target.value));
                    }
                }}
                style={rangeStyle}
            />
        </div>
    );
}

const rangeStyle = {
    width: "100%",
};
