// vitest.setup.ts
// Polyfill missing JSDOM APIs

// Polyfill requestSubmit
HTMLFormElement.prototype.requestSubmit = HTMLFormElement.prototype.requestSubmit || HTMLFormElement.prototype.submit;

// Add any other missing JSDOM APIs here as needed
