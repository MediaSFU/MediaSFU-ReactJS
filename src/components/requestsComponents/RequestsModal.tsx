import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import RenderRequestComponent from "./RenderRequestComponent";
import {
  respondToRequests,
  RespondToRequestsType,
} from "../../methods/requestsMethods/respondToRequests";
import { Request } from "../../@types/types";
import { RenderRequestComponentOptions } from "./RenderRequestComponent";
import { Socket } from "socket.io-client";

export interface RequestsModalParameters {
  getUpdatedAllParams: () => { filteredRequestList: Request[] };
  [key: string]: any;
}

export interface RequestsModalOptions {
  isRequestsModalVisible: boolean;
  onRequestClose: () => void;
  requestCounter: number;
  onRequestFilterChange: (text: string) => void;
  onRequestItemPress?: RespondToRequestsType;
  requestList: Request[];
  updateRequestList: (newRequestList: Request[]) => void;
  roomName: string;
  socket: Socket;
  renderRequestComponent?: React.FC<RenderRequestComponentOptions>;
  backgroundColor?: string;
  position?: string;
  parameters: RequestsModalParameters;
}

export type RequestsModalType = (options: RequestsModalOptions) => React.JSX.Element;

/**
 * RequestsModal component displays a modal with a list of requests.
 *
 * @param {boolean} isRequestsModalVisible - Determines if the modal is visible.
 * @param {() => void} onRequestClose - Function to call when the modal is closed.
 * @param {number} requestCounter - Initial count of requests.
 * @param {(filter: string) => void} onRequestFilterChange - Function to call when the filter input changes.
 * @param {(request: Request) => void} [onRequestItemPress=respondToRequests] - Function to call when a request item is pressed.
 * @param {Request[]} requestList - Initial list of requests.
 * @param {(updatedList: Request[]) => void} updateRequestList - Function to update the request list.
 * @param {string} roomName - Name of the room.
 * @param {Socket} socket - Socket instance for real-time communication.
 * @param {React.ComponentType<RequestComponentProps>} [renderRequestComponent=RenderRequestComponent] - Component to render each request item.
 * @param {string} [backgroundColor="#83c0e9"] - Background color of the modal.
 * @param {string} [position="topRight"] - Position of the modal on the screen.
 * @param {RequestsModalParameters} parameters - Additional parameters for the modal.
 *
 * @returns {React.JSX.Element} The rendered RequestsModal component.
 * 
 * @example
 * ```tsx
 * import { RequestsModal, RenderRequestComponent } from 'mediasfu-reactjs';
 * import { io } from 'socket.io-client';
 *
 * // Define request list and parameters
 * const requestList = [
 *   { id: "1", name: "Request 1", icon: "fa-microphone" },
 *   { id: "2", name: "Request 2", icon: "fa-desktop" },
 * ];
 * const socket = io("http://localhost:3000");
 * 
 * const parameters = {
 *   getUpdatedAllParams: () => ({ filteredRequestList: requestList }),
 * };
 * 
 * // Render the RequestsModal component
 * <RequestsModal
 *   isRequestsModalVisible={true}
 *   onRequestClose={() => console.log('Requests modal closed')}
 *   requestCounter={2}
 *   onRequestFilterChange={(text) => console.log('Filter changed to:', text)}
 *   requestList={requestList}
 *   updateRequestList={(newList) => console.log("Updated request list:", newList)}
 *   roomName="Room 1"
 *   socket={socket}
 *   renderRequestComponent={RenderRequestComponent}
 *   backgroundColor="#83c0e9"
 *   position="topRight"
 *   parameters={parameters}
 * />
 * ```
 */

const RequestsModal: React.FC<RequestsModalOptions> = ({
  isRequestsModalVisible,
  onRequestClose,
  requestCounter,
  onRequestFilterChange,
  onRequestItemPress = respondToRequests,
  requestList,
  updateRequestList,
  roomName,
  socket,
  renderRequestComponent = RenderRequestComponent, // This is treated as a React component
  backgroundColor = "#83c0e9",
  position = "topRight",
  parameters,
}) => {
  const [requestList_s, setRequestList_s] = useState<Request[]>(requestList);
  const [requestCounter_s, setRequestCounter_s] = useState(requestCounter);
  const [reRender, setReRender] = useState(false);

  const handleModalClose = () => {
    onRequestClose();
  };

  const screenWidth = window.innerWidth;
  let modalWidth = 0.8 * screenWidth;
  if (modalWidth > 350) {
    modalWidth = 350;
  }

  const modalContainerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isRequestsModalVisible ? "block" : "none",
    zIndex: 999,
  };

  const modalContentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxHeight: "65%",
    overflowY: "auto",
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
  };

  const styles = {
    input: {
      width: "90%",
      padding: 10,
      borderRadius: 5,
      border: "1px solid #000",
      fontSize: 16,
      marginBottom: 10,
    },
  };

  useEffect(() => {
    const { getUpdatedAllParams } = parameters;
    const updatedParams = getUpdatedAllParams();
    setRequestList_s(updatedParams.filteredRequestList);
    setRequestCounter_s(updatedParams.filteredRequestList.length);
  }, [requestList, reRender, parameters]);

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div className="modal-content">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
              Requests{" "}
              <span
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  borderRadius: 10,
                  padding: 5,
                }}
              >
                {requestCounter_s}
              </span>
            </div>
            <div onClick={handleModalClose} style={{ padding: 5 }}>
              <FontAwesomeIcon
                icon={faTimes}
                size="xl"
                style={{ fontSize: 20, color: "black" }}
              />
            </div>
          </div>
          <hr
            style={{ height: 1, backgroundColor: "black", margin: "5px 0" }}
          />
          <div style={{ marginBottom: 20 }}>
            <input
              style={styles.input}
              placeholder="Search ..."
              onChange={(e) => {
                onRequestFilterChange(e.target.value);
                setReRender(!reRender);
              }}
            />
          </div>
          <div style={{ maxHeight: "calc(100% - 150px)", overflowY: "auto" }}>
            <div id="request-list">
            {requestList_s.map((requestItem, index) => (
              <div key={index} style={{ marginTop: 5 }}>
                {renderRequestComponent({
                  request: requestItem,
                  onRequestItemPress,
                  requestList: requestList_s,
                  updateRequestList,
                  roomName,
                  socket,
                }) as React.ReactElement}
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestsModal;
