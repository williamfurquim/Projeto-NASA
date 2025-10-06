import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
      apiKey: "AIzaSyBlpWF7Gsyf4ax2PaXVR79zKncc419ktv4",
      authDomain: "proximity-ddb49.firebaseapp.com",
      databaseURL: "https://proximity-ddb49-default-rtdb.firebaseio.com",
      projectId: "proximity-ddb49",
      storageBucket: "proximity-ddb49.appspot.com",
      messagingSenderId: "112062802038",
      appId: "1:112062802038:web:2f2eca97ef48e21c741757"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const user = { id: "", name:"", color: "" };

// chat elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

const colors = [
    "aqua",
    "aquamarine",
    "blueviolet",
    "deeppink",
    "chocolate",
    "crimson",
    "gold",
    "hotpink",
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "chartreuse",
    "cyan",
    "firebrick"
]

let websocket;

onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    user.id = crypto.randomUUID();
    user.name = firebaseUser.email || "Anonymous";
    user.color = getRandomColor();

    websocket = new WebSocket("wss://api-de-conversa-da-nasa.onrender.com");
    websocket.onmessage = processMessage;
  }
});


const createMessageSelfElement = (content, timestamp) => {
    const div = document.createElement("div");
    div.classList.add("message--self");

    const time = document.createElement("span");
    time.classList.add("message--timestamp");
    time.textContent = timestamp;
    time.style.display = "block";
    time.style.fontSize = "0.8em";
    time.style.color = "#888";

    div.innerHTML = content;
    
    div.appendChild(time);
    return div;
};

const createMessageOtherElement = (content, sender, senderColor, timestamp) => {
    const div = document.createElement("div");
    const span = document.createElement("span");

    const time = document.createElement("span");
    time.classList.add("message--timestamp");
    time.textContent = timestamp;
    time.style.display = "block";
    time.style.fontSize = "0.8em";
    time.style.color = "#888";

    div.classList.add("message--other");
    span.classList.add("message--sender");
    span.style.color = senderColor;
    span.textContent = sender;

    div.appendChild(span);
    div.innerHTML += content;

    div.appendChild(time);
    return div;
};

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content, timestamp} = JSON.parse(data);

    const message = userId == user.id
        ? createMessageSelfElement(content, timestamp)
        : createMessageOtherElement(content, userName, userColor, timestamp);

    chatMessages.appendChild(message);
    scrollScreen();
};

const sendMessage = (event) => {
    event.preventDefault();
        console.log("nana")

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value,
        timestamp: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit"}),
    };

    websocket.send(JSON.stringify(message));

    chatInput.value = "";
};



chatForm.addEventListener("submit", sendMessage)
