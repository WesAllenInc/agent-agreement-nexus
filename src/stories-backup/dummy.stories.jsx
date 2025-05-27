import React from 'react';

// This is a minimal dummy story to ensure that the iframe.html is properly generated
// for Chromatic visual testing

export default {
  title: 'Dummy/Component',
  component: () => <div>Dummy Component</div>,
};

export const Primary = {
  render: () => <div style={{ padding: 20, background: '#f0f0f0' }}>This is a dummy component to ensure iframe.html generation</div>,
};
