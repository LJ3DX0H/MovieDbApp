let directors = [];
let connection = null;

let directorToUpdate = -1;

getdata();
setupSignalR();

function setupSignalR() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:53910/hub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("DirectorCreated", (user, message) => {
        getdata();
    });

    connection.on("DirectorDeleted", (user, message) => {
        getdata();
    });

    connection.on("DirectorUpdated", (user, message) => {
        getdata();
    });


    connection.onclose
        (async () => {
            await start();
        });
    start();
}

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};


async function getdata() {
    await fetch('http://localhost:53910/director')
        .then(x => x.json())
        .then(y => {
            directors = y;
            //console.log(directors);
            display();
        });
}



function display() {
    document.getElementById('resultarea').innerHTML = "";
    directors.forEach(t => {
        document.getElementById('resultarea').innerHTML +=
            "<tr><td>" + t.directorId + "</td><td>" +
        t.directorName + "</td><td>" +
        `<button type="button" onclick="remove(${t.directorId})">Delete</button>` +
        `<button type="button" onclick="showupdate(${t.directorId})">Update</button>`
            + "</td></tr>";

    });
}

function remove(id) {
    fetch('http://localhost:53910/director/' + id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'applciation/json', },
        body: null
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            getdata();
        })
        .cath((error) => { console.error("Error", errror); })
}

function showupdate(id) {
    document.getElementById('directortoupdate').value = directors.find(t => t['directorId'] == id)['directorName'];
    document.getElementById('uformdiv').style.display = 'flex';
    directorToUpdate = id;

}

function create() {
    let name = document.getElementById('newDirectorName').value;
    fetch('http://localhost:53910/director', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                directorName: name
            }),
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            getdata();
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}

function update() {
    let name = document.getElementById('directortoupdate').value;
    fetch('http://localhost:53910/director', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                directorName: name, directorId: directorToUpdate
            }),
    })
        .then(response => response)
        .then(data => {
            console.log('Success:', data);
            getdata();
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}