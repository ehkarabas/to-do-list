// selecting elements to build infrastructure of 
// object getter, "submit" event, dynamic "To-Dos" space "alert" event of adding a "To-Do", searching a "To-Do", clearing all "To-Dos"
const form = document.querySelector("form#todo-form");
const todoInput = document.querySelector("input#todo");
const todoList = document.querySelector("ul.list-group");
const firstCardBody = document.querySelectorAll("div.card-body")[0];
const secondCardBody = document.querySelectorAll("div.card-body")[1];
const filter = document.querySelector("input#filter");
const clearButton = document.querySelector("a#clear-todos");

// defining a function to encapsulate all event listeners to access all on startup
function eventListeners() {
    // defining dynamic submit event to add input values on both UI and also local storage
    form.addEventListener("submit", addTodo);
    // calling To-Do items from local storage and adding them to UI when page is refreshed
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    // defining a click event via Event Capturing to determine if the element that is clicked a remover element or not
    secondCardBody.addEventListener("click", deleteTodo);
    // defining a keyboard input event to provide opportunity of filtering To-Dos to the end-user
    // keyup event works better than keydown event here, keydown may miss the last character typed, this can be seen when checked with event.target.value
    filter.addEventListener("keyup", filterTodos);
    // defining a click event to trigger removing all To-Do items both on UI and local storage as well
    clearButton.addEventListener("click", clearAllTodos);
};


// automatically starting all event listeners at startup
eventListeners();

// defining form's "submit" event function
function addTodo(event){
    // getting a value from input
    const newTodo = todoInput.value.trim(); // getting input value with no whitespaces in the beginning and end
    // ignoring to add input value to To-Dos list(todoList) if the input area is empty
    if (!(newTodo === "")) {
        addTodoToUI(newTodo); // the function that sends input value(newTodo) to To-Dos list(todoList)
        addTodoToStorage(newTodo); // the function that stores input value(newTodo) locally
        showAlert("success","Successfully added the to-do."); // the function that shows an alert to inform end-user about the input has successfully submitted
    }
    // displaying an alert if the input area is empty
    else{
        showAlert("danger","Please input a to-do."); // the function that shows an alert if the input are is empty
    };
    event.preventDefault(); // to prevent directing to the page itself
};

// defining the addTodoToUI function which adds input value to "To-Dos" list object
function addTodoToUI(string){
    // a standard list item structure will be like below
    /*
    <li class="list-group-item d-flex justify-content-between">
        Todo 1
        <a href = "#" class ="delete-item">
            <i class = "fa-solid fa-xmark"></i>
        </a>
    </li>
    */

    // creating a list item like above and add it to the "To-Dos" list object
    const listItem = document.createElement("li");
    // creating an a element(link) to place into list item(li)
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa-solid fa-xmark'></i>";
    // assigning attributes(only class for this instance) to list item(li)
    listItem.className = "list-group-item d-flex justify-content-between";
    // creating a text node and add input value from form.addEventListener's "addTodo" function into the list item(li) via the node
    listItem.appendChild(document.createTextNode(string));
    // adding link("a" element we constructed) into list item(li)
    listItem.appendChild(link);
    // lastly adding list item into the "To-Dos" list object(todoList)
    todoList.appendChild(listItem);
    // additionally clearing the input area
    todoInput.value = "";
};

// defining the showAlert function to inform end-user about success of submit result
function showAlert(type, message){
    // Bootstrap Alert Structure to be placed at the end of the form element if the input area is empty, can seen below
    /* 
    <div class="alert alert-danger" role="alert">
        Text content of alert
    </div>
    */
    // creating div object to assign Bootstrap Alert onto it
    const alert = document.createElement("div");
    // assigning a class to div object to invoke Bootstrap Alert style onto it
    alert.className = `alert alert-${type}`;
    // adding text content into the Bootstrap Alert div
    alert.textContent = message;
    // placing the Bootstrap Alert div just below of the submit button(in other words, at the end of first card-body)
    firstCardBody.appendChild(alert);
    // lastly, removing Bootstrap Alert after 1 second
    window.setTimeout(function(){
        alert.remove();
    }, 1000);
};

