import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyB02eBVYJMJPyNy-nGQa8i_lkPGl45iksU",
    authDomain: "memorial-5758d.firebaseapp.com",
    projectId: "memorial-5758d",
    storageBucket: "memorial-5758d.appspot.com",
    messagingSenderId: "894378859313",
    appId: "1:894378859313:web:848286ccdb606a7f5bee10",
    measurementId: "G-VBR39EFGTP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const memoriesCollection = collection(db, 'memories')

const fetchMemories = async () => getDocs(memoriesCollection)
const addMemory = async ({firstName, lastName, relationship, memory}) => {
    try {
        const docRef = await addDoc(memoriesCollection, {
            firstName,
            lastName,
            relationship,
            memory,
            createdAt: Date.now()
        });

        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

const addMemForm = document.getElementById("add-a-memory-form");
addMemForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();
    const mem = getFormValues();

    try {
        validateMemory(mem);
        await addMemory(mem)
        window.location.href = "/memories";
    } catch (e) {
        renderErrors([e.message])
    }
})

const getFormValues = () => ({
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById('lastName').value,
    relationship: document.getElementById('relationship').value,
    memory: document.getElementById('memory').value
})

const validateMemory = ({firstName, lastName, relationship, memory}) => {
    if(!firstName) {
        throw new Error("Please add your first name.")
    }
    if(!lastName) {
        throw new Error("Please add your last name.")
    }
    if(!relationship) {
        throw new Error("Please add a relationship.")
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
