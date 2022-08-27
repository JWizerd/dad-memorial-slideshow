import {MemoriesService} from "./memories.service";

const addMemForm = document.getElementById("add-a-memory-form");
addMemForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();
    const mem = getFormValues();

    try {
        validateMemory(mem);
        await MemoriesService.addMemory(mem)
    } catch (e) {
        renderErrors([e.message])
    }
})

const getFormValues = () => ({
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById('lastName').value,
    memory: document.getElementById('memory').value
})

const validateMemory = ({firstName, lastName, memory}) => {
    if(!firstName) {
        throw new Error("Please add your first name.")
    }
    if(!lastName) {
        throw new Error("Please add your last name.")
    }
    if(!memory) {
        throw new Error("Please add a memory.")
    }
}

const clearErrors = () => {
    const errorsWrapper = document.getElementById("errors-wrapper")
    errorsWrapper.classList.add('hidden')

    errorsWrapper.innerHTML = ""
}

const renderErrors = (errors) => {
    const errorsWrapper = document.getElementById("errors-wrapper")
    errorsWrapper.classList.remove('hidden')

    const ul = document.createElement('ul')

    errors.forEach(err => {
        const li = document.createElement('li')
        li.appendChild(document.createTextNode(err));
        ul.appendChild(li)
    })

    errorsWrapper.appendChild(ul)
}
