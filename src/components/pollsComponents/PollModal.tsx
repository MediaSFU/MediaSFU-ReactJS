import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Poll, ShowAlert } from "../../@types/types";
import {
  HandleCreatePollType,
  HandleEndPollType,
  HandleVotePollType,
} from "../../@types/types";
import { Socket } from "socket.io-client";

export interface PollModalOptions {
  isPollModalVisible: boolean;
  onClose: () => void;
  position?: string;
  backgroundColor?: string;
  member: string;
  islevel: string;
  polls: Poll[];
  poll: Poll | null;
  socket: Socket;
  roomName: string;
  showAlert?: ShowAlert;
  updateIsPollModalVisible: (isVisible: boolean) => void;

  handleCreatePoll: HandleCreatePollType;
  handleEndPoll: HandleEndPollType;
  handleVotePoll: HandleVotePollType;
}

export type PollModalType = (options: PollModalOptions) => JSX.Element;

/**
 * PollModal - A React component for displaying and managing polls.
 */
/**
 * PollModal component renders a modal for creating, viewing, and managing polls.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {boolean} props.isPollModalVisible - Determines if the poll modal is visible.
 * @param {function} props.onClose - Function to close the modal.
 * @param {string} [props.position="topRight"] - Position of the modal on the screen.
 * @param {string} [props.backgroundColor="#f5f5f5"] - Background color of the modal.
 * @param {Object} props.member - The member object.
 * @param {string} props.islevel - The level of the user.
 * @param {Array} props.polls - Array of poll objects.
 * @param {Object} props.poll - The current poll object.
 * @param {Object} props.socket - The socket object for real-time communication.
 * @param {string} props.roomName - The name of the room.
 * @param {function} props.showAlert - Function to show alerts.
 * @param {function} props.updateIsPollModalVisible - Function to update the visibility of the poll modal.
 * @param {function} props.handleCreatePoll - Function to handle creating a new poll.
 * @param {function} props.handleEndPoll - Function to handle ending a poll.
 * @param {function} props.handleVotePoll - Function to handle voting in a poll.
 * 
 * @returns {JSX.Element} The rendered PollModal component.
 */
