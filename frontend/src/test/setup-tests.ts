import "@testing-library/jest-dom";
import { TextDecoder as NodeTextDecoder, TextEncoder as NodeTextEncoder } from "node:util";

// Polyfill for TextEncoder/TextDecoder required by react-router-dom in jsdom
Object.assign(globalThis, {
  TextEncoder: NodeTextEncoder,
  TextDecoder: NodeTextDecoder,
});
