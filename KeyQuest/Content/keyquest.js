function report(elementId, message) {
    var element = document.createElement('p');
    var parent = document.getElementById(elementId);
    parent.appendChild(element);
    element.innerHTML = message;
};

function gameOver(message) {
    var element = document.createElement('div');
    element.className = "game-over";
    document.body.appendChild(element);
    element.innerHTML = "<h2>GAME OVER!</h2>" + message;
}

function victory(message) {
    var element = document.createElement('div');
    element.className = "victory";
    document.body.appendChild(element);
    element.innerHTML = "<h2>YOU HAVE WON!</h2>" + message;
}

function questify(url, elementId) {
    return (function (item) {
        var promise = new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            //Send the proper header information along with the request
            request.open('POST', url);
            request.setRequestHeader("Content-type", "application/json");
            request.setRequestHeader("Accept", "application/json");
            request.onload = function () {
                if (request.status == 200) {
                    var result = JSON.parse(request.response);
                    report(elementId, result.text);
                    resolve(result.item); // we got data here, so resolve the Promise
                } else {
                    reject(Error(request.statusText)); // status is not 200 OK, so reject
                }
            };

            request.onerror = function () {
                reject(Error('Error fetching data.')); // error occurred, reject the  Promise
            };
            request.send(JSON.stringify(item)); //send the request
        });
        return (promise);
    });
}

function runQuest() {
    //TODO: extend this runQuest method to complete all three quests and retrieve all three keys.
    var talkToTheKnight = questify("/knight", "ctrl-div");
    var talkToTheWizard = questify("/wizard", "ctrl-div");
    var talkToTheWeaver = questify("/weaver", "ctrl-div");
    var talkToTheCleric = questify("/cleric", "alt-div");
    var talkToTheKeysmith = questify("/keysmith", "alt-div");
    var talkToTheEarl = questify("/earl", "delete-div");
    var bagOfGold = { name: "Bag of Gold" };
    var quests = new Array();

    var controlKeyQuest = talkToTheWeaver()
        .then(talkToTheKnight)
        .then(talkToTheWizard);
    var altKeyQuest = talkToTheKeysmith({ name: "Bag Of Gold" })
        .then(talkToTheCleric);
    var deleteKeyQuest = talkToTheEarl({ name: "Diamond of Multiple Inheritance" });

    quests.push(controlKeyQuest, altKeyQuest, deleteKeyQuest);

    Promise.all(quests)
        .then(function (values) {
            if (values.length === 3 && values.every(function (e) {
                return (/key/i.test(e.name));
            })) {
                victory("You have saved the kingdom!");
            } else {
                gameOver("You need to collect all three keys.");
            }
        })
        .catch(gameOver);

}
