import React, { useEffect, useState } from "react";
import socketio from "socket.io-client";
import { AdminRole } from "src/utils/enum";
import  authStore from "./AuthProvider";
const SocketURL = process.env.REACT_APP_SOCKET_URL;
export const SocketContext = React.createContext();

const SocketContextProvider = ({ children }) => {
    const adminRole = authStore(state => state.adminRole);
    const { _id: profileId } = authStore((state) => state.user);
    const [chatClient, setChatClient] = useState(null);
    const [connected, setConnected] = useState(false);
    console.log("adminRole",adminRole,profileId);
    useEffect(() => {
        // "look login data is changed"
        if (profileId && adminRole === AdminRole.SUPER_ADMIN) {
            const initChat = () => {
                // console.log("message from connection");
                const client = socketio(SocketURL, {
                    query: {
                        userId: profileId,
                    },
                    transports: ["websocket"],
                    upgrade: true,
                    reconnection: false,
                    autoConnect: false,
                    forceNew: true,
                });
                if (!client.connected) {
                    client.connect();
                }
                setChatClient(client);

                client.on("connect", function () {});

                client.on("confirmConnect", function (data) {
                    setConnected(true);
                    console.log("confirmConnect");
                    client.emit("join", { userId: profileId });
                });

                // client.on("online", function (data) {
                //     const { from: userId, status } = data;
                //     setOnlineUser({ receiverId: userId, status: status });
                // });

                // client.on("typing", function (data) {
                //     const { from: userId, status,type } = data;
                //     setTypingUser({ receiverId: userId, typing: status,type });
                // });

                client.on("disconnect", (reason) => {
                    console.log("socket disconnect", reason);
                    if (reason === "io server disconnect") {
                        // the disconnection was initiated by the server, you need to reconnect manually
                        client.connect();
                    }
                });
            };
            initChat();

            return () => {
                if (chatClient) {
                    chatClient.off("online");
                    chatClient.off("connect");
                    chatClient.off("disconnect");
                    chatClient.off("confirmConnect");
                }
            };
        }
        if (connected && (adminRole !== AdminRole.SUPER_ADMIN || !profileId)) {
            setChatClient(null);
            setConnected(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileId, adminRole]);
    return (
        <SocketContext.Provider>{children}</SocketContext.Provider>
    );
};

export default SocketContextProvider;
