// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCBw-FyGPczORqZ_ZN-LboysmAxnsbhzmY",
  authDomain: "the-dec0a.firebaseapp.com",
  databaseURL: "https://the-dec0a-default-rtdb.firebaseio.com",
  projectId: "the-dec0a",
  storageBucket: "the-dec0a.appspot.com",
  messagingSenderId: "1011515436985",
  appId: "1:1011515436985:web:074516656d82ce1a3f9068"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
