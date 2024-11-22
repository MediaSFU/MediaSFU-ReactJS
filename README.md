<p align="center">
  <img src="https://www.mediasfu.com/logo192.png" width="100" alt="MediaSFU Logo">
</p>

<p align="center">
  <a href="https://twitter.com/media_sfu">
    <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" alt="Twitter" style="margin-right: 10px;">
  </a>
  <a href="https://www.mediasfu.com/forums">
    <img src="https://img.icons8.com/color/48/000000/communication--v1.png" alt="Community Forum" style="margin-right: 10px;">
  </a>
  <a href="https://github.com/MediaSFU">
    <img src="https://img.icons8.com/fluent/48/000000/github.png" alt="Github" style="margin-right: 10px;">
  </a>
  <a href="https://www.mediasfu.com/">
    <img src="https://img.icons8.com/color/48/000000/domain--v1.png" alt="Website" style="margin-right: 10px;">
  </a>
  <a href="https://www.youtube.com/channel/UCELghZRPKMgjih5qrmXLtqw">
    <img src="https://img.icons8.com/color/48/000000/youtube--v1.png" alt="Youtube" style="margin-right: 10px;">
  </a>
</p>


MediaSFU offers a cutting-edge streaming experience that empowers users to customize their recordings and engage their audience with high-quality streams. Whether you're a content creator, educator, or business professional, MediaSFU provides the tools you need to elevate your streaming game.

<div style="text-align: center;">

<img src="https://mediasfu.com/images/header_1.jpg" alt="Preview Page" title="Preview Page" style="max-height: 600px;">

</div>

---

