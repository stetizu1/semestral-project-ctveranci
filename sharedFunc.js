const getResultFor = (time) => {
    try {
        let resultStringField = localStorage.getItem(time);
        if(resultStringField === null) return [];
        return JSON.parse(resultStringField);
    } catch(e){
        console.warn(e);
    }
};

const saveField = (time, field) => {
    try {
        localStorage.setItem(time, JSON.stringify(field));
    } catch (e){
        console.warn(e);
    }
};

const createTables = (section) => {

    section.appendChild(createHeaderFor(60));
    section.appendChild(createTableFor(60));

    section.appendChild(createHeaderFor(90));
    section.appendChild(createTableFor(90));

    section.appendChild(createHeaderFor(120));
    section.appendChild(createTableFor(120));

    section.appendChild(createHeaderFor(180));
    section.appendChild(createTableFor(180));
};

const createHeaderFor = (time) => {
    let header = document.createElement('h2');
    header.innerHTML = "Výsledky pro "+time+" vteřin";
    return header;
};

const createTableFor = (time) => {
    let table = document.createElement('table');

    //create head
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');


    let order = document.createElement('th');
    let name = document.createElement('th');
    let score = document.createElement('th');

    order.innerHTML = "Pořadí";
    name.innerHTML = "Jméno";
    score.innerHTML = "Skóre";

    tr.appendChild(order);
    tr.appendChild(name);
    tr.appendChild(score);

    thead.appendChild(tr);
    table.appendChild(thead);

    //create content
    let tbody = document.createElement('tbody');

    let tableContent = getResultFor(time);

    for (let i = 0; i < tableContent.length; i++){
        let tr = document.createElement('tr');

        let order = document.createElement('td');
        let name = document.createElement('td');
        let score = document.createElement('td');

        order.innerHTML = (i + 1) + ".";
        name.innerHTML = tableContent[i][0];
        score.innerHTML = tableContent[i][1];

        tr.appendChild(order);
        tr.appendChild(name);
        tr.appendChild(score);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    return table;
};

const setState = (state) => {
    //leaderBoardSection reload
    const leaderBoardSection = document.getElementById("leaderBoardContent");
    leaderBoardSection.innerHTML = "<h2>Žebříček</h2>";

    //show selected section
    let targetSection = document.querySelector(state);
    targetSection.style.display = "block";

    //game content set
    if(state === "#gameContent"){
        let numPlayersField = document.getElementsByName("numPlayerOption");
        if(numPlayersField[1].checked) numPlayers = 2;

        let name1Field = document.getElementById("playerOneName");
        if (name1Field.value.length > 0) player1Name = name1Field.value;

        let mapOption = document.getElementsByName("map");
        if(mapOption[0].checked)map = null;

        let timeOption = document.getElementById("gameTime");
        let time = timeOption.options[timeOption.selectedIndex].value;

        if(numPlayers === 1) {
            gameWindow = new GameWindow(document.getElementById("gameContent"), time, 1, map, player1Name);
        } else {
            let name2Field = document.getElementById("playerTwoName");
            if (name2Field.value.length > 0) player2Name = name2Field.value;

            gameWindow = new GameWindow(document.getElementById("gameContent"), time, 2, map, player1Name, player2Name);
        }
        gameWindow.run();
    }

    else if (state === "#leaderBoardContent"){
        createTables(leaderBoardSection);
    }
}
