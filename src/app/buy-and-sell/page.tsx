import React, { Suspense } from "react";
import MarketplaceClient from "./MarketplaceClient";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading marketplace...</div>}>
      <MarketplaceClient />
    </Suspense>
  );
}