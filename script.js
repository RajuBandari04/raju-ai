const API_KEY = "";

const chatBox = document.getElementById("chatBox");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const historyBox = document.getElementById("chatHistory");

let history =
JSON.parse(localStorage.getItem("raju_ai_history")) || [];
let chats =
JSON.parse(localStorage.getItem("raju_ai_chats")) || [];

let currentChat =
Date.now();

function saveHistory() {
    localStorage.setItem(
        "raju_ai_history",
        JSON.stringify(history)
    );
}

function updateSidebar() {

    historyBox.innerHTML = "";

    chats.forEach(chat => {

        const div =
        document.createElement("div");

        div.className =
        "history-item";

        div.textContent =
        chat.title.substring(0,25);

        div.addEventListener(
        "click",
        function(){

            history =
            chat.messages;

            localStorage.setItem(
            "raju_ai_history",
            JSON.stringify(history)
            );

            chatBox.innerHTML="";

            history.forEach(msg=>{
                addMessage(
                msg.text,
                msg.type
                );
            });

        });

        historyBox.appendChild(div);

    });

}
function addMessage(text,type){

    const welcome =
    document.querySelector(".welcome");

    if(welcome){
        welcome.remove();
    }

    const div =
    document.createElement("div");

    div.className =
    `message ${type}`;

    div.textContent =
    text;

    chatBox.appendChild(div);

    chatBox.scrollTop =
    chatBox.scrollHeight;
}

function loadHistory(){

    history.forEach(item=>{

        addMessage(
            item.text,
            item.type
        );

    });

}

loadHistory();
updateSidebar();

async function sendMessage(){

    const text =
    promptInput.value.trim();

    if(!text) return;

    addMessage(text,"user");

    history.push({
        text:text,
        type:"user"
    });

    saveHistory();
    updateSidebar();

    promptInput.value="";

    const thinking =
    document.createElement("div");

    thinking.className =
    "message bot";

    thinking.textContent =
    "Typing...";

    chatBox.appendChild(thinking);

    try{

        const response = await fetch(
"http://localhost:3000/chat",
{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
   body:JSON.stringify({
    messages: history.map(item => ({
        role: item.type === "user" ? "user" : "model",
        text: item.text
    }))
})
});

const data = await response.json();

console.log(
"API Response:",
data
);

if(data.error){

    alert(
    "Error: " +
    data.error.message
    );

}

thinking.remove();

const reply =
data.reply ||
"Macha response raledhu 😅";
        addMessage(reply,"bot");

        history.push({
            text:reply,
            type:"bot"
        });

        saveHistory();
        updateSidebar();

    }
    catch(err){

        thinking.remove();

        addMessage(
            "Error connecting 😥",
            "bot"
        );

        console.log(err);
    }
}

sendBtn.addEventListener(
"click",
sendMessage
);

promptInput.addEventListener(
"keydown",
function(e){

    if(e.key==="Enter" && !e.shiftKey){
    e.preventDefault();
    sendMessage();
}

});

newChatBtn.addEventListener(
"click",
function(){

    if(history.length > 0){

        chats.push({
            id: currentChat,
            title: history[0].text || "New Chat",
            messages: [...history]
        });

        localStorage.setItem(
            "raju_ai_chats",
            JSON.stringify(chats)
        );
      updateSidebar();
    }

    currentChat = Date.now();

    history = [];

    localStorage.removeItem(
        "raju_ai_history"
    );

    historyBox.innerHTML = "";

   chatBox.innerHTML =
`<div class="welcome">
    <h1>🤖 Raju AI</h1>
    <p>Ask anything macha 😎</p>
</div>`;

updateSidebar();

});
document
.getElementById("imageInput")
.addEventListener(
"change",
function(e){

    const file =
    e.target.files[0];

    if(!file) return;

    addMessage(
    "📷 Image Selected: "
    + file.name,
    "user"
    );

});