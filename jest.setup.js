import "@testing-library/jest-dom";

// Polyfills required by react-router 7 in Jest environment
import { TextEncoder, TextDecoder } from "util";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  // eslint-disable-next-line new-cap
  global.TextDecoder = TextDecoder;
}
