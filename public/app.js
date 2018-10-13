let name = document.getElementById("borrowerName");
let objectToBorrow = document.getElementById("objectToBorrow");
let amount = document.getElementById("amount");
let sendButton = document.getElementById("sendButton");
let borrowListTable = document.getElementById("borrowListTable");
let nameRow = document.getElementById("nameRow");
let amountRow = document.getElementById("amountRow");
let objectRow = document.getElementById("objectRow");
let dateRow = document.getElementById("dateRow");
let responsibleRow = document.getElementById("responsibleRow");
let returnedRow = document.getElementById("returnedRow");
let loginButton = document.getElementById("loginButton");
let currentUser;
let cells = [];
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
    //Init Firebase
    let config = {
        apiKey: "AIzaSyD6khnayxet1ExZAzmvLr5x29ZiStxopIU",
        authDomain: "ioiolendingsystem.firebaseapp.com",
        databaseURL: "https://ioiolendingsystem.firebaseio.com/",
        storageBucket: "gs://ioiolendingsystem.appspot.com"
      };
    firebase.initializeApp(config);
    let database = firebase.database();
    try {
      let app = firebase.app();
      let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
      document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
    } catch (e) {
      console.error(e);
      document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }
    //Fetch database on startup
    firebase.database().ref().once('value', function(snapshot) {
        populateTable(snapshot);
    });
    //Fetch database on every edit
    firebase.database().ref().on('value', function(snapshot) {
        populateTable(snapshot);
    });
    //Hide input elements if not logged it
   /*  if(!user) {
        name.style.display = "none";
        objectToBorrow.style.display = "none";
        amount.style.display = "none";
        sendButton.style.display = "none";
    } */
    //Setup login
     loginButton.addEventListener("pointerdown", function(){
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
            var provider = new firebase.auth.GoogleAuthProvider();
            // In memory persistence will be applied to the signed in Google user
            // even though the persistence was set to 'none' and a page redirect
            // occurred.
            /* user = result.user;
            console.log(user.displayName); */
            return firebase.auth().signInWithRedirect(provider);
            })
            .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
        });
    }); 
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            name.style.display = "block";
            objectToBorrow.style.display = "block";
            amount.style.display = "block";
            sendButton.style.display = "block";
            loginButton.style.display = "none";
            // User is signed in.
            currentUser = user;
            console.log(currentUser.displayName)
        }
        else {
            name.style.display = "none";
            objectToBorrow.style.display = "none";
            amount.style.display = "none";
            sendButton.style.display = "none";
            console.log("no user!")
        }
      });
  });

//Get today's date
function getDate() {
    let today = new Date();
    return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
}

//Push new loan data to database
sendButton.addEventListener("pointerdown", function() {
    if(currentUser && name.value && isNaN(name.value) && objectToBorrow.value && isNaN(objectToBorrow.value) && amount.value && !isNaN(amount.value)) {
       let newLoan = firebase.database().ref().push({
            name: name.value,
            object: objectToBorrow.value,
            amount: amount.value,
            date: getDate(),
            responsible: currentUser.displayName,
            returned: "",
        });
        name.value = "";
        objectToBorrow.value = "";
        amount.value = "";
    }
    //Needs contextual error message based on which input is bad
    else console.log("bad input!");
});

//Draw database to table
function populateTable(snapshot) {
    //Destroy old table, there's probably a cleaner way to do this?
    for(cell of cells) {
        cell.remove();
    }
    for(button of returnButtons) {
        button.remove();
    }
    //Draw new table
    snapshot.forEach(function(childSnapshot) {
        cells.push(nameRow.insertCell().appendChild(document.createTextNode(childSnapshot.val().name)));
        cells.push(objectRow.insertCell().appendChild(document.createTextNode(childSnapshot.val().object)));
        cells.push(amountRow.insertCell().appendChild(document.createTextNode(childSnapshot.val().amount)));
        cells.push(dateRow.insertCell().appendChild(document.createTextNode(childSnapshot.val().date)));
        cells.push(responsibleRow.insertCell().appendChild(document.createTextNode(childSnapshot.val().responsible)));
        let returnButton = document.createElement("button");
        returnButtons.push(returnedRow.insertCell().appendChild(returnButton));
        //Check if object is returned
        if(childSnapshot.val().returned === "") {
            returnButton.textContent = "Not returned";
            //Setup button to return object
            returnButton.addEventListener("pointerdown", function() {
                let snapshot = childSnapshot;
                firebase.database().ref(snapshot.key).set({
                    name: snapshot.val().name,
                    object: snapshot.val().object,
                    amount: snapshot.val().amount,
                    date: snapshot.val().date,
                    responsible: snapshot.val().responsible,
                    returned: getDate()
                });
            });
        }
        else {
            returnButton.textContent = childSnapshot.val().returned; 
        }
    });
}