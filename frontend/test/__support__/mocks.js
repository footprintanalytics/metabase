/* eslint-disable no-import-assign*/

global.ga = () => {};
global.snowplow = () => {};
global.ace.define = () => {};
global.ace.require = () => {};

global.window.matchMedia = () => ({
  addListener: () => {},
  removeListener: () => {},
});

// Disable analytics
jest.mock("metabase/lib/analytics");

// Suppress ace import errors
jest.mock("ace/ace", () => {}, { virtual: true });
jest.mock("ace/mode-plain_text", () => {}, { virtual: true });
jest.mock("ace/mode-javascript", () => {}, { virtual: true });
jest.mock("ace/mode-json", () => {}, { virtual: true });
jest.mock("ace/mode-clojure", () => {}, { virtual: true });
jest.mock("ace/mode-ruby", () => {}, { virtual: true });
jest.mock("ace/mode-html", () => {}, { virtual: true });
jest.mock("ace/mode-jsx", () => {}, { virtual: true });
jest.mock("ace/mode-sql", () => {}, { virtual: true });
jest.mock("ace/mode-mysql", () => {}, { virtual: true });
jest.mock("ace/mode-pgsql", () => {}, { virtual: true });
jest.mock("ace/mode-sqlserver", () => {}, { virtual: true });
jest.mock("ace/snippets/text", () => {}, { virtual: true });
jest.mock("ace/snippets/sql", () => {}, { virtual: true });
jest.mock("ace/snippets/mysql", () => {}, { virtual: true });
jest.mock("ace/snippets/pgsql", () => {}, { virtual: true });
jest.mock("ace/snippets/sqlserver", () => {}, { virtual: true });
jest.mock("ace/snippets/json", () => {}, { virtual: true });
jest.mock("ace/snippets/json", () => {}, { virtual: true });
jest.mock("ace/ext-language_tools", () => {}, { virtual: true });

jest.mock("metabase/components/Popover");

// Replace addEventListener with a test implementation which collects all event listeners to `eventListeners` map
export const eventListeners = {};
const testAddEventListener = jest.fn((event, listener) => {
  eventListeners[event] = eventListeners[event]
    ? [...eventListeners[event], listener]
    : [listener];
});
const testRemoveEventListener = jest.fn((event, listener) => {
  eventListeners[event] = (eventListeners[event] || []).filter(
    l => l !== listener,
  );
});

global.document.addEventListener = testAddEventListener;
global.window.addEventListener = testAddEventListener;
global.document.removeEventListener = testRemoveEventListener;
global.window.removeEventListener = testRemoveEventListener;
