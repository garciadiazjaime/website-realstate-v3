'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Menu() {
    const pathname = usePathname(); // Get the current route

    return (
        <nav style={styles.nav}>
            <Link
                href="/"
                style={
                    pathname === '/'
                        ? { ...styles.navLink, ...styles.navLinkActive }
                        : styles.navLink
                }
            >
                Places
            </Link>
            <Link
                href="/about"
                style={
                    pathname === '/about'
                        ? { ...styles.navLink, ...styles.navLinkActive }
                        : styles.navLink
                }
            >
                About
            </Link>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#007BFF',
        padding: '12px 0',
        marginBottom: '16px',
    },
    navLink: {
        color: '#FFFFFF',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '16px',
        padding: '8px 16px',
        transition: 'background-color 0.3s',
    },
    navLinkActive: {
        backgroundColor: '#0056b3',
    },
};
