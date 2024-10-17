/**
 * The main application component for MediaSFU.
 *
 * This component initializes the necessary credentials and configuration for the MediaSFU application,
 * including options for using seed data for generating random participants and messages.
 *
 * @returns {JSX.Element} The rendered Mediasfu component with the specified props.
 *
 * @remarks
 * - The `credentials` object contains the API username and API key for the Mediasfu account.
 * - The `useSeed` flag determines whether to use seed data for generating random participants and messages.
 * - The `eventType` variable indicates the type of UI display (e.g., 'broadcast', 'chat', 'webinar', 'conference').
 * - If `useSeed` is true, random participants, messages, requests, and waiting lists are generated and assigned to `seedData`.
 * - The `useLocalUIMode` flag is set to true if `useSeed` is true, preventing requests to the Mediasfu servers during UI development.
 *
 * @component
 * @example
 * // Example usage of the App component
 * <App />
 */
declare const App: () => import("react/jsx-runtime").JSX.Element;
export default App;
//# sourceMappingURL=AppConference.d.ts.map