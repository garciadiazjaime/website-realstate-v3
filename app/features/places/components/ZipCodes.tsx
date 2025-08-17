'use client';

import { useEffect, useState } from 'react';

import { usePlaces } from "@/app/features/places/context/PlacesContext";

export default function Summary() {
    const {
        visibleFilteredPlaces: places,
    } = usePlaces();

    const [summary, setSummary] = useState<{
        zipCodeStats: Record<string, { count: number; minPrice: number; maxPrice: number; averagePrice: number }>;
    }>({
        zipCodeStats: {},
    });

    // Initialize sortConfig with "averagePrice" and "desc" direction
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
        key: 'averagePrice',
        direction: 'desc',
    });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                if (places.length > 0) {
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

                    setSummary({
                        zipCodeStats,
                    });
                }
            } catch (error) {
                console.error('Error fetching summary:', error);
            }
        };

        fetchSummary();
    }, [places]);

    const sortedZipCodeStats = Object.entries(summary.zipCodeStats)
        .sort(([zipA, statsA], [zipB, statsB]) => {
            if (!sortConfig) return 0;

            const { key, direction } = sortConfig;
            const compareValueA = key === 'zip' ? zipA : statsA[key as keyof typeof statsA];
            const compareValueB = key === 'zip' ? zipB : statsB[key as keyof typeof statsB];

            if (compareValueA < compareValueB) return direction === 'asc' ? -1 : 1;
            if (compareValueA > compareValueB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

    const handleSort = (key: string) => {
        setSortConfig((prevConfig) => {
            if (prevConfig?.key === key) {
                return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const getSortIcon = (key: string) => {
        if (sortConfig?.key === key) {
            return sortConfig.direction === 'asc' ? '▲' : '▼';
        }
        return '⇅';
    };

    return (
        <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '1.2rem', // Increased font size
        }}>
            <thead>
                <tr>
                    <th style={styles.tableHeader} onClick={() => handleSort('zip')}>
                        Zip {getSortIcon('zip')}
                    </th>
                    <th style={styles.tableHeader} onClick={() => handleSort('count')}>
                        Properties {getSortIcon('count')}
                    </th>
                    <th style={styles.tableHeader} onClick={() => handleSort('minPrice')}>
                        Min {getSortIcon('minPrice')}
                    </th>
                    <th style={styles.tableHeader} onClick={() => handleSort('maxPrice')}>
                        Max {getSortIcon('maxPrice')}
                    </th>
                    <th style={styles.tableHeader} onClick={() => handleSort('averagePrice')}>
                        Avg {getSortIcon('averagePrice')}
                    </th>
                </tr>
            </thead>
            <tbody>
                {sortedZipCodeStats.map(([zip, stats]) => (
                    <tr key={zip}>
                        <td style={styles.tableCell}>{zip}</td>
                        <td style={styles.tableCell}>{stats.count}</td>
                        <td style={styles.tableCell}>${stats.minPrice.toLocaleString()}</td>
                        <td style={styles.tableCell}>${stats.maxPrice.toLocaleString()}</td>
                        <td style={styles.tableCell}>${stats.averagePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    </tr>
                ))}
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
