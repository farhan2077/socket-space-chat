const port = 3000;

// connect with the socket server at specified port
const socket = io(`http://localhost:${port}`);

// get elements with corresponding id in html file
const messageView = document.getElementById("message-view");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

const name = prompt("Please enter your name");
createMessage("🔥 You have joined Space Chat.");
socket.emit("new-user", name);

// send message based on various socket evenets created in the server
socket.on("chat-message", (data) => {
  createMessage(`💬 ${data.name}: ${data.message}`);
});

socket.on("user-connected", (name) => {
  createMessage(`🔥 ${name} has joined group chat.`);
});

socket.on("user-disconnected", (name) => {
  createMessage(`😢 ${name} has left group chat.`);
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  createMessage(`✉️ You: ${message}`);
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

// append the message to be sent
function createMessage(message) {
  const messageElement = document.createElement("p");
  messageElement.innerText = message;
  messageView.append(messageElement);
}
