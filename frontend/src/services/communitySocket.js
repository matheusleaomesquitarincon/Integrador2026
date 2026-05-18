import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { backendOrigin } from "../config/api";

const buildClient = (onConnect) => {
  const wsUrl = `${backendOrigin()}/ws`;
  return new Client({
    webSocketFactory: () => new SockJS(wsUrl),
    reconnectDelay: 4000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect,
    onStompError: (frame) => {
      // erros de STOMP não derrubam a UI; apenas logamos
      console.warn("[community-socket] STOMP error:", frame.headers["message"], frame.body);
    },
  });
};

export const useCommunitySocket = (subscriptions, deps = []) => {
  const clientRef = useRef(null);
  const subsRef = useRef(subscriptions);
  subsRef.current = subscriptions;

  useEffect(() => {
    const client = buildClient(() => {
      const list = subsRef.current || [];
      list.forEach(({ destination, handler }) => {
        if (!destination || !handler) return;
        client.subscribe(destination, (message) => {
          try {
            handler(JSON.parse(message.body), message);
          } catch (e) {
            handler(message.body, message);
          }
        });
      });
    });

    clientRef.current = client;
    client.activate();

    return () => {
      try {
        client.deactivate();
      } catch (e) {
        // ignora
      }
      clientRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return clientRef;
};
