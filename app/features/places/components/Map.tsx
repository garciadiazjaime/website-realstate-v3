"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";

import { Place } from "@/app/types";
import { interpolateColor } from "@/app/features/places/utils/misc";
import { usePlaces } from "@/app/features/places/context/PlacesContext";
import { setPlacesFromDatabase } from "@/app/features/places/utils/database";


const Map = () => {
    const {
        places,
        setPlaces,
        visibleFilteredPlaces,
        visiblePlaces,
        setVisiblePlaces,
        setMapLoaded,
        selectedPlaceId,
        setSelectedPlaceId,
        setMinPrice,
        setMaxPrice,
        minPlacePrice,
        setPlaceMinPrice,
        maxPlacePrice,
        setPlaceMaxPrice,
    } = usePlaces();

    const mapRef = useRef<google.maps.Map | null>(null);
    const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
    const [drawingRectangle, setDrawingRectangle] = useState<google.maps.Rectangle | null>(null);
    const [startPoint, setStartPoint] = useState<google.maps.LatLng | null>(null);
    const [isMouseOverMap, setIsMouseOverMap] = useState(false); // Track if the mouse is over the map
    const [center, setCenter] = useState<{ lat: number; lng: number }>(getCenter(places));

    const updateVisiblePlaces = useCallback((drawingRectangle?: google.maps.Rectangle) => {
        if (!mapRef.current) {
            return;
        }

        const bounds = drawingRectangle ? drawingRectangle.getBounds() : mapRef.current.getBounds();
        if (bounds) {
            const extendedBounds = extendBounds(bounds, 0.000001); // Add padding to the bounds
            const visible = places.filter((place) =>
                extendedBounds.contains(new google.maps.LatLng(place.latitude, place.longitude))
            );
            setVisiblePlaces(visible);
        }
    }, [places, setVisiblePlaces]);

    const handleOnLoad = (map: google.maps.Map) => {
        mapRef.current = map;
        setMapLoaded(true);

        // Track mouse entering and leaving the map
        map.addListener("mouseover", () => setIsMouseOverMap(true));
        map.addListener("mouseout", () => setIsMouseOverMap(false));
    };

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const mousedownListener = map.addListener("mousedown", (e: google.maps.MapMouseEvent) => {
            if (!isDrawingEnabled || !isMouseOverMap) return;

            if (drawingRectangle) {
                drawingRectangle.setMap(null);
            }

            setStartPoint(e.latLng);
            const rectangle = new google.maps.Rectangle({
                map,
                bounds: new google.maps.LatLngBounds(e.latLng, e.latLng),
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.2,
            });
            setDrawingRectangle(rectangle);
        });

        const mousemoveListener = map.addListener("mousemove", (e: google.maps.MapMouseEvent) => {
            if (!isDrawingEnabled || !startPoint || !drawingRectangle || !isMouseOverMap) return;

            const bounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(
                    Math.min(startPoint.lat(), e.latLng?.lat() ?? startPoint.lat()),
                    Math.min(startPoint.lng(), e.latLng?.lng() ?? startPoint.lng())
                ),
                new google.maps.LatLng(
                    Math.max(startPoint.lat(), e.latLng?.lat() ?? startPoint.lat()),
                    Math.max(startPoint.lng(), e.latLng?.lng() ?? startPoint.lng())
                )
            );

            drawingRectangle.setBounds(bounds);
        });

        const mouseupHandler = () => {
            if (!isDrawingEnabled || !drawingRectangle || !isMouseOverMap) return;

            updateVisiblePlaces(drawingRectangle);
            setStartPoint(null);
        };

        window.addEventListener("mouseup", mouseupHandler);

        return () => {
            google.maps.event.removeListener(mousedownListener);
            google.maps.event.removeListener(mousemoveListener);
            window.removeEventListener("mouseup", mouseupHandler);
        };
    }, [isDrawingEnabled, startPoint, drawingRectangle, isMouseOverMap, updateVisiblePlaces]);

    const toggleDrawing = () => {
        if (!mapRef.current) return;

        const newDrawingState = !isDrawingEnabled;
        setIsDrawingEnabled(newDrawingState);
        mapRef.current.setOptions({ draggable: !newDrawingState });

        if (!newDrawingState) {
            drawingRectangle?.setMap(null);
            setDrawingRectangle(null);
            updateVisiblePlaces();
        }
    };

    const markerClickHandler = (place: Place) => {
        setSelectedPlaceId(place.mlsId);
    };

    useEffect(() => {
        if (places.length) {
            const newCenter = getCenter(places);
            setCenter(newCenter);
        }

        updateVisiblePlaces();
    }, [places, updateVisiblePlaces]);

    useEffect(() => {
        if (visiblePlaces.length) {
            const minPrice = Math.min(...visiblePlaces.map(place => place.price));
            const maxPrice = Math.max(...visiblePlaces.map(place => place.price));

            setMinPrice(minPrice);
            setMaxPrice(maxPrice);
            setPlaceMinPrice(minPrice);
            setPlaceMaxPrice(maxPrice);
        }
    }, [visiblePlaces, setMaxPrice, setMinPrice, setPlaceMaxPrice, setPlaceMinPrice])

    useEffect(() => {
        setPlacesFromDatabase(setPlaces);
    }, [setPlaces]);

    if (places.length === 0) {
        return <></>
    }

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* Drawing Toggle Button */}
            <button
                onClick={toggleDrawing}
                style={{
                    position: "absolute",
                    top: "55px",
                    right: "10px",
                    zIndex: 1000,
                    backgroundColor: isDrawingEnabled ? "#FFF" : "#CCC", // Change background color based on state
                    opacity: isDrawingEnabled ? 1 : 0.6,
                    border: "1px solid #bbb",
                    borderRadius: "4px",
                    padding: "10px", // Increased padding for larger size
                    cursor: "pointer",
                    fontSize: "1.2rem", // Increased font size for better visibility
                }}
                title={isDrawingEnabled ? "Disable Drawing" : "Enable Drawing"}
            >
                🖍️
            </button>

            <LoadScriptNext googleMapsApiKey={"test"}>
                <GoogleMap
                    mapContainerStyle={{
                        width: "100%",
                        height: "100%",
                    }}
                    center={center}
                    zoom={12}
                    onLoad={handleOnLoad}
                    onTilesLoaded={updateVisiblePlaces}
                    onCenterChanged={updateVisiblePlaces}
                    onZoomChanged={updateVisiblePlaces}
                >
                    {visibleFilteredPlaces.map((place, index) => (
                        <Marker
                            key={index}
                            position={{ lat: place.latitude, lng: place.longitude }}
                            title={place.address}
                            icon={getCustomIcon(place, selectedPlaceId, minPlacePrice, maxPlacePrice)}
                            onClick={() => markerClickHandler(place)}
                        />
                    ))}
                </GoogleMap>
            </LoadScriptNext>
        </div>
    );
};

