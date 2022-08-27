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
const addMemory = async ({firstName, lastName, memory}) => {
    try {
        const docRef = await addDoc(memoriesCollection, {
            firstName,
            lastName,
            memory,
            createdAt: Date.now()
        });

        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const MemoriesService = {
    fetchMemories,
    addMemory
}
