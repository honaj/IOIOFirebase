let borrowerName = document.getElementById("borrowerName");
let objectToBorrow = document.getElementById("objectToBorrow");
let sendButton = document.getElementById("sendButton");
let borrowListTable = document.getElementById("borrowListTable");
let nameRow = document.getElementById("nameRow");
let objectRow = document.getElementById("objectRow");
let dateRow = document.getElementById("dateRow");
let returnedRow = document.getElementById("returnedRow");
let cells = [];

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
    let realtimeRef = firebase.database().ref('/users');
    realtimeRef.once('value', function(snapshot) {
        console.log(snapshot.val());
    });
    realtimeRef.on('value', function(snapshot) {
        //console.log(snapshot.val());
        
    });
  });

  sendButton.onclick = function() {
    if(borrowerName.value && objectToBorrow.value) {
        let today = new Date();
        let fullDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        let newLoan = {name: borrowerName.value, object: objectToBorrow.value, date: fullDate, returned: false};
        firebase.database().ref('users/'+ newLoan.name).set({
            name: newLoan.name,
            object: newLoan.object,
            date: newLoan.date,
            returned: newLoan.returned
          });
        borrowerName.value = "";
        objectToBorrow.value = "";
    }
}

function populateTable () {
    for(cell of cells) {
        cell.remove();
    }
    for(item of list) {
        //console.log(item);
        cells.push(nameRow.insertCell().appendChild(document.createTextNode(item.name)));
        cells.push(objectRow.insertCell().appendChild(document.createTextNode(item.object)));
        cells.push(dateRow.insertCell().appendChild(document.createTextNode(item.date)));
        let buttonCell = returnedRow.insertCell();
        cells.push(buttonCell.appendChild(document.createTextNode(item.returned)));
        //document.createElement("button")
    }
} 