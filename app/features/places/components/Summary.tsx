'use client';

import { useEffect, useState } from 'react';

import { usePlaces } from "@/app/features/places/context/PlacesContext";

export default function Summary() {
    const {
        visibleFilteredPlaces: places,
    } = usePlaces();

    const [summary, setSummary] = useState<{
        totalPlaces: number;
        averagePrice: number;
        averageSquareFeet: number;
        averageDaysOnMarket: number;
        averageHOA: number;
        zipCodeStats: Record<string, { count: number; minPrice: number; maxPrice: number; averagePrice: number }>;
        countByType: Record<string, number>;
    }>({
        totalPlaces: 0,
        averagePrice: 0,
        averageSquareFeet: 0,
        averageDaysOnMarket: 0,
        averageHOA: 0,
        zipCodeStats: {},
        countByType: {},
    });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                if (places.length > 0) {
                    const totalPlaces = places.length;
                    const totalPrice = places.reduce((sum, place) => sum + (place.price || 0), 0);
                    const totalSquareFeet = places.reduce((sum, place) => sum + (place.squareFeet || 0), 0);
                    const totalDaysOnMarket = places.reduce((sum, place) => sum + (place.daysOnMarket || 0), 0);
                    const totalHOA = places.reduce((sum, place) => sum + (place.hoaMonth || 0), 0);

                    const zipCodeStats = places.reduce((acc, place) => {
                        const zip = place.zip || 'Unknown';
                        const price = place.price || 0;

                        if (!acc[zip]) {
                            acc[zip] = {
                                count: 0,
                                minPrice: price,
                                maxPrice: price,
                                totalPrice: 0,
                                averagePrice: 0, // Added averagePrice to the type definition
                            };
                        }

                        acc[zip].count += 1;
                        acc[zip].minPrice = Math.min(acc[zip].minPrice, price);
                        acc[zip].maxPrice = Math.max(acc[zip].maxPrice, price);
                        acc[zip].totalPrice += price;

                        return acc;
                    }, {} as Record<string, { count: number; minPrice: number; maxPrice: number; totalPrice: number; averagePrice: number }>);

                    // Calculate average price for each zip code and exclude zip codes with less than 5 places
                    Object.keys(zipCodeStats).forEach((zip) => {
                        zipCodeStats[zip].averagePrice = zipCodeStats[zip].totalPrice / zipCodeStats[zip].count;
                    });

                    const countByType = places.reduce((acc, place) => {
                        const type = place.type || 'Unknown';
                        acc[type] = (acc[type] || 0) + 1;
                        return acc;
                    }, {} as Record<string, number>);

                    setSummary({
                        totalPlaces,
                        averagePrice: totalPrice / totalPlaces,
                        averageSquareFeet: totalSquareFeet / totalPlaces,
                        averageDaysOnMarket: totalDaysOnMarket / totalPlaces,
                        averageHOA: totalHOA / totalPlaces,
                        zipCodeStats,
                        countByType,
                    });
                }
            } catch (error) {
                console.error('Error fetching summary:', error);
            }
        };

        fetchSummary();
    }, [places]);

    return (
        <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '1.2rem',
        }}>
            <thead>
                <tr>
                    <th style={styles.tableHeader}>Total Properties</th>
                    <th style={styles.tableHeader}>Average Price</th>
                    <th style={styles.tableHeader}>Average ft²</th>
                    <th style={styles.tableHeader}>Average Days on Market</th>
                    <th style={styles.tableHeader}>Average Monthly HOA</th>

                    {Object.entries(summary.countByType).map(([type]) => (
                        <th style={styles.tableHeader} key={`header-${type}`}>{type}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={styles.tableCell}>{summary.totalPlaces}</td>

                    <td style={styles.tableCell}>${summary.averagePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>

                    <td style={styles.tableCell}>{summary.averageSquareFeet.toLocaleString(undefined, { maximumFractionDigits: 0 })} ft²</td>

                    <td style={styles.tableCell}>{summary.averageDaysOnMarket.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>

                    <td style={styles.tableCell}>${summary.averageHOA.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    {Object.entries(summary.countByType).map(([type, count]) => (
                        <td style={styles.tableCell} key={`cell-${type}`}>{count}</td>
                    ))}
                </tr>
            </tbody>
        </table>
    );
}

const styles: Record<string, React.CSSProperties> = {
    tableHeader: {
        borderBottom: "2px solid #ddd",
        padding: "8px",
        textAlign: "left",
        cursor: "pointer",
    },
    tableCell: {
        borderBottom: "1px solid #ddd",
        padding: "8px",
    },
};
