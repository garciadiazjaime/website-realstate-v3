export default function AboutPage() {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>About This Application</h1>
                <p style={styles.text}>
                    Most of the code in this application was written by Copilot. I provided multiple prompts and made a few minor tweaks. This is the result of a couple of hours spent over the weekend.
                </p>

                <h2 style={styles.subtitle}>What does it do?</h2>
                <p style={styles.text}>
                    If you go to Redfin and search for properties for sale, Redfin provides a list that can be exported as a CSV file. This file can then be imported into this tool. The homepage gives a quick overview of the properties, focusing on price and offering tools like filters, summaries, and a map to better understand the market.
                </p>

                <h2 style={styles.subtitle}>Example</h2>
                <p style={styles.text}>
                    <li>Open this <a href="https://www.redfin.com/city/29470/IL/Chicago/filter/property-type=house+condo+townhouse,min-price=100k,max-price=400k,min-beds=2,max-beds=2,hoa=500,max-property-tax=10000,viewport=42.0889:41.79189:-87.44504:-87.96346,no-outline" target="_blank" style={styles.link}>link</a> and click "Download All".</li>
                </p>
                <div style={styles.imageContainer}>
                    <img src="/images/redfin-export.png" alt="Redfin Export Example" style={styles.image} />
                </div>
                <p style={styles.text}>
                    <li>After downloading the CSV file, you can upload it here to start exploring the data.</li>
                </p>
                <div style={styles.imageContainer}>
                    <img src="/images/initial-ui.png" alt="Initial UI Example" style={styles.image} />
                </div>
                <div style={styles.imageContainer}>
                    <img src="/images/data-loaded-ui.png" alt="Data Loaded UI Example" style={styles.image} />
                </div>

                <h2 style={styles.subtitle}>Get in Touch</h2>
                <p style={styles.text}>
                    For any inquiries, suggestions, or feedback, feel free to reach out via <a href="https://www.linkedin.com/in/jaimegd/" target="_blank" style={styles.link}>LinkedIn</a>.
                </p>

                <h2 style={styles.subtitle}>Disclaimer</h2>
                <p style={styles.text}>
                    I'm not sponsored by Redfin or Copilot, and I don't own any of the properties listed. This tool is purely for educational purposes and to demonstrate the capabilities of AI in coding.
                </p>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9F9F9",
        padding: "32px 16px",
        minHeight: "100vh",
    },
    content: {
        maxWidth: "800px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "24px",
        lineHeight: "1.6",
    },
    title: {
        fontSize: "32px",
        fontWeight: "bold",
        marginBottom: "16px",
        color: "#333",
    },
    subtitle: {
        fontSize: "24px",
        fontWeight: "600",
        margin: "24px 0 16px",
        color: "#555",
    },
    text: {
        fontSize: "16px",
        color: "#666",
        marginBottom: "16px",
    },
    link: {
        color: "#007BFF",
        textDecoration: "none",
    },
    imageContainer: {
        textAlign: "center",
        margin: "16px 0",
    },
    image: {
        maxWidth: "100%",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
};
