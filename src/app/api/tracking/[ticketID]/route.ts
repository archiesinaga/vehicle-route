import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tracking from '@/models/Tracking';

export async function GET(
  req: NextRequest,
  context: { params: { ticketID: string } }
) {
  // `params` is now a Promise in Next.js 15+, so we need to await it before usage
  const { ticketID } = await context.params;

  try {
    await connectDB();
    const trackingData = await Tracking.findOne({ ticketID });

    if (!trackingData) {
      return NextResponse.json({ error: 'Tracking data not found' }, { status: 404 });
    }

    // Type definitions to satisfy ESLint and improve type-safety
interface Moving {
  start_detail: { lat: number; lon: number; addr: string };
  start_time: string;
  avg_speed?: number;
}

interface Driving {
  ListMoving?: Moving[];
  start_detail?: { lat: number; lon: number; addr: string };
  avg_speed?: number;
}

interface Segment {
  status: string;
  driving?: Driving;
  start_time?: string;
}

// Helper: convert Buffer or BSON Binary to Base64 string
  function toBase64(data: any): string {
    if (!data) return '';
    if (Buffer.isBuffer(data)) return data.toString('base64');
    // If Mongo returns a BSON Binary object (has .buffer)
    if (data.buffer) return Buffer.from(data.buffer).toString('base64');
    return '';
  }

  // Parse easyGo which may be stored as a JSON string and gracefully handle missing fields
  const easyGo: any =
    typeof (trackingData as any).easyGo === 'string'
      ? JSON.parse((trackingData as any).easyGo)
      : (trackingData as any).easyGo;

  const segments: Segment[] = (easyGo?.Data ?? []) as Segment[];

  const routePoints = segments
    .filter((seg) => seg.status === 'Driving')
    .flatMap((seg) => {
      if (seg.driving?.ListMoving && seg.driving.ListMoving.length > 0) {
        return seg.driving.ListMoving.map((mv) => ({
          lat: mv.start_detail.lat,
          lon: mv.start_detail.lon,
          time: mv.start_time,
          addr: mv.start_detail.addr,
          speed: mv.avg_speed ?? null,
        }));
      }

      if (seg.driving?.start_detail) {
        return [
          {
            lat: seg.driving.start_detail.lat,
            lon: seg.driving.start_detail.lon,
            time: seg.start_time ?? (trackingData as any).startdate,
            addr: seg.driving.start_detail.addr,
            speed: seg.driving.avg_speed ?? null,
          },
        ];
      }

      return [];
    });


    const captureDatain = toBase64((trackingData as any).captureDatain);
    const captureDataout = toBase64((trackingData as any).captureDataout);

    return NextResponse.json({
      ticketID: trackingData.ticketID,
      vehicleNo: trackingData.vehicleno,
      vehiclePlate: trackingData.vehiclenoplate,
      startdate: trackingData.startdate,
      enddate: trackingData.enddate,
      contentType: trackingData.contentType || 'image/jpeg',
      captureDatain,
      captureDataout,
      // Ensure route points are always ordered chronologically by their timestamp
      routePoints: routePoints.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch tracking data' }, { status: 500 });
  }
}