let roles = [];
let connection = null;

let roleIDtoUpdate = -1;

getdata();
setupSignalR();

function setupSignalR() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:53910/hub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("RoleCreated", (user, message) => {
        getdata();
    });

    connection.on("RoleDeleted", (user, message) => {
        getdata();
    });

    connection.on("RoleUpdated", (user, message) => {
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
    await fetch('http://localhost:53910/role')
        .then(x => x.json())
        .then(y => {
            roles = y;
            //console.log(roles);
            display();
        });
}



function display() {
    document.getElementById('resultarea').innerHTML = "";
    roles.forEach(t => {
        document.getElementById('resultarea').innerHTML +=
            "<tr><td>" + t.roleId + "</td><td>" +
            t.roleName + "</td><td>" +
            `<button type="button" onclick="remove(${t.roledId})">Delete</button>` +
            `<button type="button" onclick="showupdate(${t.roledId})">Update</button>`
            + "</td></tr>";

    });
}

function remove(id) {
    fetch('http://localhost:53910/role/' + id, {
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
    document.getElementById('roletoupdate').value = roles.find(t => t['roleId'] == id)['roleName'];
    document.getElementById('uformdiv').style.display = 'flex';
    roleIDtoUpdate = id;

}

function create() {
    let name = document.getElementById('newRoleName').value;
    fetch('http://localhost:53910/role', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                roleName: name
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
    let name = document.getElementById('roletoupdate').value;
    fetch('http://localhost:53910/role', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                roleName: name, roleId: roleIDtoUpdate
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