const extendBounds = (bounds: google.maps.LatLngBounds, padding: number) => {
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    const extendedNorthEast = new google.maps.LatLng(
        northEast.lat() + padding,
        northEast.lng() + padding
    );
    const extendedSouthWest = new google.maps.LatLng(
        southWest.lat() - padding,
        southWest.lng() - padding
    );

    const extendedBounds = new google.maps.LatLngBounds(extendedSouthWest, extendedNorthEast);
    return extendedBounds;
};

const getCustomIcon = (place: Place, selectedPlaceId: number | null, minPlacePrice: number, maxPlacePrice: number) => {
    if (!window.google || !window.google.maps) {
        console.info("Google Maps API is not loaded.");
        return;
    }

    const attrs = getAttributes(place, selectedPlaceId, minPlacePrice, maxPlacePrice);
    return {
        url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="${attrs.size}" height="${attrs.size}" viewBox="0 0 ${attrs.size} ${attrs.size}" fill="${attrs.color}">
                <circle cx="${attrs.size / 2}" cy="${attrs.size / 2}" r="${attrs.r}" />
            </svg>
        `),
        scaledSize: new window.google.maps.Size(attrs.size, attrs.size), // Scale the icon size dynamically
    };
};

const getAttributes = (place: Place, selectedPlaceId: number | null, minPlacePrice: number, maxPlacePrice: number) => {
    const color = interpolateColor(place.price, minPlacePrice, maxPlacePrice);
    const r = 8;
    const times = 2;
    if (place.mlsId === selectedPlaceId) {
        return {
            r: r * times,
            size: 32 * times,
            color
        };
    }

    return {
        r,
        size: 32,
        color,
    };
};

const getCenter = (places: Place[]) => {
    if (places.length === 0) {
        return { lat: 0, lng: 0 }; // Default center if no places are provided
    }

    const totalLat = places.reduce((sum, place) => sum + place.latitude, 0);
    const totalLng = places.reduce((sum, place) => sum + place.longitude, 0);

    const centerLat = totalLat / places.length;
    const centerLng = totalLng / places.length;

    return { lat: centerLat, lng: centerLng };
};

export default Map;
