//Query Selectors
const todoInp = document.querySelector("#todo-inp");
const todoBtn = document.querySelector("#todo-btn");
const todoCont = document.querySelector(".todo-container");
const todoList = document.querySelector(".todo-list");

//Event Listeners
todoBtn.addEventListener("click",add);
todoList.addEventListener("click",check);
//Functions
function add(e){
    e.preventDefault();
    //Creation of a new div that'll wrap a li and two btns
    const newDiv = document.createElement('div');
    newDiv.classList.add('todos');
    //Creation of a new li 
    const newLi = document.createElement('li');
    newLi.classList.add('todo-item');
    //newLi.innerText = "XYZ";
    newLi.textContent = todoInp.value;
    newDiv.appendChild(newLi);
    //Creation of a checkbtn
    const checkButton = document.createElement('button');
    checkButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    checkButton.classList.add('check-btn');
    newDiv.appendChild(checkButton);
    //Creation of a crossbtn
    const crossButton = document.createElement('button');
    crossButton.innerHTML = '<i class="fas fa-times-circle"></i>';
    crossButton.classList.add('cross-btn');
    newDiv.appendChild(crossButton);
    //Wrapping the Div inside the main Div
    todoList.appendChild(newDiv);
    todoInp.value = "";
}
function check(e){
    const item = e.target;
    if(item.classList[0] === 'cross-btn') 
    {
        item.parentElement.remove();
        item.classList.add('delete');
    }   
    else if(item.classList[0] === 'check-btn')
    {
        const newItem = item.parentElement;
        newItem.classList.toggle('check-mark');    
    }
}