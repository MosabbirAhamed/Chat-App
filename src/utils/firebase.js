import firebase from 'firebase';



const firebaseConfig = {
    apiKey: "AIzaSyCaQZs6w5k41z4cut0_sBZfXuOpQvD7MZs",
    authDomain: "chat-app-49694.firebaseapp.com",
    projectId: "chat-app-49694",
    storageBucket: "chat-app-49694.appspot.com",
    messagingSenderId: "50202992306",
    appId: "1:50202992306:web:5c9072cac108e744d4f3ab",
    measurementId: "G-2BKEYM1WRH"
};


const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);

const auth = app.auth();
const db = app.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export { auth, db, timestamp }