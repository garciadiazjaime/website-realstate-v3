"use client";

import { usePlaces } from "@/app/features/places/context/PlacesContext";

export default function Filters() {
    const { minPrice, setMinPrice, maxPrice, setMaxPrice, minPlacePrice, maxPlacePrice } =
        usePlaces();


    return (<div
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

    );
}

const rangeStyle = {
    width: "100%",
};
