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
let loginStatus = document.getElementById("loginStatus");
let errorStatus = document.getElementById("errorStatus");
let currentUser;
let validUsers;
let cells = [];
let returnButtons = [];

document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('touchstart', function() {
        
    }, false);
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
    } catch (e) {
      console.error(e);
    }
    //Fetch database on startup
    firebase.database().ref("Loans").once('value', function(snapshot) {
        populateTable(snapshot);
    });
    //Fetch database on every edit
    firebase.database().ref("Loans").on('value', function(snapshot) {
        populateTable(snapshot);
    });
     loginButton.addEventListener("pointerdown", function(e){
        e.preventDefault();
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
            let provider = new firebase.auth.GoogleAuthProvider();
            return firebase.auth().signInWithRedirect(provider);
            })
            .catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;
        });
    }); 
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            //Check if user's Google account is registered as an admin account in the database
            firebase.database().ref("AdminAccounts").once("value", function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    if(user.email === childSnapshot.val()) {
                        currentUser = user;
                        name.style.display = "block";
                        objectToBorrow.style.display = "block";
                        amount.style.display = "block";
                        sendButton.style.display = "block";
                        loginButton.style.display = "none";
                        loginStatus.innerHTML = "Logged in as " + currentUser.displayName;
                        return false;
                    }
                });
            });
        }
        //Hide input elements if not logged in or login not a registered admin
        else if(!user || !currentUser) {
            name.style.display = "none";
            objectToBorrow.style.display = "none";
            amount.style.display = "none";
            sendButton.style.display = "none";
            if (!user) loginStatus.innerHTML = "Not logged in";
            else loginStatus.innerHTML = "You're not an admin!";
        }
    });

//Get today's date
function getDate() {
    let today = new Date();
    return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
}

//Setup send button to push new loan data to database
sendButton.addEventListener("pointerdown", function(e) {
    e.preventDefault();
    if(currentUser && name.value && isNaN(name.value) && objectToBorrow.value && isNaN(objectToBorrow.value) && amount.value && !isNaN(amount.value)) {
       let newLoan = firebase.database().ref("Loans").push({
            name: name.value,
            object: objectToBorrow.value,
            amount: amount.value,
            date: getDate(),
            responsible: currentUser.displayName,
            returned: ""
        });
        //Reset input form
        name.value = "";
        objectToBorrow.value = "";
        amount.value = "";
        errorStatus.innerHTML = "";
    }
    //Throw error if input is bad
    else errorStatus.innerHTML = "Bad input!";
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
        if(childSnapshot.val().responsible != null)
        {
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
                if(currentUser)
                {
                    returnButton.addEventListener("pointerdown", function() {
                        let snapshot = childSnapshot;
                        firebase.database().ref("Loans/" + snapshot.key).set({
                            name: snapshot.val().name,
                            object: snapshot.val().object,
                            amount: snapshot.val().amount,
                            date: snapshot.val().date,
                            responsible: snapshot.val().responsible,
                            returned: getDate()
                        });
                    });
                }
            }
            else {
                returnButton.textContent = childSnapshot.val().returned; 
            }
        }  
    });
    }
});
