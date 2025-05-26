import React from 'react';

/**
 * StubPage is a placeholder for missing pages/components in Storybook.
 * Replace this with the actual implementation when available.
 */
export default function StubPage({ name = "StubPage" }: { name?: string }) {
  return (
    <div style={{ padding: 32, textAlign: 'center', color: '#999' }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>🚧 {name} 🚧</h1>
      <p>This is a stub placeholder for <b>{name}</b>.<br />
        Replace this stub with your real component/page implementation.</p>
    </div>
  );
}
