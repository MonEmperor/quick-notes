window.onload = function () {
    const userId = localStorage.getItem('userId');
    document.getElementById("userName").innerHTML = localStorage.getItem('userName');
    document.getElementById("avatar").src = "img/" + localStorage.getItem('avatar');

    let url = "http://localhost:4000/api/folders/user/" + userId;
    ajaxCall(url, "GET", processFolderNotes);
}

function placeContentInMainBody(html) {
    document.getElementById("main-body").innerHTML = html;
}

function ajaxCall(url, action, callback, post = null) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(action, url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xmlhttp.send(post);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200 || xmlhttp.status === 201) {
                callback(xmlhttp.responseText);
            }
            else
                callback("Error \n" + xmlhttp.responseText);
        }
    }
}

function onEditNotes(folderObj) {
    let html = "<div class='pt-4 pl-2 pr-2'>"
    html += "<div class='p-2 pl-2 pr-2 m-2' style='background: #C4C4C4;'>";
    html += "<div class='form-label' for='folderName'><i class='fa fa-sticky-note-o pr-2'></i>Folder Name: ";
    html += "<input type='text' id='folderName' class='form-control' value='" + folderObj.name + "'/>";
    html += "</div>";
    html += "</div>";

    // Print Notes
    html += "<div class='p-2'>";
    for (let i = 0; i < folderObj.NOTEs.length; i++) {
        html += "<div class='w-100 pt-2 pl-2 pr-2 mb-3' style='background: rgba(244,236,194,0.5);'>";
        html += "<label class='form-label pl-2' for='noteTitle'><i class='fa fa-sticky-note-o pr-2'></i>Note Title</label>";
        html += "<input type='text' id='noteTitle' class='form-control' value='" + folderObj.NOTEs[i].title + "'/>";
        html += "<label class='form-label pl-2 pt-2' for='noteTitle'>Note Content</label>";
        html += "<textarea id='noteContent' class='w-100 pl-2 pr-2'>" + folderObj.NOTEs[i].content + "</textarea>";
        html += "</div>";
    }
    html += "</div>";

    html += "</div>"; // for the main div
    placeContentInMainBody(html);
}

function onCreateUser() {
    let username = document.getElementById("Username").value;
    let password = document.getElementById("Password").value;

    let url = "http://localhost:4000/api/users/create";
    let post = JSON.stringify({
        username: username, password: password, dark_mode: true,
        avatar: 1,
    });

    ajaxCall(url, "POST", alert, post);
}

function onLogin() {
    let username = document.getElementById("Username").value;
    let password = document.getElementById("Password").value;

    let url = "http://localhost:4000/api/users/login";
    let post = JSON.stringify({
        username: username, password: password
    });

    ajaxCall(url, "POST", redirectToMainPage, post);

}

function redirectToMainPage(user) {
    window.location.replace("/index");

    let url = "http://localhost:4000/api/folders/" + user.id;
    ajaxCall(url, "GET", processFolderNotes, post);
}

function processFolderNotes(response) {
    let html = "<div class='container-fluid'>";
    let folders = JSON.parse(response);

    for (let i = 0; i < folders.length; i++) {

        var folderObj = folders[i];
        var folderJson = JSON.stringify(folderObj);

        if ((i % 3) == 0)

            html += "<div class='row mt-5 mb-5'>";

        // Printing Folders
        html += "<div class='col-4'><div class='ml-1 p-2 roundeda' style='background: #808080; height: 220px; '>";
        html += "<div class='rounded-pill p-2 m-1' style='background: #C4C4C4;'>" + folderObj.name;
        html += "<div class='float-right'>";
        html += "<button type='button' class='btn p-0 pr-1'><i class='fa fa-star'></i></button>";
        html += "<button type='button' class='btn p-0 pr-1' onClick='onEditNotes(" + folderJson + ")'><i class='fa fa-pencil-square-o'></i></button>";
        html += "</div>";
        html += "</div>";

        // Printing Notes in folders
        let isRowNoteClosed;
        html += "<div class='container-fluid'>";
        for (let j = 0; j < folderObj.NOTEs.length; j++) {
            if ((j % 4) == 0) {
                html += "<div class='row mt-3 mb-3'>";
                isRowNoteClosed = false;
            }

            html += "<div class='col-3'><div style='background: #D9D9D9; height: 50px;'></div></div>";

            if (((j + 1) % 4) == 0) {
                html += "</div>"; //This is the notes row div
                isRowNoteClosed = true;
            }
            if (j == 7) break;
        }
        if (isRowNoteClosed == false) html += "</div>"; //This is the final notes row div
        html += "</div>"; //This is the note container div

        //Closes the folder div
        html += "</div></div>";
        if (((i + 1) % 3) == 0)
            html += "</div>";

    }
    html += "</div>";
    placeContentInMainBody(html);
}