const PollModal: React.FC<PollModalOptions> = ({
  isPollModalVisible,
  onClose,
  position = "topRight",
  backgroundColor = "#f5f5f5",
  member,
  islevel,
  polls,
  poll,
  socket,
  roomName,
  showAlert,
  updateIsPollModalVisible,

  //mediasfu functions
  handleCreatePoll,
  handleEndPoll,
  handleVotePoll,
}) => {
  const modalContainerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isPollModalVisible ? "block" : "none",
    zIndex: 999,
  };

  const screenWidth = window.innerWidth;
  let modalWidth = 0.7 * screenWidth;
  if (modalWidth > 350) {
    modalWidth = 350;
  }

  const modalContentStyle: React.CSSProperties = {
    position: "fixed",
    backgroundColor: backgroundColor,
    borderRadius: 10,
    padding: 10,
    width: modalWidth,
    maxWidth: modalWidth,
    maxHeight: "75%",
    overflowY: "auto",
    overflowX: "hidden",
    top: position.includes("top") ? 10 : "auto",
    bottom: position.includes("bottom") ? 10 : "auto",
    left: position.includes("Left") ? 10 : "auto",
    right: position.includes("Right") ? 10 : "auto",
  };

  const [newPoll, setNewPoll] = useState<{
    question: string;
    type: string;
    options: string[];
  }>({
    question: "",
    type: "",
    options: [],
  });

  const renderPolls = () => {
    let activePollCount = 0;

    polls.forEach((polled) => {
      if (polled.status === "active" && poll && polled.id === poll.id) {
        activePollCount++;
      }
    });

    if (islevel == "2" && activePollCount === 0) {
      if (poll && poll.status === "active") {
        poll.status = "inactive";
      }
    }
  };

  useEffect(() => {
    if (isPollModalVisible) {
      renderPolls();
    }
  }, [isPollModalVisible, polls, poll]);

  const calculatePercentage = (votes: number[], optionIndex: number) => {
    const totalVotes = votes.reduce((a, b) => a + b, 0);
    return totalVotes > 0
      ? ((votes[optionIndex] / totalVotes) * 100).toFixed(2)
      : 0;
  };

  const handlePollTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    let options: string[] = [];

    switch (type) {
      case "trueFalse":
        options = ["True", "False"];
        break;
      case "yesNo":
        options = ["Yes", "No"];
        break;
      case "custom":
        options = [];
        break;
      default:
        options = [];
        break;
    }

    setNewPoll({ ...newPoll, type, options });
  };

  const renderPollOptions = () => {
    switch (newPoll?.type) {
      case "trueFalse":
      case "yesNo":
        return (
          <div>
            {newPoll.options.map((option, index) => (
              <div className="form-check" key={index}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="pollOption"
                  value={option.toLowerCase()}
                  id={`option${option}`}
                />
                <label className="form-check-label" htmlFor={`option${option}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case "custom":
        return (
          <>
            {newPoll.options?.map((option, index) => (
              <div className="form-group" key={index}>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Option ${index + 1}`}
                  maxLength={50}
                  value={option || ""}
                  onChange={(e) => {
                    const newOptions = [...newPoll.options];
                    newOptions[index] = e.target.value;
                    setNewPoll({ ...newPoll, options: newOptions });
                  }}
                />
              </div>
            ))}
            {[...Array(5 - (newPoll.options?.length || 0))].map((_, index) => (
              <div
                className="form-group"
                key={(newPoll.options?.length || 0) + index}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Option ${
                    (newPoll.options?.length || 0) + index + 1
                  }`}
                  maxLength={50}
                  value=""
                  onChange={(e) => {
                    const newOptions = [
                      ...(newPoll.options || []),
                      e.target.value,
                    ];
                    setNewPoll({ ...newPoll, options: newOptions });
                  }}
                />
              </div>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={modalContainerStyle}>
      <div style={modalContentStyle}>
        <div
          style={{
            ...styles.modalContent,
            backgroundColor: backgroundColor,
            width: modalWidth,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <h2
              style={{
                fontSize: "x-large",
                fontWeight: "bold",
                color: "black",
              }}
            >
              Polls
            </h2>
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                marginRight: 30,
              }}
            >
              <FontAwesomeIcon
                icon={faTimes}
                size="xl"
                style={{ fontSize: 20, color: "black" }}
              />
            </button>
          </div>
          <hr
            style={{
              height: 1,
              backgroundColor: "black",
              marginTop: 5,
              marginBottom: 5,
            }}
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {islevel == "2" && (
              <>
                <div style={{ overflowY: "auto", maxHeight: "20%" }}>
                  <h5>Previous Polls</h5>
                  {polls.length === 0 && (
                    <div>
                      No polls available
                      <hr />
                    </div>
                  )}
                  {polls.map(
                    (polled, index) =>
                      polled &&
                      (!poll ||
                        (poll &&
                          (poll.status != "active" ||
                            polled.id != poll.id))) && (
                        <div key={index} className="poll">
                          <h6>Question:</h6>
                          <textarea
                            className="form-control"
                            rows={3}
                            disabled
                            value={polled.question}
                          />
                          <br />
                          <h6>Options:</h6>
                          {polled.options.map((option, i) => (
                            <div key={i}>
                              {option}: {polled.votes[i]} votes (
                              {calculatePercentage(polled.votes, i)}%)
                            </div>
                          ))}
                          {polled.status === "active" && (
                            <button
                              className="btn btn-danger btn-block"
                              onClick={() =>
                                handleEndPoll({
                                  pollId: polled.id,
                                  socket,
                                  showAlert,
                                  roomName,
                                  updateIsPollModalVisible,
                                })
                              }
                            >
                              End Poll
                            </button>
                          )}
                        </div>
                      )
                  )}
                </div>

                <hr />
                <div style={{ overflowY: "auto", maxHeight: "20%" }}>
                  <h5>Create a New Poll</h5>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreatePoll({
                        poll: newPoll,
                        socket,
                        roomName,
                        showAlert,
                        updateIsPollModalVisible,
                      });
                    }}
                  >
                    <div
                      className="form-group"
                      style={{ maxWidth: "80%", overflowX: "auto" }}
                    >
                      <label htmlFor="pollQuestion">Poll Question</label>
                      <textarea
                        className="form-control"
                        id="pollQuestion"
                        rows={3}
                        maxLength={300}
                        required
                        value={newPoll.question || ""}
                        onChange={(e) =>
                          setNewPoll({ ...newPoll, question: e.target.value })
                        }
                      />
                    </div>
                    <div
                      className="form-group"
                      style={{ maxWidth: "80%", overflowX: "auto" }}
                    >
                      <label htmlFor="pollType">Select Poll Answer Type</label>
                      <select
                        className="form-control"
                        id="pollType"
                        required
                        value={newPoll.type || ""}
                        onChange={handlePollTypeChange}
                      >
                        <option value="">Choose...</option>
                        <option value="trueFalse">True/False</option>
                        <option value="yesNo">Yes/No</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    {renderPollOptions()}
                    <button
                      style={{
                        flex: 1,
                        padding: 5,
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "black",
                      }}
                      type="submit"
                    >
                      <span style={{ color: "white", fontSize: "medium" }}>
                        Create Poll
                      </span>
                    </button>
                  </form>
                  <hr />
                </div>
              </>
            )}

            <div style={{ overflowY: "auto", maxHeight: "20%" }}>
              <h5>Current Poll</h5>
              {poll && poll.status === "active" ? (
                <div style={{ maxWidth: "80%", overflowX: "auto" }}>
                  <h6>Question:</h6>
                  <textarea
                    className="form-control"
                    rows={3}
                    disabled
                    value={poll.question}
                  />
                  <br />
                  <h6>Options:</h6>
                  {poll.options &&
                    poll.options.map((option, i) => (
                      <div className="form-check" key={i}>
                        <input
                          className="form-check-input poll-option"
                          type="radio"
                          name="pollOption"
                          value={i}
                          id={`pollOption${i}`}
                          checked={poll.voters && poll.voters[member] === i}
                          onChange={() =>
                            handleVotePoll({
                              pollId: poll.id,
                              optionIndex: i,
                              socket,
                              showAlert,
                              member,
                              roomName,
                              updateIsPollModalVisible,
                            })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`pollOption${i}`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  {poll.status === "active" && islevel == "2" && (
                    <button
                      className="btn btn-danger btn-block"
                      onClick={() =>
                        handleEndPoll({
                          pollId: poll.id,
                          socket,
                          showAlert,
                          roomName,
                          updateIsPollModalVisible,
                        })
                      }
                    >
                      End Poll
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <hr />
                  No active poll
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalContent: {
    borderRadius: 10,
    padding: 10,
  },
  modalBody: {
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "black",
    marginVertical: 1,
  },
  btnCloseMessages: {
    padding: 5,
    marginRight: 0,
    paddingRight: 0,
  },
  icon: {
    fontSize: 24,
    color: "black",
  },
};

export default PollModal;
