let db;

const request = indexedDB.open('budget_tracker', 1);

// update database version changes
request.onupgradeneeded = function(event) {
    // save reference to database
    const db = event.target.result;
    // create an object store 'new item', set it to auto increment
    db.createObjectStore('new_trans', { autoIncrement: true });
};

request.onsuccess = function(event) {
    // when db is successfully created, save reference to db in global variable
    db = event.target.result;

    // check if app is online
    // if yes, run uploadTrans() function to send db data to api
    if (navigator.onLine) {
        uploadTrans();
    }
};

request.onerror = function(event) {
    // log error
    console.log(event.target.errorCode);
};

// saves budget record if there is no internet connection
const saveRecord = record => {
    // open a new transaction with the database
    const transaction = db.transaction(['new_trans'], 'readwrite');

    // access the object store for 'new_trans'
    const transObjectStore = transaction.objectStore('new_trans');

    // add record to store
    transObjectStore.add(record);
};


// listen for app coming back online   
window.addEventListener('online', uploadTrans);