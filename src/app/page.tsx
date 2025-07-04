import connectDB from '@/lib/mongodb';
import Tracking from '@/models/Tracking';
import TicketSelector from '@/components/TicketSelector';
import Navbar from '@/components/Navbar';

interface TicketDoc {
  ticketID: string;
}

export default async function Home() {
  await connectDB();
  const tickets: TicketDoc[] = await Tracking.find().select('ticketID -_id').lean();

  const ticketIds = tickets.map((t) => t.ticketID);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero min-h-[calc(100vh-4rem)] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md w-full space-y-6">
            <h1 className="text-5xl font-bold">Vehicle Route Tracker</h1>
            <p className="py-2">Select a ticket to view its latest route.</p>
            <TicketSelector tickets={ticketIds} />
          </div>
        </div>
      </section>
    </>
  );
}