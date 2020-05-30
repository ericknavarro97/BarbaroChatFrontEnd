var listMessage = document.getElementById('listMessage');
var listUsers = document.getElementById('listUsers');
var stompClient = null;

document.getElementById('btnConnect').onclick = connect;
document.getElementById('btnDisconnect').onclick = disconnect;
document.getElementById('btnSendMessage').onclick = sendMessage;
document.getElementById('formMessage').onsubmit = (e) => e.preventDefault;

function connect() {

  //var socket = new SockJS('http://localhost:8888/publish');
  var socket = new SockJS('http://barbaro-chat.herokuapp.com/publish');
  stompClient = Stomp.over(socket); //Creacion de un cliente

  let inputUsername = document.getElementById("txtUsername");

  stompClient.connect({chatroomuser: inputUsername.value}, function (frame) { // Se conecta y
    console.log(frame);
    console.log('Connected');

    stompClient.subscribe('/topic/chatbarbaro', processMessage); //Se sucribe a un topico (a una sala)
    stompClient.subscribe('/connected.users', processUsers)

  });
}

function disconnect() {

  if(stompClient != null){
    sendDisconnectMessage();
    stompClient.disconnect();
    console.log('Disconnect');
  }

}

function sendDisconnectMessage() {
  let inputUsername = document.getElementById('txtUsername');
  stompClient.send("/app/disconnect", {}, {username: inputUsername.value})
}

function processMessage(stompMessage) {

  console.log(stompMessage);

  let messageJSON = stompMessage.body;
  let message = JSON.parse(messageJSON);

  createMessage(message);

}

function buildMessage() {
  let inputUsername = document.getElementById('txtUsername');
  let inputMessage = document.getElementById('txtMessage');

  return JSON.stringify({username: inputUsername.value, content: inputMessage.value})
}

function sendMessage() {
  let message = buildMessage();
  console.log(message);
  stompClient.send("/app/publish", {}, message);
}

function processUsers(stompMessage) {

  console.log(stompMessage);

  let messageJSON = stompMessage.body;
  console.log(messageJSON);

  let users = JSON.parse(messageJSON);

  createListUser(users);

}

function createListUser(users) {

  for (const user of users) {
    createItemUser(user);
  }

}

function createItemUser(user) {

  let elemUsername = document.createElement('h4');
  elemUsername.innerText = user.username;

  listUsers.appendChild(elemUsername);

}

function createMessage(message){
  let itemMessage = document.createElement('div');
  let itemHeader = document.createElement('div');
  let itemUsername = document.createElement('h4');
  let itemDate = document.createElement('span');
  let itemContent = document.createElement('p');

  itemHeader.classList.add('d-flex', 'justify-content-between');

  itemUsername.innerText = message.username;

  itemDate.innerText = new Date().toLocaleString();

  itemContent.innerText = message.content;

  itemHeader.appendChild(itemUsername);
  itemHeader.appendChild(itemDate);

  itemMessage.appendChild(itemHeader);
  itemMessage.appendChild(itemContent);

  listMessage.appendChild(itemMessage);
}
