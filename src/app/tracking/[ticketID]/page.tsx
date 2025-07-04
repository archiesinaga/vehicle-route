import Link from 'next/link';
import TrackingTabs from '@/components/TrackingTabs';

interface RoutePoint {
  lat: number;
  lon: number;
  time: string;
  addr: string;
  distance?: number;
}

interface TrackingData {
  ticketID: string;
  vehicleNo: string;
  vehiclePlate: string;
  startdate: string;
  enddate: string;
  routePoints: { lat: number; lon: number; time: string; addr: string; }[];
  contentType: string;
  captureDatain: string;
  captureDataout: string;
}

async function fetchTrackingData(ticketID: string): Promise<TrackingData | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tracking/${ticketID}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

const REF_LAT = -3.1862399;
const REF_LON = 104.673968;

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default async function TrackingPage({ params }: { params: Promise<{ ticketID: string }> }) {
  const { ticketID } = await params;
  const trackingData = await fetchTrackingData(ticketID);

  if (!trackingData) {
    return <div>Error: Tracking data not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 bg-gradient-to-br from-base-200 to-base-100 rounded-box shadow-lg">
      <Link href="/" className="btn btn-sm btn-primary mb-2"><span className="mr-1">←</span> Back</Link>
      <h1 className="text-3xl font-extrabold text-center text-primary mb-6">Vehicle Route Detail</h1>
      
      {/* Description moved into TrackingTbas*/}
      <TrackingTabs
      routePoints={trackingData.routePoints.map((p) => ({
        ...p,
        distance: haversineDistance(p.lat, p.lon, REF_LAT, REF_LON),
      }))}
      contentType={trackingData.contentType}
      captureDatain={trackingData.captureDatain}
      captureDataout={trackingData.captureDataout}
      ticketID={trackingData.ticketID}
      vehicleNo={trackingData.vehicleNo}
      vehiclePlate={trackingData.vehiclePlate}
      startdate={trackingData.startdate}
      enddate={trackingData.enddate}
      />

    </div>
  );
}