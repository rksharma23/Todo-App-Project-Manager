const openFormBtn = document.getElementById(`open-form-btn`);
const formContainer = document.getElementById("form-container");
const closeFormBtn = document.getElementById('close-btn');
let activeCardContainer = document.getElementById('active-card-container');
let completedCardContainer = document.getElementById('completed-card-container');



openFormBtn.addEventListener('click', ()=>{
    if(formContainer.style.display=='block'){
        formContainer.style.display = 'none';
    }
    else{
        formContainer.style.display='block';
    }
})


let projectTitle = document.getElementById('project-title');
let projectDesc = document.getElementById('project-desc');
const closeForm = ()=>{
    projectTitle.value="";
    projectDesc.value="";
    formContainer.style.display = 'none';
}
closeFormBtn.addEventListener('click', closeForm)

//++++++++++++++++++++++++++++++++++++++++++++ LOCAL STORAGE LOGIC +++++++++++++++++++++++++++++++++++++++
const submitFormBtn = document.getElementById('submit-btn');
submitFormBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    if(!projectTitle.value){
        alert("Project Title is mandatory");
        return;
    }
    let newProjectTitle = projectTitle.value;
    let newProjectDesc = projectDesc.value;
    let newProject = {
        id: Date.now().toString(), // generally date.now is used as id in javascript, and is essential for delete functionlity.
        title: newProjectTitle,
        description: newProjectDesc
    }
    let savedProjects = JSON.parse(localStorage.getItem('activeProjects')) || [];
    savedProjects.push(newProject);
    localStorage.setItem('activeProjects', JSON.stringify(savedProjects));
    renderFunctionality(activeCardContainer, 'activeProjects');
    alert("Project Added Successfully")
    closeForm();
})

//++++++++++++++++++++++++++++++++++++++++++++ TOGGLE ACTIVE AND COMPLETED PROJECT +++++++++++++++++++++++++
// FOR THIS ALSO, WE HAVE TO USE EVENT DELEGATION : DEFINATION GIVEN AT LINE NO 55


activeCardContainer.addEventListener('click', function(e){
    if(e.target.id==='mrk-done-btn'){
        const card = e.target.closest('.card');
        const projectId = card.getAttribute('id');
        const savedProjects = JSON.parse(localStorage.getItem('activeProjects')) || [];
        const temp = savedProjects.filter(project=>project.id === projectId);

        const completedProjects = JSON.parse(localStorage.getItem('completedProjects')) || [];
        completedProjects.push(temp[0]);
        localStorage.setItem('completedProjects', JSON.stringify(completedProjects));

        deleteFromLocalStorage(projectId, 'activeProjects');
        renderFunctionality(activeCardContainer, 'activeProjects');
        renderFunctionality(completedCardContainer, 'completedProjects')
    }
})

completedCardContainer.addEventListener('click', function(e){
    if(e.target.id==='mrk-active-btn'){
        const card = e.target.closest('.card');
        const projectId = card.getAttribute('id');
        const completedProjects = JSON.parse(localStorage.getItem('completedProjects')) || [];
        const temp = completedProjects.filter(project=>project.id === projectId);

        const savedProjects = JSON.parse(localStorage.getItem('activeProjects')) || [];
        savedProjects.push(temp[0]);
        localStorage.setItem('activeProjects', JSON.stringify(savedProjects));

        deleteFromLocalStorage(projectId, 'completedProjects');
        renderFunctionality(activeCardContainer, 'activeProjects');
        renderFunctionality(completedCardContainer, 'completedProjects')
    }
})


//+++++++++++++++++++++++++++++++++++++ DELETE ANY PROJECT USING EVENT DELEGATION++++++++++++++++++++++++++++
/*What is event delegation ?
If you're adding the card components dynamically after the initial page load, the delete button event listeners won’t automatically apply to newly created cards. This is because in the previous code, the event listeners are attached to the buttons that exist at the time the script is first run.

To handle this in a dynamic scenario, you need to use event delegation. Event delegation allows you to attach an event listener to a parent element that will handle events for dynamically added child elements.

Modified Approach with Event Delegation:
Instead of adding an event listener to each button individually, you add an event listener to the container that holds all the card components. This way, whenever a delete button inside the container is clicked, the event listener will still work even for dynamically added cards.

*/

//This code is to remove any element from the UI
activeCardContainer.addEventListener('click', function(e){
    if(e.target.classList.contains('del-btn')){ 
        const card = e.target.closest('.card');
        const projectId = card.getAttribute('id');
        deleteFromLocalStorage(projectId, 'activeProjects');
        renderFunctionality(activeCardContainer, 'activeProjects');
    }
})
completedCardContainer.addEventListener('click', function(e){
    if(e.target.classList.contains('del-btn')){ 
        const card = e.target.closest('.card');
        const projectId = card.getAttribute('id');
        deleteFromLocalStorage(projectId, 'completedProjects');
        renderFunctionality(completedCardContainer, 'completedProjects');
    }
})
//But we have to remove/delete that card from local storage also, for this we will update the local storage by deleting
//that object from local storage itself and then re render the component

deleteFromLocalStorage = ((id, localStorageKeyName)=>{
    const savedProjects = JSON.parse(localStorage.getItem(`${localStorageKeyName}`)) || [];
    const updatedProjects = savedProjects.filter(project=>project.id !== id);
    localStorage.setItem(`${localStorageKeyName}`, JSON.stringify(updatedProjects));
})

//++++++++++++++++++++++++++++++++++++++++++++++ RENDER AND RE-RENDER LOGIC +++++++++++++++++++++++++++++++++

const renderFunctionality = (projectContainer, localStorageKeyName)=>{
    let savedProjects = JSON.parse(localStorage.getItem(`${localStorageKeyName}`)) || [];
    if(!savedProjects || savedProjects.length===0){
        projectContainer.innerHTML='No Active Projects';
        return;
    }
    //before adding new projects, clear the already present cards, otherwise it will re add the existing ones also
    projectContainer.innerHTML = '';
    savedProjects.forEach((project)=>{
        let newCardElement = document.createElement("div");
        newCardElement.classList.add('card');
        newCardElement.setAttribute('id', project.id)
        newCardElement.innerHTML=`
        <div class="upper-part">
            <h3>${project.title}</h3>
            <button class="del-btn">X</button>
        </div>
        <p>${project.description}</p>
        <button id=${localStorageKeyName==='activeProjects'?"mrk-done-btn":"mrk-active-btn"}>${localStorageKeyName==='activeProjects'?'Mark Done':'Mark Active'}</button>
        `;
        projectContainer.appendChild(newCardElement);
    })
}
document.addEventListener('DOMContentLoaded', ()=>{
    renderFunctionality(activeCardContainer, 'activeProjects');
    renderFunctionality(completedCardContainer, 'completedProjects');
})


