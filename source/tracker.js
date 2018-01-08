// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const request = require('request');

const PAGE_SIZE = 5;

const SERVER_URL = "http://localhost:8081"
const API_KEY = "00000-00000-0000-00000-00000";

const anomaliesList  = document.getElementById("anomalies-list");
const pageButtons    = document.getElementById("page-buttons");
const submissionForm = document.getElementById("submission-form")

var anomalies = [];
var currentPage = 1;

/* -- Actions linking the functions here to HTML objects -- */
submissionForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        SubmitAnomaly();
    })
document.getElementById("refresh")
    .addEventListener('click', () => { GetAnomalies(populateTable) });
document.getElementById("prev-page")
    .addEventListener('click', () => {
        SelectPage(currentPage - 1);
    })
document.getElementById("next-page")
    .addEventListener('click', () => {
        SelectPage(currentPage + 1);
    })
/* -- -- */

function GetAnomalies(onSuccess) {
    clearTable();
    // TODO: show loading icon...
    request({
        url: `${SERVER_URL}/anomaly`,
        headers: {
            'Authentication-Key': API_KEY
        }
    }, function(error, response, body) {
        if (error) {
            console.log("Error in GetAnomalies:", error);
            return;
        }

        if (!response || !body) {
            console.log("Bad response:", {
                response: response, 
                body: body
            })
            return;
        }

        const parsed = JSON.parse(body);
        if (!parsed || parsed.anomalies === undefined) {
            console.log("Parsed response invalid:", {
                parsed: parsed
            })
            return;
        }

        anomalies = parsed.anomalies;

        if (onSuccess)
            onSuccess(anomalies)
    })
}

function SubmitAnomaly() {
    const id = document.getElementById("submit-id");
    const system = document.getElementById("submit-system");
    const typ = document.getElementById("submit-type");
    const name = document.getElementById("submit-name");

    var ok = true;
    if (!id || id.value === "") {
        id.style = "border-color:red;"
        ok = false;
    } else {
        id.style = ""
    }
    if (!system || system.value === "") {
        system.style = "border-color:red;"
        ok = false;
    } else {
        system.style = ""
    }
    if (!typ || typ.value === "") {
        typ.style = "border-color:red;"
        ok = false;
    } else {
        typ.style = ""
    }
    if (!name || name.value === "") {
        name.style = "border-color:red;"
        ok = false;
    } else {
        name.style = ""
    }

    if (!ok) {
        return;
    }

    request.post({
        url: `${SERVER_URL}/anomaly`,
        headers: {
            'Authentication-Key': API_KEY
        },
        method: 'post',
        body: {
            id:     id.value,
            system: system.value,
            type:   typ.value,
            name:   name.value
        },
        json: true
    }, function(err, response, body) {
        if (err) {
            console.log("Error commiting anomaly:", err);
            return;
        }

        // TODO: Some indicator of success?

        id.value = "";
        system.value = "";
        typ.value = "";
        name.value = "";

        GetAnomalies(populateTable)
    })

}

function SelectPage(number) {
    currentPage = number;
    populateTable(anomalies);
}

function appendPageButton(number) {
    var button = document.createElement('BUTTON');
    button.appendChild(document.createTextNode(number));
    button.addEventListener('click', () => {
        console.log("selecting page: ", number);
        SelectPage(number);
    });
    if (number == currentPage) {
        button.classList.add("button-primary")
    }
    pageButtons.appendChild(button);
}

function paginate(anomalies) {
    pageButtons.innerHTML = '';
    if (anomalies.length < PAGE_SIZE) {
        return anomalies;
    }

    for (var i = 0; i < anomalies.length / PAGE_SIZE; i++) {
        appendPageButton(i + 1);
    }

    var anomaliesToShow = [];
    for (var i = (currentPage - 1) * PAGE_SIZE; i < (currentPage - 1) * PAGE_SIZE + PAGE_SIZE; i++) {
        if (i >= anomalies.length) {
            break;
        }
        anomaliesToShow.push(anomalies[i]);
    }

    return anomaliesToShow;
}

function clearTable() {
    anomaliesList.innerHTML = '';
}

function createCell(tr, data) {
    var td = document.createElement('TD');
    td.appendChild(document.createTextNode(data))
    tr.appendChild(td);
}

function populateTable(anomalies) {
    if (!anomaliesList) {
        console.log("Anomalies table is null!");
        return;
    }

    if (!anomalies || anomalies.length == 0) {
        console.log("No anomalies.")
        return;
    }

    if (currentPage < 1) {
        currentPage = 1;
    }

    const maxPage = Math.ceil(anomalies.length / PAGE_SIZE);
    console.log(currentPage, maxPage);
    if (currentPage > maxPage) {
        currentPage--;
    }

    clearTable();

    paginate(anomalies).forEach((anomaly) => {
        var tr = document.createElement('TR');
        createCell(tr, anomaly.id);
        createCell(tr, anomaly.system);
        createCell(tr, anomaly.type);
        createCell(tr, anomaly.name);
        createCell(tr, anomaly.created);
        anomaliesList.appendChild(tr);
    });
}

// Populate the table with the anomalies.
GetAnomalies(populateTable);