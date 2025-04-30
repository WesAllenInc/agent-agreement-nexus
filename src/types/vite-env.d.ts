/// <reference types="vite/client" />

interface Window {
  $RefreshReg$: () => void;
  $RefreshSig$: () => (type: any) => any;
  __vite_plugin_react_preamble_installed__: boolean;
}
