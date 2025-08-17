"use client";

import { useState } from "react";

import { Place } from "@/app/types";
import { interpolateColor } from "@/app/features/places/utils/misc";
import { usePlaces } from "@/app/features/places/context/PlacesContext";

export default function PlacesTable() {
    const {
        visibleFilteredPlaces,
        selectedPlaceId,
        setSelectedPlaceId,
        minPlacePrice,
        maxPlacePrice,
    } = usePlaces();

    // Initialize sortConfig with "price" and "desc" direction
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Place;
        direction: "asc" | "desc";
    }>({
        key: "price",
        direction: "desc",
    });

    const sortedPlaces = [...visibleFilteredPlaces].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;
        const valueA = a[key];
        const valueB = b[key];

        if (valueA == null || valueB == null) return 0;
        if (valueA < valueB) return direction === "asc" ? -1 : 1;
        if (valueA > valueB) return direction === "asc" ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof Place) => {
        setSortConfig((prevConfig) => {
            if (prevConfig?.key === key) {
                return {
                    key,
                    direction: prevConfig.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
    };

    const getSortIcon = (key: keyof Place) => {
        if (sortConfig?.key === key) {
            return sortConfig.direction === "asc" ? "▲" : "▼";
        }
        return "⇅";
    };

    const placeClickHandler = (place: Place) => {
        if (selectedPlaceId === place.mlsId) {
            setSelectedPlaceId(null);
            return;
        }

        setSelectedPlaceId(place.mlsId);
    };

    return (
        <div>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle} onClick={() => handleSort("price")}>
                            Price {getSortIcon("price")}
                        </th>
                        <th style={thStyle} onClick={() => handleSort("squareFeet")}>
                            Square Feet {getSortIcon("squareFeet")}
                        </th>
                        <th style={thStyle} onClick={() => handleSort("priceSquareFoot")}>
                            Price Square Feet {getSortIcon("priceSquareFoot")}
                        </th>
                        <th style={thStyle} onClick={() => handleSort("beds")}>
                            Beds {getSortIcon("beds")}
                        </th>
                        <th style={thStyle} onClick={() => handleSort("baths")}>
                            Baths {getSortIcon("baths")}
                        </th>
                        <th style={thStyle} onClick={() => handleSort("yearBuilt")}>
                            Year Built {getSortIcon("yearBuilt")}
                        </th>
                        <th style={thStyle} onClick={() => handleSort("daysOnMarket")}>
                            Days on Market {getSortIcon("daysOnMarket")}
                        </th>
                        <th style={thStyle} onClick={() => handleSort("hoaMonth")}>
                            HOA {getSortIcon("hoaMonth")}
                        </th>
                        <th style={thStyle} onClick={() => handleSort("zip")}>
                            Zip {getSortIcon("zip")}
                        </th>
                        <th style={thStyle} onClick={() => handleSort("zip")}>
                            MLS ID
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPlaces.map((place) => (
                        <tr
                            key={place.mlsId}
                            style={{
                                cursor: "pointer",
                                backgroundColor:
                                    selectedPlaceId === place.mlsId ? "#CCC" : "transparent",
                            }}
                            onClick={() => placeClickHandler(place)}
                            data-place-id={place.mlsId}
                        >
                            <td
                                style={{
                                    ...tdStyle,
                                    color: interpolateColor(
                                        place.price,
                                        minPlacePrice,
                                        maxPlacePrice
                                    ),
                                }}
                            >
                                <a
                                    href={place.url}
                                    target="_blank"
                                    style={{ textDecoration: "underline", fontWeight: "bold" }}
                                >
                                    ${place.price.toLocaleString()}
                                </a>
                            </td>
                            <td style={tdStyle}>{place.squareFeet}</td>
                            <td style={tdStyle}>{place.priceSquareFoot}</td>
                            <td style={tdStyle}>{place.beds}</td>
                            <td style={tdStyle}>{place.baths}</td>
                            <td style={tdStyle}>{place.yearBuilt}</td>
                            <td style={tdStyle}>{place.daysOnMarket}</td>
                            <td style={tdStyle}>{place.hoaMonth}</td>
                            <td style={tdStyle}>
                                <a
                                    href={`https://www.google.com/maps/place/${place.zip}`}
                                    target="_blank"
                                    style={{ textDecoration: "underline" }}
                                >
                                    {place.zip}
                                </a>
                            </td>
                            <td style={tdStyle}>
                                {place.mlsId}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "16px",
};

const thStyle: React.CSSProperties = {
    borderBottom: "2px solid #ddd",
    padding: "8px",
    textAlign: "left",
    cursor: "pointer", // Added cursor pointer for sortable headers
};

const tdStyle = {
    borderBottom: "1px solid #ddd",
    padding: "8px",
};
