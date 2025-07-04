import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface RoutePoint {
  lat: number;
  lon: number;
  time: string;
  addr: string;
  speed?: number; // km/h
}

interface MapProps {
  routePoints: RoutePoint[];
}

export default function Map({ routePoints }: MapProps) {
  if (!routePoints || routePoints.length === 0) {
    return null;
  }

  const positions: LatLngExpression[] = routePoints.map(point => [point.lat, point.lon] as LatLngExpression);

  // Memoize custom icons so they are not recreated on every render
  const { startIcon, endIcon, waypointIcon } = useMemo(() => {
    function createPin(color: string) {
      return new L.Icon({
        iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=bus|${color}`,
        iconSize: [30, 50],
        iconAnchor: [15, 50],
        popupAnchor: [0, -45],
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    }
    return {
      startIcon: createPin('ff0000'), // red
      endIcon: createPin('0080ff'),   // blue
      waypointIcon: createPin('3cb043'), // green
    } as const;
  }, []);

  return (
    <MapContainer 
      bounds={L.latLngBounds(positions as [number, number][])} 
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline positions={positions} color="blue" weight={6} opacity={0.7} />
      {routePoints.map((point, index) => {
        let icon = waypointIcon;
        if (index === 0) icon = startIcon;
        else if (index === routePoints.length - 1) icon = endIcon;

        return (
          <Marker key={index} position={[point.lat, point.lon]} icon={icon}>
            <Popup>
              <div>
                <strong>{index === 0 ? 'Start' : index === routePoints.length - 1 ? 'End' : `Waypoint ${index}`}</strong><br />
                <strong>Time:</strong> {new Date(point.time).toLocaleString()}<br />
                <strong>Address:</strong> {point.addr}<br />

              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}