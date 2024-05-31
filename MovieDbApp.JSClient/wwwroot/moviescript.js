let movies = [];
let connection = null;

let movieIdToUpdate = -1;

getdata();
setupSignalR();

function setupSignalR() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:53910/hub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("MovieCreated", (user, message) => {
        getdata();
    });

    connection.on("MovieDeleted", (user, message) => {
        getdata();
    });

    connection.on("MovieUpdated", (user, message) => {
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
    await fetch('http://localhost:53910/movie')
        .then(x => x.json())
        .then(y => {
            movies = y;
            //console.log(movies);
            display();
        });
}



function display() {
    document.getElementById('resultarea').innerHTML = "";
    movies.forEach(t => {
        document.getElementById('resultarea').innerHTML +=
            "<tr><td>" + t.movieId + "</td><td>" +
            t.title + "</td><td>" +
            `<button type="button" onclick="remove(${t.movieId})">Delete</button>` +
            `<button type="button" onclick="showupdate(${t.movieId})">Update</button>`
            + "</td></tr>";

    });
}

function remove(id) {
    fetch('http://localhost:53910/movie/' + id, {
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
    document.getElementById('movietoupdate').value = movies.find(t => t['movieId'] == id)['title'];
    document.getElementById('uformdiv').style.display = 'flex';
    movieIdToUpdate = id;

}

function create() {
    let name = document.getElementById('newMovieName').value;
    fetch('http://localhost:53910/movie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                title: name
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
    let name = document.getElementById('movietoupdate').value;
    fetch('http://localhost:53910/movie', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                title: name, movieId: movieIdToUpdate
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