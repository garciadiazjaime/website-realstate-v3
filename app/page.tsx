'use client';


import Filters from '@/app/features/places/components/Filters';
import PlacesTable from '@/app/features/places/components/PlacesTable';
import LoadableMap from "@/app/features/places/components/Map";
import { PlacesProvider } from "@/app/features/places/context/PlacesContext";
import Summary from "@/app/features/places/components/Summary";
import ZipCodes from "@/app/features/places/components/ZipCodes";
import Agent from "@/app/features/places/components/Agent";
import Upload from "@/app/features/places/components/Upload";

export default function Home() {

  return (
    <PlacesProvider>
      <>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ maxWidth: "30%", display: "flex", flexDirection: "column", gap: 16, height: "100vh" }}>

            <div style={{ overflow: "scroll", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#FFFFFF", padding: 16 }}>
              <Upload />
            </div>

            <div style={{ overflow: "scroll", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#FFFFFF", padding: 16 }}>
              <Filters />
            </div>

            <div style={{ overflow: "scroll", height: "100%", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#FFFFFF", padding: 16 }}>
              <Agent />
            </div>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: "100%",
            height: "100vh",
          }}>

            <div style={{
              height: 400,
              backgroundColor: "#FFFFFF",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: 16,
            }}>
              <LoadableMap />
            </div>

            <div style={{ height: 400, overflowY: "scroll", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#FFFFFF", padding: "0 16px" }}>
              <PlacesTable />
            </div>

            <div style={{ overflowY: "scroll", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#FFFFFF", padding: 16 }}>
              <Summary />
            </div>

            <div style={{ height: 400, overflowY: "scroll", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#FFFFFF", padding: 16 }}>
              <ZipCodes />
            </div>
          </div>
        </div>
      </>
    </PlacesProvider>
  );
}
