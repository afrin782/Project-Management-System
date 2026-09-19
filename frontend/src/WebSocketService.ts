import { Client } from "@stomp/stompjs";

let client: Client | null = null;

export function connectWebSocket(
    onMessage: (message: string) => void
) {
    client = new Client({

        brokerURL: "ws://localhost:8088/ws",

        onConnect: () => {

            console.log("WebSocket connected");

            client?.subscribe(
                "/topic/updates",
                message => {
                    onMessage(message.body);
                }
            );
        },

        onStompError: error => {
            console.log("WebSocket error:", error);
        }
    });

    client.activate();
}

export function sendMessage(message: string) {

    if (client?.connected) {

        client.publish({
            destination: "/app/update",
            body: message
        });
    }
}

export function disconnectWebSocket() {

    client?.deactivate();
}