# MediaSFU ReactJS Module Documentation

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Basic Usage Guide](#basic-usage-guide)
- [Intermediate Usage Guide](#intermediate-usage-guide)
- [Advanced Usage Guide](#advanced-usage-guide)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

# Features <a name="features"></a>

MediaSFU's React SDK comes with a host of powerful features out of the box:

1. **Screen Sharing with Annotation Support**: Share your screen with participants and annotate in real-time for enhanced presentations and collaborations.
2. **Collaborative Whiteboards**: Create and share whiteboards for real-time collaborative drawing and brainstorming sessions.
3. **Breakout Rooms**: Create multiple sub-meetings within a single session to enhance collaboration and focus.
4. **Pagination**: Efficiently handle large participant lists with seamless pagination.
5. **Polls**: Conduct real-time polls to gather instant feedback from participants.
6. **Media Access Requests Management**: Manage media access requests with ease to ensure smooth operations.
7. **Video Effects**: Apply various video effects, including virtual backgrounds, to enhance the visual experience.
8. **Chat (Direct & Group)**: Facilitate communication with direct and group chat options.
9. **Cloud Recording (track-based)**: Customize recordings with track-based options, including watermarks, name tags, background colors, and more.
10. **Managed Events**: Manage events with features to handle abandoned and inactive participants, as well as enforce time and capacity limits.

# Getting Started <a name="getting-started"></a>

This section will guide users through the initial setup and installation of the npm module.

### Documentation Reference

For comprehensive documentation on the available methods, components, and functions, please visit [mediasfu.com](https://www.mediasfu.com/reactjs/). This resource provides detailed information for this guide and additional documentation.


## Installation

Instructions on how to install the module using npm.

1. Add the package to your project

    ```bash
    npm install mediasfu-reactjs
    ```

2. **Obtain an API key from MediaSFU.** You can get your API key by signing up or logging into your account at [mediasfu.com](https://www.mediasfu.com/).

  <div style="background-color:#f0f0f0; padding: 10px; border-radius: 5px;">
      <h4 style="color:#d9534f;">Important:</h4>
      <p style="font-size: 1.2em; color: black;">You must obtain an API key from <a href="https://www.mediasfu.com/">mediasfu.com</a> to use this package.</p>
    </div>


# Basic Usage Guide <a name="basic-usage-guide"></a>

A basic guide on how to use the module for common tasks.

This section will guide users through the initial setup and installation of the npm module.

## Introduction

MediaSFU is a 2-page application consisting of a prejoin/welcome page and the main events room page. This guide will walk you through the basic usage of the module for setting up these pages.

### Documentation Reference

For comprehensive documentation on the available methods, components, and functions, please visit [mediasfu.com](https://www.mediasfu.com/reactjs/). This resource provides detailed information for this guide and additional documentation.

## Prebuilt Event Rooms

MediaSFU provides prebuilt event rooms for various purposes. These rooms are rendered as full pages and can be easily imported and used in your application. Here are the available prebuilt event rooms:

1. **MediasfuGeneric**: A generic event room suitable for various types of events.
2. **MediasfuBroadcast**: A room optimized for broadcasting events.
3. **MediasfuWebinar**: Specifically designed for hosting webinars.
4. **MediasfuConference**: Ideal for hosting conferences.
5. **MediasfuChat**: A room tailored for interactive chat sessions.

Users can easily pick an interface and render it in their app.

If no API credentials are provided, a default home page will be displayed where users can scan or manually enter the event details.

To use these prebuilt event rooms, simply import them into your application:

```javascript
import { MediasfuGeneric, MediasfuBroadcast, MediasfuWebinar, MediasfuConference, MediasfuChat } from 'mediasfu-reactjs';
```

## Simplest Usage

The simplest way to use MediaSFU is by directly rendering a prebuilt event room component, such as MediasfuGeneric:

```javascript
import { MediasfuGeneric } from 'mediasfu-reactjs';

const App = () => {
  return (
    <MediasfuGeneric />
  );
}

export default App;
```

## Programmatically Fetching Tokens

If you prefer to fetch the required tokens programmatically without visiting MediaSFU's website, you can use the PreJoinPage component and pass your credentials as props:

```javascript
import { MediasfuGeneric, PreJoinPage } from 'mediasfu-reactjs';

const App = () => {
  const credentials = { apiUserName: "yourAPIUserName", apiKey: "yourAPIKey" };

  return (
    <MediasfuGeneric PrejoinPage={PreJoinPage} credentials={credentials} />
  );
}

export default App;
```

<div style="text-align: center;">

### Preview of Welcome Page

<img src="https://mediasfu.com/images/prejoin.png" alt="Preview of Welcome Page" title="Welcome Page" style="max-height: 500px;">

<!-- Add a blank line for spacing -->
&nbsp;

### Preview of Prejoin Page

<img src="https://mediasfu.com/images/prejoin3.png" alt="Preview of Prejoin Page" title="Prejoin Page" style="max-height: 500px;">

</div>




## Custom Welcome/Prejoin Page

Alternatively, you can design your own welcome/prejoin page. The core function of this page is to fetch user tokens from MediaSFU's API and establish a connection with the returned link if valid.

### Parameters Passed to Custom Page

MediaSFU passes relevant parameters to the custom welcome/prejoin page:

```javascript
let { showAlert, updateIsLoadingModalVisible, connectSocket, updateSocket, updateValidated,
     updateApiUserName, updateApiToken, updateLink, updateRoomName, updateMember } = parameters;
```

Ensure that your custom page implements the following updates:

```javascript
updateSocket(socket);
updateApiUserName(apiUserName);
updateApiToken(apiToken);
updateLink(link);
updateRoomName(apiUserName);
updateMember(userName);
updateValidated(true);
```

See the following code for the PreJoinPage page logic:

```javascript
import React, { useState } from "react";
import Cookies from "universal-cookie";
import { ConnectSocketType, ShowAlert } from "../../@types/types";
import { Socket } from "socket.io-client";

const cookies = new Cookies();
const MAX_ATTEMPTS = 10; // Maximum number of unsuccessful attempts before rate limiting
const RATE_LIMIT_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const apiKey = "yourAPIKEY";
const apiUserName = "yourAPIUSERNAME";
const user_credentials = { apiUserName, apiKey };

// Type definitions for parameters and credentials
export interface PreJoinPageParameters {
  imgSrc?: string;
  showAlert?: ShowAlert;
  updateIsLoadingModalVisible: (visible: boolean) => void;
  connectSocket: ConnectSocketType;
  updateSocket: (socket: Socket) => void;
  updateValidated: (validated: boolean) => void;
  updateApiUserName: (userName: string) => void;
  updateApiToken: (token: string) => void;
  updateLink: (link: string) => void;
  updateRoomName: (roomName: string) => void;
  updateMember: (member: string) => void;
}

export interface Credentials {
  apiUserName: string;
  apiKey: string;
}

export interface PreJoinPageOptions {
  parameters: PreJoinPageParameters;
  credentials?: Credentials;
}

export type PreJoinPageType = (options: PreJoinPageOptions) => JSX.Element;

export interface CreateJoinRoomResponse {
  message: string;
  roomName: string;
  secureCode?: string;
  publicURL: string;
  link: string;
  secret: string;
  success: boolean;
}

export interface CreateJoinRoomError {
  error: string;
  success?: boolean;
}

export type CreateJoinRoomType = (options: {
  payload: any;
  apiUserName: string;
  apiKey: string;
}) => Promise<{
  data: CreateJoinRoomResponse | CreateJoinRoomError | null;
  success: boolean;
}>;

export type CreateRoomOnMediaSFUType = (options: {
  payload: any;
  apiUserName: string;
  apiKey: string;
}) => Promise<{
  data: CreateJoinRoomResponse | CreateJoinRoomError | null;
  success: boolean;
}>;

export async function joinRoomOnMediaSFU({
  payload,
  apiUserName,
  apiKey,
}: {
  payload: any;
  apiUserName: string;
  apiKey: string;
}): Promise<{
  data: CreateJoinRoomResponse | CreateJoinRoomError | null;
  success: boolean;
}> {
  try {
    if (
      !apiUserName ||
      !apiKey ||
      apiUserName === "yourAPIUSERNAME" ||
      apiKey === "yourAPIKEY" ||
      apiKey.length !== 64 ||
      apiUserName.length < 6
    ) {
      return { data: { error: "Invalid credentials" }, success: false };
    }

    const response = await fetch('https://mediasfu.com/v1/rooms/', 
    {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiUserName}:${apiKey}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    const errorMessage = (error as any).reason ? (error as any).reason : 'unknown error';
    return {
      data: { error: `Unable to join room, ${errorMessage}` },
      success: false,
    };
  }
}

export async function createRoomOnMediaSFU({
  payload,
  apiUserName,
  apiKey,
}: {
  payload: any;
  apiUserName: string;
  apiKey: string;
}): Promise<{
  data: CreateJoinRoomResponse | CreateJoinRoomError | null;
  success: boolean;
}> {
  try {
    if (
      !apiUserName ||
      !apiKey ||
      apiUserName === "yourAPIUSERNAME" ||
      apiKey === "yourAPIKEY" ||
      apiKey.length !== 64 ||
      apiUserName.length < 6
    ) {
      return { data: { error: "Invalid credentials" }, success: false };
    }
    
    const response = await fetch('https://mediasfu.com/v1/rooms/', 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiUserName}:${apiKey}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    const errorMessage = (error as any).reason ? (error as any).reason : 'unknown error';
    return {
      data: { error: `Unable to create room, ${errorMessage}` },
      success: false,
    };
  }
}

/**
 * PreJoinPage component allows users to either create a new room or join an existing one.
 * 
 * @component
 * @param {PreJoinPageOptions} props - The properties for the PreJoinPage component.
 * @param {Object} props.parameters - Various parameters required for the component.
 * @param {Function} props.parameters.showAlert - Function to show alert messages.
 * @param {Function} props.parameters.updateIsLoadingModalVisible - Function to update the loading modal visibility.
 * @param {Function} props.parameters.connectSocket - Function to connect to the socket.
 * @param {Function} props.parameters.updateSocket - Function to update the socket.
 * @param {Function} props.parameters.updateValidated - Function to update the validation status.
 * @param {Function} props.parameters.updateApiUserName - Function to update the API username.
 * @param {Function} props.parameters.updateApiToken - Function to update the API token.
 * @param {Function} props.parameters.updateLink - Function to update the link.
 * @param {Function} props.parameters.updateRoomName - Function to update the room name.
 * @param {Function} props.parameters.updateMember - Function to update the member.
 * @param {string} [props.parameters.imgSrc] - The source URL for the logo image.
 * @param {Object} [props.credentials=user_credentials] - The user credentials.
 * 
 * @returns {JSX.Element} The rendered PreJoinPage component.
 * 
 * @example
 * <PreJoinPage
 *   parameters={{
 *     showAlert: showAlertFunction,
 *     updateIsLoadingModalVisible: updateLoadingFunction,
 *     connectSocket: connectSocketFunction,
 *     updateSocket: updateSocketFunction,
 *     updateValidated: updateValidatedFunction,
 *     updateApiUserName: updateApiUserNameFunction,
 *     updateApiToken: updateApiTokenFunction,
 *     updateLink: updateLinkFunction,
 *     updateRoomName: updateRoomNameFunction,
 *     updateMember: updateMemberFunction,
 *     imgSrc: "https://example.com/logo.png"
 *   }}
 *   credentials={{
 *     apiUserName: "user123",
 *     apiKey: "apikey123"
 *   }}
 * />
 */
const PreJoinPage: React.FC<PreJoinPageOptions> = ({
  parameters,
  credentials = user_credentials,
}) => {
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [eventID, setEventID] = useState<string>("");
  const [error, setError] = useState<string>("");

  const {
    showAlert,
    updateIsLoadingModalVisible,
    connectSocket,
    updateSocket,
    updateValidated,
    updateApiUserName,
    updateApiToken,
    updateLink,
    updateRoomName,
    updateMember,
  } = parameters;

  const checkLimitsAndMakeRequest = async ({
    apiUserName,
    apiToken,
    link,
    apiKey = "",
    userName,
  }: {
    apiUserName: string;
    apiToken: string;
    link: string;
    apiKey?: string;
    userName: string;
  }) => {
    const TIMEOUT_DURATION = 10000; // 10 seconds
    let unsuccessfulAttempts =
      parseInt(cookies.get("unsuccessfulAttempts")) || 0;
    let lastRequestTimestamp =
      parseInt(cookies.get("lastRequestTimestamp")) || 0;

    if (
      unsuccessfulAttempts >= MAX_ATTEMPTS &&
      Date.now() - lastRequestTimestamp < RATE_LIMIT_DURATION
    ) {
      showAlert?.({
        message: "Too many unsuccessful attempts. Please try again later.",
        type: "danger",
        duration: 3000,
      });
      return;
    } else {
      unsuccessfulAttempts = 0;
      cookies.set("unsuccessfulAttempts", unsuccessfulAttempts.toString());
      cookies.set("lastRequestTimestamp", Date.now().toString());
    }

    try {
      updateIsLoadingModalVisible(true);
      const socketPromise = await connectSocket({
        apiUserName,
        apiKey,
        apiToken,
        link,
      });
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(
          () => reject(new Error("Request timed out")),
          TIMEOUT_DURATION
        )
      );

      const socket = await Promise.race([socketPromise, timeoutPromise]);
      if (socket && socket instanceof Socket && socket.id) {
        unsuccessfulAttempts = 0;
        cookies.set("unsuccessfulAttempts", unsuccessfulAttempts.toString());
        cookies.set("lastRequestTimestamp", Date.now().toString());
        updateSocket(socket);
        updateApiUserName(apiUserName);
        updateApiToken(apiToken);
        updateLink(link);
        updateRoomName(apiUserName);
        updateMember(userName);
        updateValidated(true);
      } else {
        unsuccessfulAttempts += 1;
        cookies.set("unsuccessfulAttempts", unsuccessfulAttempts.toString());
        updateIsLoadingModalVisible(false);
        showAlert?.({
          message: "Invalid credentials.",
          type: "danger",
          duration: 3000,
        });
      }
    } catch {
      showAlert?.({
        message: "Unable to connect. Check your credentials and try again.",
        type: "danger",
        duration: 3000,
      });
      unsuccessfulAttempts += 1;
      cookies.set("unsuccessfulAttempts", unsuccessfulAttempts.toString());
      updateIsLoadingModalVisible(false);
    }
  };

  const handleToggleMode = () => {
    setIsCreateMode(!isCreateMode);
    setError("");
  };

  const handleCreateRoom = async () => {
    if (!name || !duration || !eventType || !capacity) {
      setError("Please fill all the fields.");
      return;
    }

    const payload = {
      action: "create",
      duration: parseInt(duration),
      capacity: parseInt(capacity),
      eventType,
      userName: name,
    };

    updateIsLoadingModalVisible(true);

    const response = await createRoomOnMediaSFU({
      payload,
      apiUserName: credentials.apiUserName,
      apiKey: credentials.apiKey,
    });
    if (response.success && response.data && "roomName" in response.data) {
      await checkLimitsAndMakeRequest({
        apiUserName: response.data.roomName,
        apiToken: response.data.secret,
        link: response!.data.link,
        userName: name,
      });
    } else {
      updateIsLoadingModalVisible(false);
      setError(
        `Unable to create room. ${
          response.data
            ? "error" in response.data
              ? response.data.error
              : ""
            : ""
        }`
      );
    }
  };

  const handleJoinRoom = async () => {
    if (!name || !eventID) {
      setError("Please fill all the fields.");
      return;
    }

    const payload = {
      action: "join",
      meetingID: eventID,
      userName: name,
    };

    updateIsLoadingModalVisible(true);

    const response = await joinRoomOnMediaSFU({
      payload,
      apiUserName: credentials.apiUserName,
      apiKey: credentials.apiKey,
    });
    if (response.success && response.data && "roomName" in response.data) {
      await checkLimitsAndMakeRequest({
        apiUserName: response.data.roomName,
        apiToken: response.data.secret,
        link: response.data.link,
        userName: name,
      });
    } else {
      updateIsLoadingModalVisible(false);
      setError(
        `Unable to join room. ${
          response.data
            ? "error" in response.data
              ? response.data.error
              : ""
            : ""
        }`
      );
    }
  };

   return (
    // your element
   )
};

export default PreJoinPage;

  ```


### IP Blockage Warning And Local UI Development

Entering the event room without the correct credentials may result in IP blockage, as the page automatically attempts to connect with MediaSFU servers, which rate limit bad requests based on IP address.

If users attempt to enter the event room without valid credentials or tokens, it may lead to IP blockage due to MediaSFU servers' rate limiting mechanism. To avoid unintentional connections to MediaSFU servers during UI development, users can pass the `useLocalUIMode` parameter as `true`.

In this mode, the module will operate locally without making requests to MediaSFU servers. However, to render certain UI elements such as messages, participants, requests, etc., users may need to provide seed data. They can achieve this by importing random data generators and passing the generated data to the event room component.

### Example for Broadcast Room

```javascript
import { MediasfuBroadcast, generateRandomParticipants, generateRandomMessages } from 'mediasfu-reactjs';

function App() {
  const useSeed = true;
  let seedData = {};

  if (useSeed) {
    const memberName = 'Alice';
    const hostName = 'Fred';
    const participants_ = generateRandomParticipants(memberName, "", hostName, true);
    const messages_ = generateRandomMessages(participants_, memberName, "", hostName, true);

    seedData = {
      participants: participants_,
      messages: messages_,
      member: memberName,
      host: hostName,
    };
  }

  const useLocalUIMode = useSeed ? true : false;

  return (
    <MediasfuBroadcast useLocalUIMode={useLocalUIMode} useSeed={useSeed} seedData={useSeed ? seedData : {}} />
  );
}

export default App;
```

### Example for Generic View

```javascript
// Import specific Mediasfu view components
// Import the PreJoinPage component for the Pre-Join Page use case
import { MediasfuGeneric,
    MediasfuBroadcast, MediasfuChat, MediasfuWebinar, MediasfuConference, PreJoinPage
 } from 'mediasfu-reactjs'


// Import methods for generating random participants, messages, requests, and waiting room lists if using seed data
import { generateRandomParticipants, generateRandomMessages, generateRandomRequestList, generateRandomWaitingRoomList,
} from 'mediasfu-reactjs';

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

const App = () => {
  // Mediasfu account credentials
  // Replace 'your_api_username' and 'your_api_key' with your actual credentials
  const credentials = { apiUserName: 'your_api_username', apiKey: 'your_api_key' };

  // Whether to use seed data for generating random participants and messages
  // Set to true if you want to run the application in local UI mode with seed data
  const useSeed = false;
  let seedData = {};

  // Event type ('broadcast', 'chat', 'webinar', 'conference')
  // Set this to match the component you are using
  let eventType = 'broadcast';

  // If using seed data, generate random participants and messages
  if (useSeed) {
    // Name of the member
    const memberName = 'Prince';

    // Name of the host
    const hostName = 'Fred';

    // Generate random participants
    const participants_ = generateRandomParticipants({
      member: memberName,
      coHost: '',
      host: hostName,
      forChatBroadcast: eventType === 'broadcast' || eventType === 'chat',
    });

    // Generate random messages
    const messages_ = generateRandomMessages({
      participants: participants_,
      member: memberName,
      host: hostName,
      forChatBroadcast: eventType === 'broadcast' || eventType === 'chat',
    });

    // Generate random requests
    const requests_ = generateRandomRequestList({
      participants: participants_,
      hostName: memberName,
      coHostName: '',
      numberOfRequests: 3,
    });

    // Generate random waiting list
    const waitingList_ = generateRandomWaitingRoomList();

    // Assign generated data to seedData
    seedData = {
      participants: participants_,
      messages: messages_,
      requests: requests_,
      waitingList: waitingList_,
      member: memberName,
      host: hostName,
      eventType: eventType,
    };
  }

  // Whether to use local UI mode; prevents making requests to the Mediasfu servers during UI development
  const useLocalUIMode = useSeed;

  // Choose the Mediasfu component based on the event type
  // Uncomment the component corresponding to your use case

  // Simple Use Case (Welcome Page)
  // Renders the default welcome page
  // No additional inputs required
  // return <MediasfuGeneric />;

  // Use Case with Pre-Join Page (Credentials Required)
  // Uses a pre-join page that requires users to enter credentials
  // return <MediasfuGeneric PrejoinPage={PreJoinPage} credentials={credentials} />;

  // Use Case with Local UI Mode (Seed Data Required)
  // Runs the application in local UI mode using seed data
  // return <MediasfuGeneric useLocalUIMode={true} useSeed={true} seedData={seedData} />;

  // MediasfuBroadcast Component
  // Uncomment to use the broadcast event type
  // return (
  //   <MediasfuBroadcast
  //     credentials={credentials}
  //     useLocalUIMode={useLocalUIMode}
  //     useSeed={useSeed}
  //     seedData={useSeed ? seedData : {}}
  //   />
  // );

  // MediasfuChat Component
  // Uncomment to use the chat event type
  // return (
  //   <MediasfuChat
  //     credentials={credentials}
  //     useLocalUIMode={useLocalUIMode}
  //     useSeed={useSeed}
  //     seedData={useSeed ? seedData : {}}
  //   />
  // );

  // MediasfuWebinar Component
  // Uncomment to use the webinar event type
  // return (
  //   <MediasfuWebinar
  //     credentials={credentials}
  //     useLocalUIMode={useLocalUIMode}
  //     useSeed={useSeed}
  //     seedData={useSeed ? seedData : {}}
  //   />
  // );

  // MediasfuConference Component
  // Uncomment to use the conference event type
  // return (
  //   <MediasfuConference
  //     credentials={credentials}
  //     useLocalUIMode={useLocalUIMode}
  //     useSeed={useSeed}
  //     seedData={useSeed ? seedData : {}}
  //   />
  // );

  // Default to MediasfuGeneric without any props
  // This will render the welcome page
  return <MediasfuGeneric />;
};

export default App;

```

In the provided examples, users can set `useLocalUIMode` to `true` during UI development to prevent unwanted connections to MediaSFU servers. Additionally, they can generate seed data for rendering UI components locally by using random data generators provided by the module.

### Local UI Development in MediaSFU ReactJS Module

During local UI development, the MediaSFU view is designed to be responsive to changes in screen size and orientation, adapting its layout accordingly. However, since UI changes are typically linked to communication with servers, developing the UI locally might result in less responsiveness due to the lack of real-time data updates. To mitigate this, users can force trigger changes in the UI by rotating the device, resizing the window, or simulating server responses by clicking on buttons within the page.

While developing locally, users may encounter occasional error warnings as the UI attempts to communicate with the server. These warnings can be safely ignored, as they are simply indicative of unsuccessful server requests in the local development environment.

If users experience responsiveness issues, whether during local development or in production, they can optimize their HTML configuration to ensure proper scaling and viewport settings. By adding the following meta tag to the HTML `<head>` section, users can specify viewport settings for optimal display:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
```




# Intermediate Usage Guide <a name="intermediate-usage-guide"></a>

Expands on the basic usage, covering more advanced features and scenarios.

### Intermediate Usage Guide

In the Intermediate Usage Guide, we'll explore the core components and functionalities of the MediaSFU ReactJS module, focusing on media display, controls, and modal interactions. **Click on any listed component/method to open the full documentation.**

#### Core Components Overview

The main items displayed on an event page are media components (such as video, audio, and blank cards) and control components (for pagination, navigation, etc.).

> ##### **Media Display Components**

| Component Name           | Description                                                                                     |
|--------------------------|-------------------------------------------------------------------------------------------------|
| **[MainAspectComponent](https://www.mediasfu.com/reactjs/functions/MainAspectComponent)** | Serves as a container for the primary aspect of the user interface, typically containing the main content or focus of the application. |
| **[MainScreenComponent](https://www.mediasfu.com/reactjs/functions/MainScreenComponent)** | Responsible for rendering the main screen layout of the application, providing the foundation for displaying various elements and content. |
| **[MainGridComponent](https://www.mediasfu.com/reactjs/functions/MainGridComponent)**  | Crucial part of the user interface, organizing and displaying primary content or elements in a grid layout format. |
| **[SubAspectComponent](https://www.mediasfu.com/reactjs/functions/SubAspectComponent)** | Acts as a secondary container within the user interface, often housing additional elements or controls related to the main aspect. |
| **[MainContainerComponent](https://www.mediasfu.com/reactjs/functions/MainContainerComponent)** | Primary container for the application's content, encapsulating all major components and providing structural organization. |
| **[OtherGridComponent](https://www.mediasfu.com/reactjs/functions/OtherGridComponent)** | Complements the Main Grid Component by offering additional grid layouts, typically used for displaying secondary or auxiliary content. |

> ##### **Control Components**

| Component Name                | Description                                                                                     |
|-------------------------------|-------------------------------------------------------------------------------------------------|
| **[ControlButtonsComponent](https://www.mediasfu.com/reactjs/functions/ControlButtonsComponent)** | Comprises a set of buttons or controls used for navigating, interacting, or managing various aspects of the application's functionality. |
| **[ControlButtonsAltComponent](https://www.mediasfu.com/reactjs/functions/ControlButtonsAltComponent)** | Provides alternative button configurations or styles for controlling different aspects of the application. |
| **[ControlButtonsComponentTouch](https://www.mediasfu.com/reactjs/functions/ControlButtonsComponentTouch)** | Specialized component designed for touch-enabled devices, offering floating buttons or controls for intuitive interaction with the application's features. |


These components collectively contribute to the overall user interface, facilitating navigation, interaction, and content display within the application.

> ##### **Modal Components**

| Modal Component | Description |
|-----------------|-------------|
| **[LoadingModal](https://www.mediasfu.com/reactjs/functions/LoadingModal)** | Modal for displaying loading indicator during data fetching or processing. |
| **[MainAspectComponent](https://www.mediasfu.com/reactjs/functions/MainAspectComponent)** | Component responsible for displaying the main aspect of the event page. |
| **[ControlButtonsComponent](https://www.mediasfu.com/reactjs/functions/ControlButtonsComponent)** | Component for displaying control buttons such as pagination controls. |
| **[ControlButtonsAltComponent](https://www.mediasfu.com/reactjs/functions/ControlButtonsAltComponent)** | Alternate control buttons component for specific use cases. |
| **[ControlButtonsComponentTouch](https://www.mediasfu.com/reactjs/functions/ControlButtonsComponentTouch)** | Touch-enabled control buttons component for mobile devices. |
| **[OtherGridComponent](https://www.mediasfu.com/reactjs/functions/OtherGridComponent)** | Component for displaying additional grid elements on the event page. |
| **[MainScreenComponent](https://www.mediasfu.com/reactjs/functions/MainScreenComponent)** | Component for rendering the main screen content of the event. |
| **[MainGridComponent](https://www.mediasfu.com/reactjs/functions/MainGridComponent)** | Main grid component for displaying primary event content. |
| **[SubAspectComponent](https://www.mediasfu.com/reactjs/functions/SubAspectComponent)** | Component for displaying secondary aspects of the event page. |
| **[MainContainerComponent](https://www.mediasfu.com/reactjs/functions/MainContainerComponent)** | Main container component for the event page content. |
| **[AlertComponent](https://www.mediasfu.com/reactjs/functions/AlertComponent)** | Modal for displaying alert messages to the user. |
| **[MenuModal](https://www.mediasfu.com/reactjs/functions/MenuModal)** | Modal for displaying a menu with various options. |
| **[RecordingModal](https://www.mediasfu.com/reactjs/functions/RecordingModal)** | Modal for managing recording functionality during the event. |
| **[RequestsModal](https://www.mediasfu.com/reactjs/functions/RequestsModal)** | Modal for handling requests from participants during the event. |
| **[WaitingRoomModal](https://www.mediasfu.com/reactjs/functions/WaitingRoomModal)** | Modal for managing waiting room functionality during the event. |
| **[DisplaySettingsModal](https://www.mediasfu.com/reactjs/functions/DisplaySettingsModal)** | Modal for adjusting display settings during the event. |
| **[EventSettingsModal](https://www.mediasfu.com/reactjs/functions/EventSettingsModal)** | Modal for configuring event settings. |
| **[CoHostModal](https://www.mediasfu.com/reactjs/functions/CoHostModal)** | Modal for managing co-host functionality during the event. |
| **[ParticipantsModal](https://www.mediasfu.com/reactjs/functions/ParticipantsModal)** | Modal for displaying participant information and controls. |
| **[MessagesModal](https://www.mediasfu.com/reactjs/functions/MessagesModal)** | Modal for managing messages and chat functionality during the event. |
| **[MediaSettingsModal](https://www.mediasfu.com/reactjs/functions/MediaSettingsModal)** | Modal for adjusting media settings during the event. |
| **[ConfirmExitModal](https://www.mediasfu.com/reactjs/functions/ConfirmExitModal)** | Modal for confirming exit from the event. |
| **[ConfirmHereModal](https://www.mediasfu.com/reactjs/functions/ConfirmHereModal)** | Modal for confirming certain actions or selections. |
| **[ShareEventModal](https://www.mediasfu.com/reactjs/functions/ShareEventModal)** | Modal for sharing the event with others. |
| **[WelcomePage](https://www.mediasfu.com/reactjs/functions/WelcomePage)** | Welcome page modal for the event. |
| **[PreJoinPage](https://www.mediasfu.com/reactjs/functions/PreJoinPage)** | Prejoin page modal for the event. |
| **[PollModal](https://www.mediasfu.com/reactjs/functions/PollModal)** | Modal for conducting polls or surveys during the event. |
| **[BreakoutRoomsModal](https://www.mediasfu.com/reactjs/functions/BreakoutRoomsModal)** | Modal for managing breakout rooms during the event. |
| **[ConfigureWhiteboardModal](https://www.mediasfu.com/reactjs/functions/ConfigureWhiteboardModal)** | Modal for configuring whiteboard settings during the event. |                      
| **[BackgroundModal](https://www.mediasfu.com/reactjs/functions/BackgroundModal)**  | Modal for managing background settings during the event. |
| **[ScreenboardModal](https://www.mediasfu.com/reactjs/functions/ScreenboardModal)** | Modal for managing screen share annotations during the event. |

#### Modal Interactions

Each modal has corresponding functions to trigger its usage:

1. [`launchMenuModal`](https://www.mediasfu.com/reactjs/functions/launchMenuModal): Launches the menu modal for settings and configurations.
2. [`launchRecording`](https://www.mediasfu.com/reactjs/functions/launchRecording): Initiates the recording modal for recording functionalities.
3. [`startRecording`](https://www.mediasfu.com/reactjs/functions/startRecording): Starts the recording process.
4. [`confirmRecording`](https://www.mediasfu.com/reactjs/functions/confirmRecording): Confirms and finalizes the recording.
5. [`launchWaiting`](https://www.mediasfu.com/reactjs/functions/launchWaiting): Opens the waiting room modal for managing waiting room interactions.
6. [`launchCoHost`](https://www.mediasfu.com/reactjs/functions/launchCoHost): Opens the co-host modal for managing co-host functionalities.
7. [`launchMediaSettings`](https://www.mediasfu.com/reactjs/functions/launchMediaSettings): Launches the media settings modal for adjusting media-related configurations.
8. [`launchDisplaySettings`](https://www.mediasfu.com/reactjs/functions/launchDisplaySettings): Opens the display settings modal for adjusting display configurations.
9. [`launchSettings`](https://www.mediasfu.com/reactjs/functions/launchSettings): Initiates the settings modal for general event settings and configurations.
10. [`launchRequests`](https://www.mediasfu.com/reactjs/functions/launchRequests): Opens the requests modal for managing user requests.
11. [`launchParticipants`](https://www.mediasfu.com/reactjs/functions/launchParticipants): Displays the participants modal for viewing and managing event participants.
12. [`launchMessages`](https://www.mediasfu.com/reactjs/functions/launchMessages): Opens the messages modal for communication through chat messages.
13. [`launchConfirmExit`](https://www.mediasfu.com/reactjs/functions/launchConfirmExit): Prompts users to confirm before exiting the event.

#### Media Display and Controls

These components facilitate media display and control functionalities:

1. **[Pagination](https://www.mediasfu.com/reactjs/functions/Pagination)**: Handles pagination and page switching.
2. **[FlexibleGrid](https://www.mediasfu.com/reactjs/functions/FlexibleGrid)**: Renders flexible grid layouts for media display.
3. **[FlexibleVideo](https://www.mediasfu.com/reactjs/functions/FlexibleVideo)**: Displays videos in a flexible manner within the grid.
4. **[AudioGrid](https://www.mediasfu.com/reactjs/functions/AudioGrid)**: Renders audio components within the grid layout.
5. **[Whiteboard](https://www.mediasfu.com/reactjs/functions/Whiteboard)**: Manages whiteboard functionalities for collaborative drawing.
6. **[Screenboard](https://www.mediasfu.com/reactjs/functions/Screenboard)**: Controls screen share annotations and interactions.

These components enable seamless media presentation and interaction within the event environment, providing users with a rich and immersive experience.

| UI Media Component | Description |
|--------------|-------------|
| **[MeetingProgressTimer](https://www.mediasfu.com/reactjs/functions/MeetingProgressTimer)** | Component for displaying a timer indicating the progress of a meeting or event. |
| **[MiniAudio](https://www.mediasfu.com/reactjs/functions/MiniAudio)** | Component for rendering a compact audio player with basic controls. |
| **[MiniCard](https://www.mediasfu.com/reactjs/functions/MiniCard)** | Component for displaying a minimized card view with essential information. |
| **[AudioCard](https://www.mediasfu.com/reactjs/functions/AudioCard)** | Component for displaying audio content with control elements, details, and audio decibels. |
| **[VideoCard](https://www.mediasfu.com/reactjs/functions/VideoCard)** | Component for displaying video content with control elements, details, and audio decibels. |
| **[CardVideoDisplay](https://www.mediasfu.com/reactjs/functions/CardVideoDisplay)** | Video player component for displaying embedded videos with controls and details. |
| **[MiniCardAudio](https://www.mediasfu.com/reactjs/functions/MiniCardAudio)** | Component for rendering a compact card view with audio content and controls. |
| **[MiniAudioPlayer](https://www.mediasfu.com/reactjs/functions/MiniAudioPlayer)** | Utility method for playing audio and rendering a mini audio modal when the user is not actively displayed on the page. |

---
With the Intermediate Usage Guide, users can explore and leverage the core components and functionalities of the MediaSFU ReactJS module to enhance their event hosting and participation experiences.

Here's a sample import and usage code for a Broadcast screen:

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { PrejoinPage, MainContainerComponent, MainAspectComponent, MainScreenComponent, MainGridComponent, FlexibleVideo, ControlButtonsComponentTouch, AudioGrid } from 'mediasfu-reactjs';

const BroadcastScreen = () => {
    // State variables and constants
    const [validated, setValidated] = useState<boolean>(useLocalUIMode); // Validated state as boolean
    const confirmedToRecord = useRef<boolean>(false); // True if the user has confirmed to record as boolean
    const meetingDisplayType = useRef<string>("media"); // Meeting display type as string

    // Sample control button configurations
    const controlBroadcastButtons = [/* define your control buttons here */];
    const recordButton = [/* define your record button here */];
    const recordButtons = [/* define your record buttons here */];

    // Sample component sizes
    const componentSizes = useRef<ComponentSizes>({
        // Component sizes as ComponentSizes
        mainHeight: 0,
        otherHeight: 0,
        mainWidth: 0,
        otherWidth: 0,
    }); // Component sizes

    // Sample function to update component sizes
    const updateComponentSizes = (sizes: ComponentSizes) => {
        componentSizes.current = sizes;
    };


    // Sample function to update validation state
    const updateValidated = (value: boolean) => {
        setValidated(value);
    };

    // Sample credentials
    const credentials = {
        apiUserName: "yourAPIUserName",
        apiKey: "yourAPIKey"
    };

    // Sample socket
    const socket = useRef<Socket>({} as Socket); // Socket for the media server, type Socket 

    // Sample meeting progress time
    const [meetingProgressTime, setMeetingProgressTime] =
    useState<string>("00:00:00"); // Meeting progress time as string

    // Sample record state
    const [recordState, setRecordState] = useState<string>("green"); // Recording state with specific values

    // Sample main grid and other grid elements
    const mainGridStream = useRef<JSX.Element[]>([]); // Array of main grid streams as JSX.Element[]
    const [otherGridStreams, setOtherGridStreams] = useState<JSX.Element[][]>([
        [],
        [],
    ]); // Other grid streams as 2D array of JSX.Element[]
  

    // Sample audio only streams
    const audioOnlyStreams = useRef<JSX.Element[]>([]); // Array of audio-only streams

    // Sample main height and width
    const [mainHeightWidth, setMainHeightWidth] = useState<number>(100); // Main height and width as number

    // Render the PrejoinPage if not validated, otherwise render the main components
    return (
        <div
        className="MediaSFU"
        style={{
            height: "100vh",
            width: "100vw",
            maxWidth: "100vw",
            maxHeight: "100vh",
            overflow: "hidden",
        }}
        >
        {!validated ? (
            <PrejoinPage
            parameters={{
                imgSrc,
                showAlert,
                updateIsLoadingModalVisible,
                connectSocket,
                updateSocket,
                updateValidated,
                updateApiUserName,
                updateApiToken,
                updateLink,
                updateRoomName,
                updateMember,
            }}
            credentials={credentials}
            />
        ) : (
            <MainContainerComponent>
            {/* Main aspect component containsa ll but the control buttons (as used for webinar and conference) */}
            <MainAspectComponent
                backgroundColor="rgba(217, 227, 234, 0.99)"
                defaultFraction={1 - controlHeight}
                updateIsWideScreen={updateIsWideScreen}
                updateIsMediumScreen={updateIsMediumScreen}
                updateIsSmallScreen={updateIsSmallScreen}
                showControls={
                eventType.current == "webinar" ||
                eventType.current == "conference"
                }
            >
                {/* MainScreenComponent contains the main grid view and the minor grid view */}
                <MainScreenComponent
                doStack={true}
                mainSize={mainHeightWidth}
                updateComponentSizes={updateComponentSizes}
                defaultFraction={1 - controlHeight}
                componentSizes={componentSizes.current}
                showControls={
                    eventType.current == "webinar" ||
                    eventType.current == "conference"
                }
                >
                {/* MainGridComponent shows the main grid view - not used at all in chat event type  and conference event type when screenshare is not active*/}
                {/* MainGridComponent becomes the dominant grid view in broadcast and webinar event types */}
                {/* MainGridComponent becomes the dominant grid view in conference event type when screenshare is active */}

                <MainGridComponent
                    height={componentSizes.current.mainHeight}
                    width={componentSizes.current.mainWidth}
                    backgroundColor="rgba(217, 227, 234, 0.99)"
                    mainSize={mainHeightWidth}
                    showAspect={mainHeightWidth > 0 ? true : false}
                    timeBackgroundColor={recordState}
                    meetingProgressTime={meetingProgressTime}
                >
                    <FlexibleVideo
                    customWidth={componentSizes.current.mainWidth}
                    customHeight={componentSizes.current.mainHeight}
                    rows={1}
                    columns={1}
                    componentsToRender={
                        mainGridStream.current ? mainGridStream.current : []
                    }
                    showAspect={
                        mainGridStream.current.length > 0 &&
                        !(whiteboardStarted.current && !whiteboardEnded.current)
                    }
                    />

                    <ControlButtonsComponentTouch
                    buttons={controlBroadcastButtons}
                    position={"right"}
                    location={"bottom"}
                    direction={"vertical"}
                    showAspect={eventType.current == "broadcast"}
                    />

                    {/* Button to launch recording modal */}
                    <ControlButtonsComponentTouch
                    buttons={recordButton}
                    direction={"horizontal"}
                    showAspect={
                        eventType.current == "broadcast" &&
                        !showRecordButtons &&
                        islevel.current == "2"
                    }
                    location="bottom"
                    position="middle"
                    />

                    {/* Buttons to control recording */}
                    <ControlButtonsComponentTouch
                    buttons={recordButtons}
                    direction={"horizontal"}
                    showAspect={
                        eventType.current == "broadcast" &&
                        showRecordButtons &&
                        islevel.current == "2"
                    }
                    location="bottom"
                    position="middle"
                    />
                    <AudioGrid
                    componentsToRender={
                        audioOnlyStreams.current ? audioOnlyStreams.current : []
                    }
                    />
                </MainGridComponent>
                </MainScreenComponent>
            </MainAspectComponent>
            </MainContainerComponent>
        )}

        <ParticipantsModal
            backgroundColor="rgba(217, 227, 234, 0.99)"
            isParticipantsModalVisible={isParticipantsModalVisible}
            onParticipantsClose={() => updateIsParticipantsModalVisible(false)}
            participantsCounter={participantsCounter.current}
            onParticipantsFilterChange={onParticipantsFilterChange}
            parameters={{
            updateParticipants: updateParticipants,
            updateIsParticipantsModalVisible: updateIsParticipantsModalVisible,

            updateDirectMessageDetails,
            updateStartDirectMessage,
            updateIsMessagesModalVisible,

            showAlert: showAlert,

            filteredParticipants: filteredParticipants.current,
            participants: filteredParticipants.current,
            roomName: roomName.current,
            islevel: islevel.current,
            member: member.current,
            coHostResponsibility: coHostResponsibility.current,
            coHost: coHost.current,
            eventType: eventType.current,

            startDirectMessage: startDirectMessage.current,
            directMessageDetails: directMessageDetails.current,
            socket: socket.current,

            getUpdatedAllParams: getAllParams,
            }}
        />

        <RecordingModal
            backgroundColor="rgba(217, 227, 234, 0.99)"
            isRecordingModalVisible={isRecordingModalVisible}
            onClose={() => updateIsRecordingModalVisible(false)}
            startRecording={startRecording}
            confirmRecording={confirmRecording}
            parameters={{
            ...getAllParams(),
            ...mediaSFUFunctions(),
            }}
        />

        <MessagesModal
            backgroundColor={
            eventType.current == "webinar" || eventType.current == "conference"
                ? "#f5f5f5"
                : "rgba(255, 255, 255, 0.25)"
            }
            isMessagesModalVisible={isMessagesModalVisible}
            onMessagesClose={() => updateIsMessagesModalVisible(false)}
            messages={messages.current}
            eventType={eventType.current}
            member={member.current}
            islevel={islevel.current}
            coHostResponsibility={coHostResponsibility.current}
            coHost={coHost.current}
            startDirectMessage={startDirectMessage.current}
            directMessageDetails={directMessageDetails.current}
            updateStartDirectMessage={updateStartDirectMessage}
            updateDirectMessageDetails={updateDirectMessageDetails}
            showAlert={showAlert}
            roomName={roomName.current}
            socket={socket.current}
            chatSetting={chatSetting.current}
        />

        <ConfirmExitModal
            backgroundColor="rgba(181, 233, 229, 0.97)"
            isConfirmExitModalVisible={isConfirmExitModalVisible}
            onConfirmExitClose={() => updateIsConfirmExitModalVisible(false)}
            member={member.current}
            roomName={roomName.current}
            socket={socket.current}
            islevel={islevel.current}
        />

        <ConfirmHereModal
            backgroundColor="rgba(181, 233, 229, 0.97)"
            isConfirmHereModalVisible={isConfirmHereModalVisible}
            onConfirmHereClose={() => updateIsConfirmHereModalVisible(false)}
            member={member.current}
            roomName={roomName.current}
            socket={socket.current}
        />

        <ShareEventModal
            isShareEventModalVisible={isShareEventModalVisible}
            onShareEventClose={() => updateIsShareEventModalVisible(false)}
            roomName={roomName.current}
            islevel={islevel.current}
            adminPasscode={adminPasscode.current}
            eventType={eventType.current}
        />

        <AlertComponent
            visible={alertVisible}
            message={alertMessage}
            type={alertType}
            duration={alertDuration}
            onHide={() => setAlertVisible(false)}
            textColor={"#ffffff"}
        />

        <LoadingModal
            isVisible={isLoadingModalVisible}
            backgroundColor="rgba(217, 227, 234, 0.99)"
            displayColor="black"
        />
        </div>
    );
};

export default BroadcastScreen;
```

This sample code demonstrates the import and usage of various components and features for a Broadcast screen, including rendering different UI components based on the validation state, handling socket connections, displaying video streams, controlling recording, and managing component sizes.

Here's a sample usage of the control button components as used above:

```jsx
    const recordButton = [
        {
        icon: faRecordVinyl,
        text: "Record",
        onPress: () => {
            // Action for the Record button
            launchRecording({
            updateIsRecordingModalVisible: updateIsRecordingModalVisible,
            isRecordingModalVisible: isRecordingModalVisible,
            showAlert: showAlert,
            stopLaunchRecord: stopLaunchRecord.current,
            canLaunchRecord: canLaunchRecord.current,
            recordingAudioSupport: recordingAudioSupport.current,
            recordingVideoSupport: recordingVideoSupport.current,
            updateCanRecord: updateCanRecord,
            updateClearedToRecord: updateClearedToRecord,
            recordStarted: recordStarted.current,
            recordPaused: recordPaused.current,
            localUIMode: localUIMode.current,
            });
        },
        activeColor: "black",
        inActiveColor: "black",
        show: true,
        },
    ];
    
     const recordButtons = [
        //recording state control and recording timer buttons
        //Replace or remove any of the buttons as you wish

        //Refer to ControlButtonsAltComponent.js for more details on how to add custom buttons

        {
        icon: faPlayCircle,
        active: recordPaused.current === false,
        onPress: () => {
            updateRecording({
            parameters: { ...getAllParams(), ...mediaSFUFunctions() },
            });
        },
        activeColor: "black",
        inActiveColor: "black",
        alternateIcon: faPauseCircle,
        show: true,
        },
        {
        icon: faStopCircle,
        active: false,
        onPress: () => {
            stopRecording({
            parameters: { ...getAllParams(), ...mediaSFUFunctions() },
            });
        },
        activeColor: "green",
        inActiveColor: "black",
        show: true,
        },
        {
        customComponent: (
            <div
            style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 0,
                margin: 2,
            }}
            >
            <span
                style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 0,
                margin: 0,
                }}
            >
                {recordingProgressTime}
            </span>
            </div>
        ),
        show: true,
        },
        {
        icon: faDotCircle,
        active: false,
        onPress: () => console.log("Status pressed"),
        activeColor: "black",
        inActiveColor: recordPaused.current === false ? "red" : "yellow",
        show: true,
        },
        {
        icon: faCog,
        active: false,
        onPress: () => {
            launchRecording({
            updateIsRecordingModalVisible: updateIsRecordingModalVisible,
            isRecordingModalVisible: isRecordingModalVisible,
            showAlert: showAlert,
            stopLaunchRecord: stopLaunchRecord.current,
            canLaunchRecord: canLaunchRecord.current,
            recordingAudioSupport: recordingAudioSupport.current,
            recordingVideoSupport: recordingVideoSupport.current,
            updateCanRecord: updateCanRecord,
            updateClearedToRecord: updateClearedToRecord,
            recordStarted: recordStarted.current,
            recordPaused: recordPaused.current,
            localUIMode: localUIMode.current,
            });
        },
        activeColor: "green",
        inActiveColor: "black",
        show: true,
        },
    ];

    const controlBroadcastButtons: ButtonTouch[] = [
        // control buttons for broadcast
        //Replace or remove any of the buttons as you wish

        //Refer to ControlButtonsComponentTouch for more details on how to add custom buttons

        {
        icon: faUsers,
        active: true,
        alternateIcon: faUsers,
        onPress: () => {
            launchParticipants({
            updateIsParticipantsModalVisible: updateIsParticipantsModalVisible,
            isParticipantsModalVisible: isParticipantsModalVisible,
            });
        },
        activeColor: "black",
        inActiveColor: "black",
        show: islevel.current === "2",
        },
        {
        icon: faShareAlt,
        active: true,
        alternateIcon: faShareAlt,
        onPress: () => updateIsShareEventModalVisible(!isShareEventModalVisible),
        activeColor: "black",
        inActiveColor: "black",
        show: true,
        },
        {
        customComponent: (
            <div style={{ position: "relative" }}>
            {/* Your icon */}
            <FontAwesomeIcon icon={faComments} size={"lg"} color="black" />
            {/* Conditionally render a badge */}
            {showMessagesBadge && (
                <div
                style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                >
                <div
                    style={{
                    backgroundColor: "red",
                    borderRadius: 12,
                    paddingLeft: 4,
                    paddingRight: 4,
                    paddingTop: 4,
                    paddingBottom: 4,
                    }}
                >
                    <span
                    style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
                    ></span>
                </div>
                </div>
            )}
            </div>
        ),
        onPress: () =>
            launchMessages({
            updateIsMessagesModalVisible: updateIsMessagesModalVisible,
            isMessagesModalVisible: isMessagesModalVisible,
            }),
        show: true,
        },
        {
        icon: faSync,
        active: true,
        alternateIcon: faSync,
        onPress: () =>
            switchVideoAlt({
            parameters: {
                ...getAllParams(),
                ...mediaSFUFunctions(),
            },
            }),
        activeColor: "black",
        inActiveColor: "black",
        show: islevel.current === "2",
        },
        {
        icon: faVideoSlash,
        alternateIcon: faVideo,
        active: videoActive,
        onPress: () =>
            clickVideo({
            parameters: {
                ...getAllParams(),
                ...mediaSFUFunctions(),
            },
            }),
        show: islevel.current === "2",
        activeColor: "green",
        inActiveColor: "red",
        },
        {
        icon: faMicrophoneSlash,
        alternateIcon: faMicrophone,
        active: micActive,
        onPress: () =>
            clickAudio({
            parameters: {
                ...getAllParams(),
                ...mediaSFUFunctions(),
            },
            }),
        activeColor: "green",
        inActiveColor: "red",
        show: islevel.current === "2",
        },
        {
        customComponent: (
            <div
            style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 0,
                margin: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
            }}
            >
            <FontAwesomeIcon icon={faChartBar} size={"lg"} color="black" />
            <span
                style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 0,
                margin: 0,
                }}
            >
                {participantsCounter.current}
            </span>
            </div>
        ),
        show: true,
        },
        {
        icon: faPhone,
        active: endCallActive,
        onPress: () =>
            launchConfirmExit({
            updateIsConfirmExitModalVisible: updateIsConfirmExitModalVisible,
            isConfirmExitModalVisible: isConfirmExitModalVisible,
            }),
        activeColor: "green",
        inActiveColor: "red",
        show: true,
        },
        {
        icon: faPhone,
        active: endCallActive,
        onPress: () => console.log("End Call pressed"), //not in use
        activeColor: "transparent",
        inActiveColor: "transparent",
        backgroundColor: { default: "transparent" },
        show: false,
        },
    ];
```

This sample code defines arrays `recordButtons` and `controlBroadcastButtons`, each containing configuration objects for different control buttons. These configurations include properties such as icon, active state, onPress function, activeColor, inActiveColor, and show flag to control the visibility of each button.

You can customize these configurations according to your requirements, adding, removing, or modifying buttons as needed. Additionally, you can refer to the relevant component files (`ControlButtonsAltComponent` and `ControlButtonsComponentTouch`) for more details on how to add custom buttons.

<div style="text-align: center;">
  Preview of Broadcast Page

<img src="https://mediasfu.com/images/broadcast.png" alt="Preview of Welcome Page" title="Welcome Page" style="max-height: 500px;">

<!-- Add a blank line for spacing -->
&nbsp;
  
  Preview of Conference Page

<img src="https://mediasfu.com/images/conference1.png" alt="Preview of Prejoin Page" title="Prejoin Page" style="max-height: 500px;">


### Preview of Conference Page's Mini Grids

<img src="https://mediasfu.com/images/conference2.png" alt="Preview of Prejoin Page" title="Prejoin Page" style="max-height: 500px;">

</div>
<br />


# Advanced Usage Guide <a name="advanced-usage-guide"></a>

In-depth documentation for advanced users, covering complex functionalities and customization options.

**Introduction to Advanced Media Control Functions:**

In advanced usage scenarios, users often encounter complex tasks related to media control, connectivity, and streaming management within their applications. To facilitate these tasks, a comprehensive set of functions is provided, offering granular control over various aspects of media handling and communication with servers.

These advanced media control functions encompass a wide range of functionalities, including connecting to and disconnecting from WebSocket servers, joining and updating room parameters, managing device creation, switching between different media streams, handling permissions, processing consumer transports, managing screen sharing, adjusting layouts dynamically, and much more.

This robust collection of functions empowers developers to tailor their applications to specific requirements, whether it involves intricate media streaming setups, real-time communication protocols, or sophisticated user interface interactions. With these tools at their disposal, developers can create rich and responsive media experiences that meet the demands of their users and applications.

Here's a tabulated list of advanced control functions along with brief explanations (click the function(link) for full usage guide):

| Function                         | Explanation                                                                                             |
|----------------------------------|---------------------------------------------------------------------------------------------------------|
| [`connectSocket`](https://www.mediasfu.com/reactjs/functions/connectSocket)                  | Connects to the WebSocket server.                                                                       |
| [`disconnectSocket`](https://www.mediasfu.com/reactjs/functions/disconnectSocket)               | Disconnects from the WebSocket server.                                                                  |
| [`joinRoomClient`](https://www.mediasfu.com/reactjs/functions/joinRoomClient)                 | Joins a room as a client.                                                                               |
| [`updateRoomParametersClient`](https://www.mediasfu.com/reactjs/functions/updateRoomParametersClient)     | Updates room parameters as a client.                                                                    |
| [`createDeviceClient`](https://www.mediasfu.com/reactjs/functions/createDeviceClient)             | Creates a device as a client.                                                                           |
| [`switchVideoAlt`](https://www.mediasfu.com/reactjs/functions/switchVideoAlt)                 | Switches video/camera streams.                                                                          |
| [`clickVideo`](https://www.mediasfu.com/reactjs/functions/clickVideo)                     | Handles clicking on video controls.                                                                     |
| [`clickAudio`](https://www.mediasfu.com/reactjs/functions/clickAudio)                     | Handles clicking on audio controls.                                                                     |
| [`clickScreenShare`](https://www.mediasfu.com/reactjs/functions/clickScreenShare)               | Handles clicking on screen share controls.                                                              |
| [`streamSuccessVideo`](https://www.mediasfu.com/reactjs/functions/streamSuccessVideo)             | Handles successful video streaming.                                                                     |
| [`streamSuccessAudio`](https://www.mediasfu.com/reactjs/functions/streamSuccessAudio)             | Handles successful audio streaming.                                                                     |
| [`streamSuccessScreen`](https://www.mediasfu.com/reactjs/functions/streamSuccessScreen)            | Handles successful screen sharing.                                                                      |
| [`streamSuccessAudioSwitch`](https://www.mediasfu.com/reactjs/functions/streamSuccessAudioSwitch)       | Handles successful audio switching.                                                                     |
| [`checkPermission`](https://www.mediasfu.com/reactjs/functions/checkPermission)                | Checks for media access permissions.                                                                    |
| [`producerClosed`](https://www.mediasfu.com/reactjs/functions/producerClosed)                 | Handles the closure of a producer.                                                                      |
| [`newPipeProducer`](https://www.mediasfu.com/reactjs/functions/newPipeProducer)                | Creates receive transport for a new piped producer.                                                     |
| [`updateMiniCardsGrid`](https://www.mediasfu.com/reactjs/functions/updateMiniCardsGrid)            | Updates the mini-grids (mini cards) grid.                                                               |
| [`mixStreams`](https://www.mediasfu.com/reactjs/functions/mixStreams)                     | Mixes streams and prioritizes interesting ones together.                                                |
| [`dispStreams`](https://www.mediasfu.com/reactjs/functions/dispStreams)                    | Displays streams (media).                                                                              |
| [`stopShareScreen`](https://www.mediasfu.com/reactjs/functions/stopShareScreen)                | Stops screen sharing.                                                                                  |
| [`checkScreenShare`](https://www.mediasfu.com/reactjs/functions/checkScreenShare)               | Checks for screen sharing availability.                                                                |
| [`startShareScreen`](https://www.mediasfu.com/reactjs/functions/startShareScreen)               | Starts screen sharing.                                                                                 |
| [`requestScreenShare`](https://www.mediasfu.com/reactjs/functions/requestScreenShare)             | Requests permission for screen sharing.                                                                |
| [`reorderStreams`](https://www.mediasfu.com/reactjs/functions/reorderStreams)                 | Reorders streams (based on interest level).                                                            |
| [`prepopulateUserMedia`](https://www.mediasfu.com/reactjs/functions/prepopulateUserMedia)           | Populates user media (for main grid).                                                                  |
| [`getVideos`](https://www.mediasfu.com/reactjs/functions/getVideos)                      | Retrieves videos that are pending.                                                                     |
| [`rePort`](https://www.mediasfu.com/reactjs/functions/rePort)                         | Handles re-porting (updates of changes in UI when recording).                                           |
| [`trigger`](https://www.mediasfu.com/reactjs/functions/trigger)                        | Triggers actions (reports changes in UI to backend for recording).                                      |
| [`consumerResume`](https://www.mediasfu.com/reactjs/functions/consumerResume)                 | Resumes consumers.                                                                                     |
| [`connectSendTransportAudio`](https://www.mediasfu.com/reactjs/functions/connectSendTransportAudio)      | Connects send transport for audio.                                                                     |
| [`connectSendTransportVideo`](https://www.mediasfu.com/reactjs/functions/connectSendTransportVideo)      | Connects send transport for video.                                                                     |
| [`connectSendTransportScreen`](https://www.mediasfu.com/reactjs/functions/connectSendTransportScreen)    | Connects send transport for screen sharing.                                                            |
| [`processConsumerTransports`](https://www.mediasfu.com/reactjs/functions/processConsumerTransports)      | Processes consumer transports to pause/resume based on the current active page.                         |
| [`resumePauseStreams`](https://www.mediasfu.com/reactjs/functions/resumePauseStreams)             | Resumes or pauses streams.                                                                             |
| [`readjust`](https://www.mediasfu.com/reactjs/functions/readjust)                       | Readjusts display elements.                                                                            |
| [`checkGrid`](https://www.mediasfu.com/reactjs/functions/checkGrid)                      | Checks the grid sizes to display.                                                                      |
| [`getEstimate`](https://www.mediasfu.com/reactjs/functions/getEstimate)                    | Gets an estimate of grids to add.                                                                      |
| [`calculateRowsAndColumns`](https://www.mediasfu.com/reactjs/functions/calculateRowsAndColumns)        | Calculates rows and columns for the grid.                                                              |
| [`addVideosGrid`](https://www.mediasfu.com/reactjs/functions/addVideosGrid)                  | Adds videos to the grid.                                                                               |
| [`onScreenChanges`](https://www.mediasfu.com/reactjs/functions/onScreenChanges)                | Handles screen changes (orientation and resize).                                                        |
| [`sleep`](https://www.mediasfu.com/reactjs/functions/sleep)                          | Pauses execution for a specified duration.                                                             |
| [`changeVids`](https://www.mediasfu.com/reactjs/functions/changeVids)                     | Changes videos.                                                                                        |
| [`compareActiveNames`](https://www.mediasfu.com/reactjs/functions/compareActiveNames)             | Compares active names (for recording UI changes reporting).                                             |
| [`compareScreenStates`](https://www.mediasfu.com/reactjs/functions/compareScreenStates)           | Compares screen states (for recording changes in grid sizes reporting).                                 |
| [`createSendTransport`](https://www.mediasfu.com/reactjs/functions/createSendTransport)            | Creates a send transport.                                                                              |
| [`resumeSendTransportAudio`](https://www.mediasfu.com/reactjs/functions/resumeSendTransportAudio)       | Resumes a send transport for audio.                                                                    |
| [`receiveAllPipedTransports`](https://www.mediasfu.com/reactjs/functions/receiveAllPipedTransports)      | Receives all piped transports.                                                                         |
| [`disconnectSendTransportVideo`](https://www.mediasfu.com/reactjs/functions/disconnectSendTransportVideo)   | Disconnects send transport for video.                                                                  |
| [`disconnectSendTransportAudio`](https://www.mediasfu.com/reactjs/functions/disconnectSendTransportAudio)   | Disconnects send transport for audio.                                                                  |
| [`disconnectSendTransportScreen`](https://www.mediasfu.com/reactjs/functions/disconnectSendTransportScreen)  | Disconnects send transport for screen sharing.                                                         |
| [`connectSendTransport`](https://www.mediasfu.com/reactjs/functions/connectSendTransport)           | Connects a send transport.                                                                             |
| [`getPipedProducersAlt`](https://www.mediasfu.com/reactjs/functions/getPipedProducersAlt)           | Gets piped producers.                                                                                  |
| [`signalNewConsumerTransport`](https://www.mediasfu.com/reactjs/functions/signalNewConsumerTransport)     | Signals a new consumer transport.                                                                      |
| [`connectRecvTransport`](https://www.mediasfu.com/reactjs/functions/connectRecvTransport)           | Connects a receive transport.                                                                          |
| [`reUpdateInter`](https://www.mediasfu.com/reactjs/functions/reUpdateInter)                   | Re-updates the interface based on audio decibels.                                                      |
| [`updateParticipantAudioDecibels`](https://www.mediasfu.com/reactjs/functions/updateParticipantAudioDecibels) | Updates participant audio decibels.                                                                    |
| [`closeAndResize`](https://www.mediasfu.com/reactjs/functions/closeAndResize)                 | Closes and resizes the media elements.                                                                 |
| [`autoAdjust`](https://www.mediasfu.com/reactjs/functions/autoAdjust)                     | Automatically adjusts display elements.                                                                 |
| [`switchUserVideoAlt`](https://www.mediasfu.com/reactjs/functions/switchUserVideoAlt)             | Switches user video (alternate) (back/front).                                                          |
| [`switchUserVideo`](https://www.mediasfu.com/reactjs/functions/switchUserVideo)                | Switches user video (specific video id).                                                               |
| [`switchUserAudio`](https://www.mediasfu.com/reactjs/functions/switchUserAudio)                | Switches user audio.                                                                                   |
| [`receiveRoomMessages`](https://www.mediasfu.com/reactjs/functions/receiveRoomMessages)            | Receives room messages.                                                                                |
| [`formatNumber`](https://www.mediasfu.com/reactjs/functions/formatNumber)                   | Formats a number (for broadcast viewers).                                                              |
| [`connectIps`](https://www.mediasfu.com/reactjs/functions/connectIps)                     | Connects IPs (connect to consuming servers)                                                            |
| [`startMeetingProgressTimer`](https://www.mediasfu.com/reactjs/functions/startMeetingProgressTimer)      | Starts the meeting progress timer.       |
| [`stopRecording`](https://www.mediasfu.com/reactjs/functions/stopRecording)                  | Stops the recording process. |
| [`pollUpdated`](https://www.mediasfu.com/reactjs/functions/pollUpdated)                    | Handles updated poll data. |
| [`handleVotePoll`](https://www.mediasfu.com/reactjs/functions/handleVotePoll)                 | Handles voting in a poll. |
| [`handleCreatePoll`](https://www.mediasfu.com/reactjs/functions/handleCreatePoll)               | Handles creating a poll. |
| [`handleEndPoll`](https://www.mediasfu.com/reactjs/functions/handleEndPoll)                 | Handles ending a poll. |
| [`breakoutRoomUpdated`](https://www.mediasfu.com/reactjs/functions/breakoutRoomUpdated)           | Handles updated breakout room data. |
| [`captureCanvasStream`](https://www.mediasfu.com/reactjs/functions/captureCanvasStream)            | Captures a canvas stream. |
| [`resumePauseAudioStreams`](https://www.mediasfu.com/reactjs/functions/resumePauseAudioStreams)        | Resumes or pauses audio streams. |
| [`processConsumerTransportsAudio`](https://www.mediasfu.com/reactjs/functions/processConsumerTransportsAudio)  | Processes consumer transports for audio. |


### Room Socket Events

In the context of a room's real-time communication, various events occur, such as user actions, room management updates, media controls, and meeting status changes. To effectively handle these events and synchronize the application's state with the server, specific functions are provided. These functions act as listeners for socket events, allowing the application to react accordingly.

#### Provided Socket Event Handling Functions:

| Function                      | Explanation                                                                                             |
|-------------------------------|---------------------------------------------------------------------------------------------------------|
| [`userWaiting`](https://www.mediasfu.com/reactjs/functions/userWaiting)                 | Triggered when a user is waiting.                                                                       |
| [`personJoined`](https://www.mediasfu.com/reactjs/functions/personJoined)                | Triggered when a person joins the room.                                                                 |
| [`allWaitingRoomMembers`](https://www.mediasfu.com/reactjs/functions/allWaitingRoomMembers)       | Triggered when information about all waiting room members is received.                                  |
| [`roomRecordParams`](https://www.mediasfu.com/reactjs/functions/roomRecordParams)            | Triggered when room recording parameters are received.                                                  |
| [`banParticipant`](https://www.mediasfu.com/reactjs/functions/banParticipant)              | Triggered when a participant is banned.                                                                 |
| [`updatedCoHost`](https://www.mediasfu.com/reactjs/functions/updatedCoHost)               | Triggered when the co-host information is updated.                                                      |
| [`participantRequested`](https://www.mediasfu.com/reactjs/functions/participantRequested)        | Triggered when a participant requests access.                                                            |
| [`screenProducerId`](https://www.mediasfu.com/reactjs/functions/screenProducerId)            | Triggered when the screen producer ID is received.                                                       |
| [`updateMediaSettings`](https://www.mediasfu.com/reactjs/functions/updateMediaSettings)         | Triggered when media settings are updated.                                                               |
| [`producerMediaPaused`](https://www.mediasfu.com/reactjs/functions/producerMediaPaused)         | Triggered when producer media is paused.                                                                 |
| [`producerMediaResumed`](https://www.mediasfu.com/reactjs/functions/producerMediaResumed)        | Triggered when producer media is resumed.                                                                |
| [`producerMediaClosed`](https://www.mediasfu.com/reactjs/functions/producerMediaClosed)         | Triggered when producer media is closed.                                                                 |
| [`controlMediaHost`](https://www.mediasfu.com/reactjs/functions/controlMediaHost)            | Triggered when media control is hosted.                                                                  |
| [`meetingEnded`](https://www.mediasfu.com/reactjs/functions/meetingEnded)                | Triggered when the meeting ends.                                                                         |
| [`disconnectUserSelf`](https://www.mediasfu.com/reactjs/functions/disconnectUserSelf)          | Triggered when a user disconnects.                                                                       |
| [`receiveMessage`](https://www.mediasfu.com/reactjs/functions/receiveMessage)              | Triggered when a message is received.                                                                    |
| [`meetingTimeRemaining`](https://www.mediasfu.com/reactjs/functions/meetingTimeRemaining)        | Triggered when meeting time remaining is received.                                                        |
| [`meetingStillThere`](https://www.mediasfu.com/reactjs/functions/meetingStillThere)           | Triggered when the meeting is still active.                                                              |
| [`startRecords`](https://www.mediasfu.com/reactjs/functions/startRecords)                | Triggered when recording starts.                                                                         |
| [`reInitiateRecording`](https://www.mediasfu.com/reactjs/functions/reInitiateRecording)         | Triggered when recording needs to be re-initiated.                                                       |
| [`getDomains`](https://www.mediasfu.com/reactjs/functions/getDomains)                  | Triggered when domains are received.                                                                     |
| [`updateConsumingDomains`](https://www.mediasfu.com/reactjs/functions/updateConsumingDomains)      | Triggered when consuming domains are updated.                                                            |
| [`recordingNotice`](https://www.mediasfu.com/reactjs/functions/recordingNotice)             | Triggered when a recording notice is received.                                                           |
| [`timeLeftRecording`](https://www.mediasfu.com/reactjs/functions/timeLeftRecording)           | Triggered when time left for recording is received.                                                       |
| [`stoppedRecording`](https://www.mediasfu.com/reactjs/functions/stoppedRecording)           | Triggered when recording stops.                                                                          |
| [`hostRequestResponse`](https://www.mediasfu.com/reactjs/functions/hostRequestResponse)         | Triggered when the host request response is received.                                                    |
| [`allMembers`](https://www.mediasfu.com/reactjs/functions/allMembers)                  | Triggered when information about all members is received.                                                 |
| [`allMembersRest`](https://www.mediasfu.com/reactjs/functions/allMembersRest)              | Triggered when information about all members is received (rest of the members).                           |
| [`disconnect`](https://www.mediasfu.com/reactjs/functions/disconnect)                  | Triggered when a disconnect event occurs.                                                                |
| [`pollUpdated`](https://www.mediasfu.com/reactjs/functions/pollUpdated)                 | Triggered when a poll is updated.                                                                        |
| [`breakoutRoomUpdated`](https://www.mediasfu.com/reactjs/functions/breakoutRoomUpdated)         | Triggered when a breakout room is updated.  
| [`whiteboardUpdated`](https://www.mediasfu.com/reactjs/functions/whiteboardUpdated)            | Handles updated whiteboard data. 
| [`whiteboardAction`](https://www.mediasfu.com/reactjs/functions/whiteboardAction)              | Handles whiteboard actions. |       

#### Sample Usage

```javascript
// Example usage of provided socket event handling functions

import { participantRequested, screenProducerId, updateMediaSettings } from 'mediasfu-reactjs'

socket.current.on(
"participantRequested",
async ({ userRequest }: { userRequest: Request }) => {
    await participantRequested({
    userRequest,
    requestList: requestList.current,
    waitingRoomList: waitingRoomList.current,
    updateTotalReqWait,
    updateRequestList,
    });
}
);

socket.current.on(
"screenProducerId",
async ({ producerId }: { producerId: string }) => {
    screenProducerId({
    producerId,
    screenId: screenId.current,
    membersReceived: membersReceived.current,
    shareScreenStarted: shareScreenStarted.current,
    deferScreenReceived: deferScreenReceived.current,
    participants: participants.current,
    updateScreenId,
    updateShareScreenStarted,
    updateDeferScreenReceived,
    });
}
);

socket.current.on(
"updateMediaSettings",
async ({ settings }: { settings: Settings }) => {
    updateMediaSettings({
    settings,
    updateAudioSetting,
    updateVideoSetting,
    updateScreenshareSetting,
    updateChatSetting,
    });
}
);
```

These functions enable seamless interaction with the server and ensure that the application stays synchronized with the real-time events occurring within the room.

### Customizing Media Display in MediaSFU

By default, media display in MediaSFU is handled by the following key functions:

- **`prepopulateUserMedia`**: This function controls the main media grid, such as the host's video in webinar or broadcast views (MainGrid).
- **`addVideosGrid`**: This function manages the mini grid's media, such as participants' media in MiniGrid views (MiniCards, AudioCards, VideoCards).

#### Customizing the Media Display

If you want to modify the default content displayed by MediaSFU components, such as the `MiniCard`, `AudioCard`, or `VideoCard`, you can replace the default UI with your own custom components.

To implement your custom UI for media display:

1. **Custom MainGrid (Host's Video)**: 
   - Modify the UI in the `prepopulateUserMedia` function. 
   - Example link to MediaSFU's default implementation: [`prepopulateUserMedia`](https://github.com/MediaSFU/MediaSFU-ReactJS/blob/main/src/consumers/prepopulateUserMedia.tsx).

2. **Custom MiniGrid (Participants' Media)**:
   - Modify the UI in the `addVideosGrid` function.
   - Example link to MediaSFU's default implementation: [`addVideosGrid`](https://github.com/MediaSFU/MediaSFU-ReactJS/blob/main/src/consumers/addVideosGrid.tsx).

To create a custom UI, you can refer to existing MediaSFU implementations like:

- [MediasfuGeneric](https://github.com/MediaSFU/MediaSFU-ReactJS/blob/main/src/components/mediasfuComponents/MediasfuGeneric.tsx)
- [MediasfuBroadcast](https://github.com/MediaSFU/MediaSFU-ReactJS/blob/main/src/components/mediasfuComponents/MediasfuBroadcast.tsx)

Once your custom components are built, modify the imports of `prepopulateUserMedia` and `addVideosGrid` to point to your custom implementations instead of the default MediaSFU ones.

This allows for full flexibility in how media is displayed in both the main and mini grids, giving you the ability to tailor the user experience to your specific needs.


# API Reference <a name="api-reference"></a>

For detailed information on the API methods and usage, please refer to the [MediaSFU API Documentation](https://mediasfu.com/developers).

If you need further assistance or have any questions, feel free to ask!

For sample codes and practical implementations, visit the [MediaSFU Sandbox](https://www.mediasfu.com/sandbox).

# Troubleshooting <a name="troubleshooting"></a>

1. **Optimizing HTML Configuration**:
   If users experience responsiveness issues, whether during local development or in production, they can optimize their HTML configuration to ensure proper scaling and viewport settings. By adding the following meta tag to the HTML `<head>` section, users can specify viewport settings for optimal display:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
   ```

2. **Issues with Starting User Media (Audio/Video)**:
   If users encounter issues with starting user media (audio/video), they should try running in HTTPS mode. To enable HTTPS mode, users can modify their start script in the package.json file as follows:
   ```json
   "start": "set HTTPS=true && react-scripts start",
   ```

3. **Interactive Testing with MediaSFU's Frontend**:
   Users can interactively join MediaSFU's frontend in the same room to analyze if various events or media transmissions are happening as expected. For example, adding a user there to check changes made by the host and vice versa.

These troubleshooting steps should help users address common issues and optimize their experience with MediaSFU. If the issues persist or additional assistance is needed, users can refer to the [documentation](https://mediasfu.com/docs) or reach out to the support team for further assistance.


https://github.com/user-attachments/assets/310cb87c-dade-445d-aee7-dea1889d6dc4

# Contributing <a name="contributing"></a>

We welcome contributions from the community to improve the project! If you'd like to contribute, please check out our [GitHub repository](https://github.com/MediaSFU-ReactJS) and follow the guidelines outlined in the README.

If you encounter any issues or have suggestions for improvement, please feel free to open an issue on GitHub.

We appreciate your interest in contributing to the project!

If you need further assistance or have any questions, feel free to ask!
```



