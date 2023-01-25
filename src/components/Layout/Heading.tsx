import React from "react";

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-left text-3xl font-semibold text-white">
      {children}
    </h2>
  );
}

export default Heading;
