# Vehicle Route Tracker

A web app for reviewing the route a company vehicle took on a trip. Pick a ticket, and the app draws the trip on a map, lists every recorded stop with its time, address and speed, and shows the photos captured when the trip started and ended.

Built during an internship at PT Sumatera Prima Fibreboard, where it was used to monitor 10–20 trucks per day across 4 checkpoints, replacing estimated departure and stop times with recorded ones.

## What it does

- **Ticket lookup** — the home page lists every ticket in the database; selecting one opens `/tracking/[ticketID]`.
- **Route map** — the trip's driving segments are plotted on an interactive [Leaflet](https://leafletjs.com) map.
- **Route table** — each point with its timestamp, address and average speed, ordered chronologically.
- **Start / end photos** — images captured at departure and arrival, stored in the database and shown in an image viewer.
- **Description tab** — vehicle number, plate and trip start/end dates.

## How it works

The trip data comes from a vehicle GPS provider's JSON export, stored in MongoDB as the `easyGo` field of each ticket (see `src/models/Tracking.ts`). The API route `src/app/api/tracking/[ticketID]/route.ts`:

1. Loads the ticket by ID.
2. Parses the export (it may arrive as an object or a JSON string) and keeps only the `Driving` segments.
3. Flattens them into `{ lat, lon, time, addr, speed }` points, sorted by time.
4. Converts the stored start/end image buffers to base64 so the browser can display them.

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 + daisyUI · MongoDB with Mongoose · React Leaflet · Geolib

## Running locally

You need Node.js 18+ and a MongoDB database that holds tracking documents in the shape described by `src/models/Tracking.ts`. The collection is named `capture`.

```bash
npm install
```

Create `.env.local`:

```
MONGODB_URI=mongodb://localhost:27017/your-database
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

```bash
npm run dev
```

Open <http://localhost:3000>.

## Project structure

```
src/
├── app/
│   ├── page.tsx                      # Ticket selector
│   ├── tracking/[ticketID]/page.tsx  # Trip view (map, table, images)
│   └── api/tracking/[ticketID]/      # Reads a ticket and returns route points
├── components/                       # Map, RouteTable, TrackingTabs, ImageViewer, ...
├── lib/mongodb.ts                    # Cached MongoDB connection (survives hot reloads)
└── models/Tracking.ts                # Mongoose schema
```

## Notes

- The data source is the company's GPS export, which is not included, so the app shows no tickets until you add documents of your own.
- This is an internal tool: there is no login, so do not expose it to the public internet with real vehicle data.
