const WebSocket = require('ws');
// Create a WebSocket server that listens on port 8080. This server will accept WebSocket connections on this port.
const wss = new WebSocket.Server({ port: 8080 });

// Listen for 'connection' events on the WebSocket server. These events are emitted whenever a new client connects to the server.
wss.on('connection', ws => {
    console.log('New client connected!');

    // Use setInterval to create a loop that executes the given function every 3000 milliseconds (3 seconds).
    setInterval(() => {
        // Create an object named 'data' with two properties:
        // 'value' - a random number between 0 and 100,
        // 'timestamp' - the current date and time.
        const data = {
            value: Math.random() * 100,
            timestamp: new Date()
        };

        // Convert the 'data' object to a JSON string and send it to the connected client.
        // The 'ws.send' method is used to send data to a client through the WebSocket connection.
        ws.send(JSON.stringify(data));
    }, 3000); // Update every second
});

console.log('WebSocket server running on port 8080');
