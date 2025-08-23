"use client";

import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from "react";

import { Place } from "@/app/types";

type PlacesContextType = {
    mapLoaded: boolean;

    selectedPlaceId: number | null;
    setSelectedPlaceId: (placeId: number) => void;

    setMapLoaded: (loaded: boolean) => void;
    places: Place[];
    setPlaces: (places: Place[]) => void;
    visiblePlaces: Place[];
    setVisiblePlaces: (places: Place[]) => void;
    visibleFilteredPlaces: Place[];
    setVisibleFilteredPlaces: (places: Place[]) => void;

    // filters
    minPrice: number;
    setMinPrice: (price: number) => void;
    maxPrice: number;
    setMaxPrice: (price: number) => void;

    minPlacePrice: number;
    setPlaceMinPrice: (price: number) => void;
    maxPlacePrice: number;
    setPlaceMaxPrice: (price: number) => void;
};

const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

export const PlacesProvider = ({ children }: { children: ReactNode }) => {
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);

    const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

    const [places, setPlaces] = useState<Place[]>([]);
    const [visiblePlaces, setVisiblePlaces] = useState<Place[]>([]);
    const [visibleFilteredPlaces, setVisibleFilteredPlaces] = useState<Place[]>(
        []
    );

    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(500_000);

    const [minPlacePrice, setPlaceMinPrice] = useState<number>(0);
    const [maxPlacePrice, setPlaceMaxPrice] = useState<number>(500_000);

    useEffect(() => {
        if (!mapLoaded) {
            console.warn("Map is not loaded yet, skipping filter update.");
            return; // Skip filter update if map is not loaded
        }

        const filtered = visiblePlaces.filter(
            (place) => place.price >= minPrice && place.price <= maxPrice
        );

        setVisibleFilteredPlaces(filtered);
    }, [minPrice, maxPrice, mapLoaded, visiblePlaces]);

    useEffect(() => {
        setVisibleFilteredPlaces(visiblePlaces);
    }, [visiblePlaces]);

    return (
        <PlacesContext.Provider
            value={{
                mapLoaded,
                setMapLoaded,

                selectedPlaceId,
                setSelectedPlaceId,

                places,
                setPlaces,
                visiblePlaces,
                setVisiblePlaces,
                visibleFilteredPlaces,
                setVisibleFilteredPlaces,

                // filters
                minPrice,
                setMinPrice,
                maxPrice,
                setMaxPrice,

                // min and max price for places
                minPlacePrice,
                setPlaceMinPrice,
                maxPlacePrice,
                setPlaceMaxPrice,
            }}
        >
            {children}
        </PlacesContext.Provider>
    );
};

export const usePlaces = () => {
    const context = useContext(PlacesContext);
    if (!context) {
        throw new Error("usePlaces must be used within a PlacesProvider");
    }
    return context;
};
