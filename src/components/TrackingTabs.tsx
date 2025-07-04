"use client";

import { useState } from "react";
import ImageViewer from "@/components/ImageViewer";
import RouteTable from "@/components/RouteTable";

interface RoutePoint {
  lat: number;
  lon: number;
  time: string;
  addr: string;
  speed?: number;
}

interface TrackingTabsProps {
  routePoints: RoutePoint[];
  contentType: string;
  captureDatain?: string;
  captureDataout?: string;
  ticketID: string;
  vehicleNo: string;
  vehiclePlate: string;
  startdate: string;
  enddate: string;
}

type TabKey = "description" | "images" | "table";

const TrackingTabs = ({
  routePoints,
  contentType,
  captureDatain,
  captureDataout,
  ticketID,
  vehicleNo,
  vehiclePlate,
  startdate,
  enddate,
}: TrackingTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const TabButton = ({ tab, label }: { tab: TabKey; label: string }) => (
    <button
      className={`btn btn-sm sm:btn-md rounded-none flex-1 ${
        activeTab === tab ? "btn-primary" : "btn-outline"
      }`}
      onClick={() => setActiveTab(tab)}
    >
      {label}
    </button>
  );
  return (
    <div className="space-y-4">
      {/* Tab Buttons */}
      <div className="flex gap-2 w-full">
        <TabButton tab="description" label="Description" />
        <TabButton tab="images" label="Images" />
        <TabButton tab="table" label="Route Table" />
      </div>

      {/* Tab Content */}
      {activeTab === "description" && (
        <div className="card bg-base-100 shadow-md p-4 space-y-2">
          <h2 className="font-bold text-lg mb-2">Description</h2>
          <p><span className="font-semibold text-info">Ticket ID:</span> {ticketID}</p>
          <p><span className="font-semibold text-info">Vehicle No:</span> {vehicleNo}</p>
          <p><span className="font-semibold text-info">Vehicle Plate:</span> {vehiclePlate}</p>
          <p><span className="font-semibold text-info">Start:</span> {new Date(startdate).toLocaleString()}</p>
          <p><span className="font-semibold text-info">End:</span> {new Date(enddate).toLocaleString()}</p>
        </div>
      )}

      {activeTab === "images" && (
        <div className="card bg-base-100 shadow-md p-4 space-y-4 overflow-auto">
          <h2 className="font-bold text-lg mb-2">Images</h2>
          {captureDatain && (
            <div>
              <p className="font-semibold mb-1">Capture In</p>
              <ImageViewer src={`data:${contentType};base64,${captureDatain}`} alt="Capture In" />
            </div>
          )}
          {captureDataout && (
            <div>
              <p className="font-semibold mb-1">Capture Out</p>
              <ImageViewer src={`data:${contentType};base64,${captureDataout}`} alt="Capture Out" />
            </div>
          )}
          {!captureDatain && !captureDataout && <p>No images available</p>}
        </div>
      )}

      {activeTab === "table" && (
        <div className="card bg-base-100 shadow-md p-4 overflow-auto">
          <h2 className="font-bold text-lg mb-2">Route Table</h2>
          <RouteTable points={routePoints} />
        </div>
      )}
    </div>
  );
};

export default TrackingTabs;

