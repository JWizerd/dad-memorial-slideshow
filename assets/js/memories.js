import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";

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

const memories = await getDocs(memoriesCollection)
const wrapper = document.getElementById('memories-wrapper')


const buildMemoryTemplate = ({firstName, lastName, relationship, memory, createdAt}) => {
    const card = document.createElement('div')
    card.classList.add('card');
    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
    const cardTitle = document.createElement('div');
    cardTitle.classList.add('card-title');
    const nameHeader = document.createElement('h1');
    nameHeader.classList.add('left-align')
    nameHeader.classList.add('mb0')
    nameHeader.appendChild(document.createTextNode(firstName + " " + lastName));
    const relationshipParagraph = document.createElement('p');
    relationshipParagraph.appendChild(document.createTextNode(relationship));
    const hrElement = document.createElement('hr');
    hrElement.classList.add('fancy')
    hrElement.classList.add('mt25')
    const memoryParagraph = document.createElement('p');
    memoryParagraph.classList.add('flow-text')
    memoryParagraph.appendChild(document.createTextNode(memory));

    card.appendChild(cardContent);
    cardContent.appendChild(cardTitle);
    cardTitle.appendChild(nameHeader)
    cardTitle.appendChild(relationshipParagraph)
    cardTitle.appendChild(hrElement)
    cardContent.appendChild(memoryParagraph)

    return card;
}

memories.forEach(memory => wrapper.appendChild(buildMemoryTemplate(memory.data())))

Macy({container: document.getElementById('memories-wrapper'), columns: 2})
