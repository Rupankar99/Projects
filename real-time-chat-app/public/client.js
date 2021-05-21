const socket = io();
const dom = {
    nameInput: document.getElementById('inp'),
    inputForm: document.getElementById('inp-form'),
    feed: document.querySelector('.feed'),
    feedBack: document.querySelector('.feedback'),
    cont: document.querySelector('.container'),
    joinBtn: document.getElementById('join-btn'),
    sendBtn: document.getElementById('send-btn'),
    jointxt : document.querySelector('.join-text')
}
const user = {
    name:null
}


dom.joinBtn.onclick = e =>{
    e.preventDefault();
    if(!dom.nameInput.value)
    {
        dom.nameInput.style.borderColor = "red";
        return;
    }
    else{
        dom.nameInput.style.borderColor = "white";
        enter();

        //Checking if users are typing
        dom.nameInput.onkeyup = (e) => {
            socket.emit('typing');
            
            //Check if enter event is pressed
            dom.sendBtn.onclick = e =>{
                e.preventDefault();
                const msg = dom.nameInput.value;
                socket.emit('send-message',{ msg,user });
                addMsg({ user,msg },true);
                dom.nameInput.value = '';
                dom.nameInput.focus();
                dom.cont.scrollTop = dom.cont.scrollHeight;
            };
            if(e.target.value === ''){
                socket.emit('stopped-typing');
            };    
        };
    };
};


//enter method
const enter = ()=>{
    dom.joinBtn.remove();
    dom.sendBtn.classList.remove('hidden');
    dom.nameInput.placeholder = "Say something...";
    dom.jointxt.remove();
    dom.cont.style.textAlign = "left";
    const name = dom.nameInput.value;
    user.name = name;
    dom.nameInput.value = "";
    dom.nameInput.focus();
    addWelcomeMsg(user,true);
    //console.log({name});
    socket.emit('user-connected',{name});
}
const addWelcomeMsg = (user,you) =>{
    const msg = you ? `You joined the chat...` : `<span class="user-name">${user.name}</span> joined the chat...`;
    const welcomeMsg = document.createElement('li');
    welcomeMsg.classList.add('welcome-msg');
    welcomeMsg.innerHTML = `<div class="welcome-msg-text">${msg}</div>`;
    dom.feed.appendChild(welcomeMsg);
}

const addMsg = ({ user,msg },you) =>{
    const Msg = document.createElement('div');
    const date = new Date();
    const addZero = (val) =>{
        if(val<10)
            return '0'+val;
        else
            return val;
    }
    const h = addZero(date.getHours());
    const m = addZero(date.getMinutes());
    Msg.classList = `message-entry${you ? '-own' : ''}`;
    Msg.innerHTML = `<div class='message-body'> 
        <strong>${you ? 'You' : `${user.name}`}</strong>  
        <time>@  ${h}:${m}</time>
        <br>
        ${msg}  
    </div>`;
    dom.cont.appendChild(Msg);
};

//Event listeners
socket.on('user-connected',payload=>{
    addWelcomeMsg(payload,false);
});

socket.on('typing',({ user })=>{
    //dom.feedBack.innerHTML = typers > 1 ? `Several people are typing ...` : `${user} is typing ...`;
    dom.feedBack.innerHTML = `${user} is typing ...`;

});

socket.on('stopped-typing',typers=>{
    if(!typers)
        dom.feedBack.innerHTML = '';
});

//Line 89 was initial position
socket.on('send-message',payload => {
    addMsg(payload);
    if(!payload.typers)
        dom.feedBack.innerHTML = '';
    dom.cont.scrollTop = dom.cont.scrollHeight;  
});

socket.on('user-left',(user)=>{
    //const Msg = `${username} left the chat`;
    const username = user.name;
    console.log(username);
    const leaveMsg = document.createElement('li');
    leaveMsg.innerHTML = `<span class="user-name">${username}</span> left the chat...`;
    leaveMsg.classList.add('welcome-msg');
    dom.feed.appendChild(leaveMsg);
});
