let amount = document.getElementById("amount");
let objectToBorrow = document.getElementById("objectToBorrow");
let sendButton = document.getElementById("sendButton");
let borrowListTable = document.getElementById("borrowListTable");
let nameRow = document.getElementById("nameRow");
let amountRow = document.getElementById("amountRow");
let objectRow = document.getElementById("objectRow");
let dateRow = document.getElementById("dateRow");
let returnedRow = document.getElementById("returnedRow");
let user;
let cells = [];
let keys = [];
let returnButtons = [];

document.addEventListener('DOMContentLoaded', function() {
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    //Init database
    let config = {
        apiKey: "AIzaSyD6khnayxet1ExZAzmvLr5x29ZiStxopIU",
        authDomain: "ioiolendingsystem.firebaseapp.com",
        databaseURL: "https://ioiolendingsystem.firebaseio.com/",
        storageBucket: "gs://ioiolendingsystem.appspot.com"
      };
    firebase.initializeApp(config);
    
      // Get a reference to the database service
    let database = firebase.database();
    try {
      let app = firebase.app();
      let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
      document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
    } catch (e) {
      console.error(e);
      document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }
    
    //Get database
    let realtimeRef = firebase.database().ref();
    //On startup
    realtimeRef.once('value', function(snapshot) {
        populateTable(snapshot);
    });
    //On every edit
    realtimeRef.on('value', function(snapshot) {
        populateTable(snapshot);
    });
    login();
  });

//Login with Google account
function login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => {
        user = result.user;
    })
}

//Get today's date
function getDate() {
    let today = new Date();
    return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
}

//Send new loan data to database
sendButton.addEventListener('click', function() {
    if(user && objectToBorrow.value && isNaN(objectToBorrow.value) && amount.value && !isNaN(amount.value)) {
       let newLoan =  firebase.database().ref().push({
            name: user.displayName,
            object: objectToBorrow.value,
            amount: amount.value,
            date: getDate(),
            returned: "",
            });
        objectToBorrow.value = "";
        amount.value = "";
    }
    else console.log("bad input!");
});

//Draw database to table
function populateTable(snapshot) {
    let loanArray = [];
    snapshot.forEach(function(childSnapshot) {
        keys.push(childSnapshot.key);
        loanArray.push(childSnapshot.val());
    });
    for(key of keys) {
        console.log(key);
    }
    for(cell of cells) {
        cell.remove();
    }
    for(item of loanArray) {
        //console.log(item);
        cells.push(nameRow.insertCell().appendChild(document.createTextNode(item.name)));
        cells.push(objectRow.insertCell().appendChild(document.createTextNode(item.object)));
        cells.push(amountRow.insertCell().appendChild(document.createTextNode(item.amount)));
        cells.push(dateRow.insertCell().appendChild(document.createTextNode(item.date)));
        cells.push(returnedRow.insertCell().appendChild(document.createTextNode(item.returned)));
        //let buttonCell = returnedRow.insertCell();
        //let returnButton = cells.push(buttonCell.appendChild(document.createElement("button")));
        //returnButton.style.value = "test";
    }
} 