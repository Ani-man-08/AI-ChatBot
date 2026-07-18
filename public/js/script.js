let sendBtn = document.getElementById('sendBtn')
let textbox = document.getElementById('textbox')
let chatContainer = document.getElementById('chatContainer')
let themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener('click',() => {
  document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.innerHTML = "☀️";
        themeBtn.style.backgroundColor = "white"
    }else{
        themeBtn.innerHTML = "🌙";
        themeBtn.style.backgroundColor = "black"
    }
})

let user = {message: ""}

function sendMessage(userMsg){

  let messageElement = document.createElement('div');
  messageElement.style.textAlign = "right";
  messageElement.style.margin = "10px";

  messageElement.innerHTML =
  "<span>You: <span/>" + 
  "<span>" + userMsg + "<span/>"
  chatContainer.appendChild(messageElement)
}


async function sendToAI(message){

    const response = await fetch("/chat",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            message
        })
    });

    if(!response.ok){
        throw new Error("AI request failed");
    }

    const data = await response.json();
    return marked.parse(data.reply); 

}

function chatBotMessage(botMsg){

  let messageElement = document.createElement('div');
  messageElement.style.margin = "10px";

  messageElement.innerHTML =
  "<span> ChatBot: <span/>" + "<span>" + botMsg + "<span/>"
  

  setTimeout(()=>{
    messageElement.animate([{easing:"ease-in",opacity:0.4},{opacity:1}],{duration:500})
    chatContainer.appendChild(messageElement)
    chatContainer.scrollTop = chatContainer.scrollHeight
  },1000)
  
}
  
sendBtn.addEventListener("click", async () => {

    let userMessage = textbox.value.trim();

    if(userMessage === ""){
        alert("Please enter a message");
        return;
    }

    textbox.value = "";

    sendMessage(userMessage);

    try {
        const reply = await sendToAI(userMessage);
        chatBotMessage(reply);
    } catch (error) {
        console.error(error);
        chatBotMessage("Sorry, something went wrong.");
    }

});