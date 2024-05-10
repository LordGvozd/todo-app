const MONTH = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEK_DAYS = ["Monday", "Tuesday", "Wendsday", "Thuesday", "Friday", "Saturday", "Sunday"]


var TODO_TASK_LIST;
var INPROGRES_TASKLIST;
var DONE_TASKLIST;

var contextMenuOpened = false;
var selectedTaskId;

var move_task_id;

const TaskType = {
    Todo: "0",
    InProgress: "1",
    Done: "2"
}

class Task{
    /**
     * 
     * @param {string} title 
     * @param {TaskType} type 
     */
    constructor(title, type){
        this.title = title;
        this.taskType = type;
    }
}

var tasks = [];

function loadConstans(){
    uls = document.getElementsByTagName("ul");

    for (let i = 0; i < uls.length; i++) {
        let element = uls.item(i);
        if (element.id == "todo-task-list"){
            TODO_TASK_LIST = element;
        }
        else if (element.id == "in-progress-task-list"){
            INPROGRES_TASKLIST = element;
        }
        else if (element.id == "done-task-list"){
            DONE_TASKLIST = element;
        }
        
    }
}






function get_task_element(id, name){


    let temp = document.getElementsByTagName("template")[0];

    var element = temp.content.cloneNode(true).getElementById("task");
    element.id = id;
    element.className = "task";
    element.innerText = name;

    return element;
}

function addStartTasks(){
    for (const [key, value] of Object.entries(tasks)){
        
        switch (value.taskType){
            
            case TaskType.Todo: {
                TODO_TASK_LIST.appendChild(get_task_element(key, value.title));
                break;
            }
                
            case TaskType.InProgress:{
                    INPROGRES_TASKLIST.appendChild(get_task_element(key, value.title));
                    break;
                }

            case TaskType.Done:{
                    DONE_TASKLIST.appendChild(get_task_element(key, value.title));
                    break;
                }
            default:
                console.log(t[1].TaskType);
        }
            
            
        
    }
}

function allowDrop(ev){
    ev.preventDefault();
}

function dropTask(ev){
    console.log(ev.target.classList);
    if (!ev.target.classList.contains("tasks-list")){
        console.log("Rama");
        return;
    }
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(move_task_id));
}   


function addTask(type){
    let temp = document.getElementsByTagName("template")[1];

    var element = temp.content.cloneNode(true).getElementById("create-task");

    if (type == TaskType.Todo){
        TODO_TASK_LIST.appendChild(element);
    }
    else if (type == TaskType.InProgress){
        INPROGRES_TASKLIST.appendChild(element);
    }
    else if (type == TaskType.Done){
        DONE_TASKLIST.appendChild(element);
    }
    
    setTimeout(() => {
        document.querySelector("#create-input-task").focus();
    }, 10);
    

}

function dragTask(ev){
    move_task_id = ev.target.id;
    console.log(move_task_id);
}


function setDate(){
    var date = new Date();
    
    var month = MONTH[date.getMonth()];
    var day = date.getDate();
    var week_day = WEEK_DAYS[date.getDay() - 1];

    console.log(day);

    var dateText = `${month}, ${day} ${week_day}`;

    var date_element = document.getElementById("banner-day-data");
    date_element.innerText = dateText;
    
}

function enterCreateTask(ev){
    var createNew = true;
    if (!ev.code){
        if (ev.target.value.trim().length === 0){
            removeCreateTask(ev);
            return;
        }
        createNew = false;
    }
    else if (ev.code == "Enter"){
        if (ev.target.value.trim().length === 0){
            removeCreateTask(ev);
            return;
        }
        if (!ev.target.parentElement.parentElement){
            return;
        }
    }

    else{
        return;
    }

    var type;
    var task_id = (Math.random() + 1).toString(36).substring(7);
    switch (ev.target.parentElement.parentElement.id){
        case "todo-task-list":
            TODO_TASK_LIST.appendChild(get_task_element(task_id, ev.target.value));
            var type = TaskType.Todo;
            break;
        case "in-progress-task-list":
            INPROGRES_TASKLIST.appendChild(get_task_element(task_id, ev.target.value));
            var type = TaskType.InProgress;
            break;
        case "done-task-list":
            DONE_TASKLIST.appendChild(get_task_element(task_id, ev.target.value));
            var type = TaskType.Done;
            break;
        
        
    }
    console.log(task_id);
    tasks[task_id] = new Task(title=ev.target.value, type=type);
    if (createNew){
        addTask(type);
    }
    removeCreateTask(ev);
}

function removeCreateTask(ev){
    ev.target.parentElement.remove();
}

function openContextMenu(ev){
    ev.preventDefault();
    selectedTaskId = ev.target.id;
    var menu = document.getElementById("task-context-menu");
    
    
    var rect = ev.target.getBoundingClientRect();

    let x = rect.left + window.scrollX + ev.offsetX;
    let y = rect.top + window.scrollY + ev.offsetY;

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    menu.style.visibility = "visible";
}

function hideContextMenu(){
    console.log("Hide");
    var menu = document.getElementById("task-context-menu");
    if (menu.style.visibility != "hidden"){
        menu.style.visibility = "hidden";
    }
    
}

function contextMenusHider(){
    
    document.addEventListener("click", (ev) => {
        if (ev.target.id != "task-context-menu"){
            hideContextMenu();
        }
    });
    document.addEventListener("contextmenu", (ev) => {

        if (ev.target.id != "task-context-menu" && ev.target.className != "task"){
            hideContextMenu();
        }});
}

function deleteSelectedTask(){
    var task = tasks[selectedTaskId];
    var taskElement = document.querySelector(`#${selectedTaskId}`);
    taskElement.remove();

    delete tasks.selectedTaskId;

    selectedTaskId = "";
}

function start(){
    hideContextMenu();
    contextMenusHider();    
    loadConstans();
    addStartTasks();
    setDate();
}    



