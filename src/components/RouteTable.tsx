"use client";

import React, { useState, useMemo } from "react";

interface RoutePoint {
  lat: number;
  lon: number;
  time: string;
  addr: string;
  distance?: number;
}

interface SortState {
  field: "time" | "distance";
  order: "asc" | "desc";
}

export default function RouteTable({ points }: { points: RoutePoint[] }) {
  const [sort, setSort] = useState<SortState>({ field: "time", order: "asc" });


  if (!points || points.length === 0) return null;

  const sortedPoints = useMemo(() => {
    const pts = [...points];
    pts.sort((a, b) => {
      let valA: number, valB: number;
      if (sort.field === "time") {
        valA = new Date(a.time).getTime();
        valB = new Date(b.time).getTime();
      } else {
        valA = a.distance ?? 0;
        valB = b.distance ?? 0;
      }
      return sort.order === "asc" ? valA - valB : valB - valA;
    });
    return pts;
  }, [points, sort]);

  const toggleSort = (field: "time" | "distance") => {
    setSort((prev: SortState) => {
      if (prev.field === field) {
        // toggle order
        return { field, order: prev.order === "asc" ? "desc" : "asc" };
    }
    // switch field, default to asc
    return { field, order: "asc" };
    });
  };

  const arrow = (field: "time" | "distance") => {
    if (sort.field !== field) return "";
    return sort.order === "asc" ? "↑" : "↓";
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="table table-zebra w-full text-sm">
        <thead>
          <tr>
            <th>#</th>
            <th className="cursor-pointer" onClick={() => toggleSort("time")}>Timestamp {arrow("time")}</th>
            <th>Address</th>
            <th className="text-right cursor-pointer" onClick={() => toggleSort("distance")}>Distance (km) {arrow("distance")}</th>
          </tr>
        </thead>
        <tbody>
          {sortedPoints.map((p: RoutePoint, idx: number) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{new Date(p.time).toLocaleString()}</td>
              <td>{p.addr}</td>
              <td className="text-right">{p.distance !== undefined ? p.distance.toFixed(2) : "-"}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
