import { PreJoinPageParameters } from "../../@types/types";
import { Socket } from "socket.io-client";
import Cookies from "universal-cookie";


const cookies = new Cookies();
const MAX_ATTEMPTS = 10; // Maximum number of unsuccessful attempts before rate limiting
const RATE_LIMIT_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds


export const checkLimitsAndMakeRequest = async ({
    apiUserName,
    apiToken,
    link,
    apiKey = "",
    userName,
    parameters,
    validate = true,
  }: {
    apiUserName: string;
    apiToken: string;
    link: string;
    apiKey?: string;
    userName: string;
    parameters: PreJoinPageParameters;
    validate?: boolean;
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
      parameters.showAlert?.({
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
      parameters.updateIsLoadingModalVisible(true);
      const socketPromise = await parameters.connectSocket({
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
        if (validate){
          // only one connection is established, no local socket
          parameters.updateSocket(socket);
        }else{
          // local socket is also established, mediaSFU connection is now the local socket
          parameters.updateLocalSocket?.(socket);
        }
        parameters.updateApiUserName(apiUserName);
        parameters.updateApiToken(apiToken);
        parameters.updateLink(link);
        parameters.updateRoomName(apiUserName);
        parameters.updateMember(userName);
        if (validate) parameters.updateValidated(true);
      } else {
        unsuccessfulAttempts += 1;
        cookies.set("unsuccessfulAttempts", unsuccessfulAttempts.toString());
        parameters.updateIsLoadingModalVisible(false);
        parameters.showAlert?.({
          message: "Invalid credentials.",
          type: "danger",
          duration: 3000,
        });
      }
    } catch {
      parameters.showAlert?.({
        message: "Unable to connect. Check your credentials and try again.",
        type: "danger",
        duration: 3000,
      });
      unsuccessfulAttempts += 1;
      cookies.set("unsuccessfulAttempts", unsuccessfulAttempts.toString());
      parameters.updateIsLoadingModalVisible(false);
    }
  };