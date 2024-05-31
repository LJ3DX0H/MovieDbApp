let actors = [];
let connection = null;

let actorIdToUpdate = -1;

getdata();
setupSignalR();

function setupSignalR() {
      connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:53910/hub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("ActorCreated", (user, message) => {
        getdata();
    });

    connection.on("ActorDeleted", (user, message) => {
        getdata();
    });

    connection.on("ActorUpdated", (user, message) => {
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


async function getdata(){
    await fetch('http://localhost:53910/actor')
            .then(x => x.json())
            .then(y => {
                actors = y;
                //console.log(actors);
                display();
            });
}



function display() {
    document.getElementById('resultarea').innerHTML = "";
    actors.forEach(t => {
        document.getElementById('resultarea').innerHTML +=
            "<tr><td>" + t.actorId + "</td><td>" +
            t.actorName + "</td><td>" +
        `<button type="button" onclick="remove(${t.actorId})">Delete</button>` +
        `<button type="button" onclick="showupdate(${t.actorId})">Update</button>`
            + "</td></tr>";

    });
}

function remove(id) {
    fetch('http://localhost:53910/actor/' + id, {
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
    document.getElementById('actortoupdate').value = actors.find(t => t['actorId'] == id)['actorName'];
    document.getElementById('uformdiv').style.display = 'flex';
    actorIdToUpdate = id;

}

function create() {
    let name = document.getElementById('newActorName').value;
    fetch('http://localhost:53910/actor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                actorName: name
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
    let name = document.getElementById('actortoupdate').value;
    fetch('http://localhost:53910/actor', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                actorName: name, actorId: actorIdToUpdate }),
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

function myFunc2() {
    location.replace("director.html")
}
function myFunc3() {
    location.replace("movie.html")
}
function myFunc4() {
    location.replace("role.html")
}