// defining a function to get collection(array for this instance) of To-Dos list(todos) items(To-Do) that locally stores input(To-Do) values.
function getTodosFromStorage(){
    // checking if there is a storage array(for this instance, it is named todos) to store inputs with their keys
    let todos;
    if (!(localStorage.getItem("todos") === null)){
        // converting converted string back to object with JSON.parse when calling it from storage
        todos = JSON.parse(localStorage.getItem("todos"))
    }
    // if there is no storage array to store inputs, creating one for further storing processes
    else{
        todos = [];
    }
    return todos;
};

// defining the addTodoToStorage function to store input value(newTodo) locally
function addTodoToStorage(input){
    // calling storage array that stores input(To-Do) values
    let todos = getTodosFromStorage();
    // adding input value(newTodo) to end of storage array(todos)
    todos.push(input);
    // lastly, updating storage array(todos) as a JSON string via JSON.stringify on local storage with its key(as key/value pair)
    localStorage.setItem("todos",JSON.stringify(todos));
};

// defining a function to call To-Do items from local storage and adding them to UI
function loadAllTodosToUI(){
    // calling storage array(todos) that stores input(To-Do) values
    let todos = getTodosFromStorage();
    // iterating over storage array(todos) items and add each item in it on UI via addTodoToUI custom function
    todos.forEach(function(todo){
        addTodoToUI(todo);
    });
};

// defining a function to remove To-Dos list(todos) item(To-Do) if the clicked object is a proper remover object
function deleteTodo(event){
    // removing To-Dos list(todos) item(To-Do) if the clicked object is Bootstrap "X" icon
    if (event.target.className === "fa-solid fa-xmark"){
        // removing To-Do item(whole li element) from UI
        event.target.parentElement.parentElement.remove();
        // removing To-Do item from local storage as well, need to send only To-Do itself(not whole element, just text content of the element) as the argument of the function to match it with storage array(todos) items(To-Do), in other words with stored input values.
        deleteTodoFromStorage(event.target.parentElement.parentElement.textContent); 
        // displaying an alert to inform end-user about success of removal proccess
        showAlert("success", "To-Do has successfully removed.");
    };
};

// defining a function to delete To-Do from local storage as well
function deleteTodoFromStorage(To_Do){
    // calling storage array(todos) that stores input(To-Do) values
    let todos = getTodosFromStorage();
    // deleting item from storage array(todos)
    todos.forEach(function(todo, index){
        if (todo === To_Do){
            todos.splice(index, 1);
        };
    });
    // lastly, updating storage array(todos) as a JSON string via JSON.stringify on local storage with its key(as key/value pair)
    localStorage.setItem("todos",JSON.stringify(todos));
};

// defining a function to filter To-Dos(input values/todos items/storage array items) via keyboard input event configuration 
function filterTodos(event){
    // converting all characters of filtering input value to lowercase to match it precisely with the To-Do sought  
    const filterValue = event.target.value.toLowerCase();
    // selecting all To-Do items(li elements) to build matchup infrastructure
    const listItems = document.querySelectorAll("li.list-group-item");
    // iterating over UI To-Dos items and 
    listItems.forEach(function(li_element){
        // catching text contents of UI To-Dos items(li elements) and converting all characters of the text content to lowercase to match it precisely with filtering input value
        const text = li_element.textContent.toLocaleLowerCase();
        // starting to matchup process
        // hiding To-Do on UI in a mismatch case
        // d-flex class for the Bootstrap flexbox stylization will overshadow inline display attribute with its "!important" display attribute. if we use !important in inline style here, this will crush d-flex class style.
        if (text.indexOf(filterValue) === -1){
            li_element.setAttribute("style", "display : none !important");
        }
        // showing To-Do on UI in a match case
        else{
            li_element.setAttribute("style", "display : block");
        };
    });
};

// defining a function to clear To-Dos list on both UI and local storage as well
function clearAllTodos(){
    // asking confirmation to the end-user to removal of all To-Do items from UI 
    if (window.confirm("Are you sure to remove all To-Do items?")){
        // removing To-Do items on UI
        // todoList.innerHTML = ""; // this method might be slower than .removeChild()
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        };
        // removing To-Do items from local storage
        localStorage.removeItem("todos");
        // displaying an alert to inform end-user about success of removal proccess
        showAlert("success", "All To-Dos have successfully removed.");
    };
};
