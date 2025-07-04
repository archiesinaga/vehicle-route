"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TicketSelectorProps {
  tickets: string[];
}

const TicketSelector = ({ tickets }: TicketSelectorProps) => {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("");

  const handleGo = () => {
    if (selected) {
      router.push(`/tracking/${selected}`);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <select
        className="select select-bordered w-full"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="" disabled>
          Select Ticket ID
        </option>
        {tickets.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
      <button
        className="btn btn-primary w-full"
        disabled={!selected}
        onClick={handleGo}
      >
        View Route
      </button>
    </div>
  );
};

export default TicketSelector;
