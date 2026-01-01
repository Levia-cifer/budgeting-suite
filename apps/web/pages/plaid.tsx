import React, { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

export default function PlaidDemo() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  async function getLinkToken() {
    const res = await fetch('http://localhost:4000/plaid/create_link_token', { method: 'POST' });
    const data = await res.json();
    setLinkToken(data.link_token);
  }

  const onSuccess = async (public_token: string, metadata: any) => {
    await fetch('http://localhost:4000/plaid/exchange_public_token', { method: 'POST', body: JSON.stringify({ public_token }), headers: { 'content-type': 'application/json' } });
    setConnected(true);
  };

  const config = {
    token: linkToken || undefined,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config as any);

  return (
    <div style={{ padding: 24 }}>
      <h1>Plaid demo</h1>
      <p>Use this demo to open Plaid Link (sandbox). Click Get link token first.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={getLinkToken}>Get link token</button>
        <button onClick={() => open()} disabled={!ready || !linkToken}>Open Link</button>
      </div>

      <div style={{ marginTop: 16 }}>
        {connected ? <div style={{ color: 'green' }}>Connected!</div> : <div style={{ color: 'gray' }}>Not connected</div>}
      </div>
    </div>
  );
}
