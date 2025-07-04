'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

type RoutePoint = {
  lat: number;
  lon: number;
  time: string;
  addr: string;
  speed?: number;
};

const MapWrapper = ({ routePoints }: { routePoints: RoutePoint[] }) => {
  return <Map routePoints={routePoints} />;
};

export default MapWrapper;