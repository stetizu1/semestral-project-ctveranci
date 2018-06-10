//default values for game settings
let numPlayers = 1;
let map = null;
let player1Name = "Player 1";
let player2Name = "Player 2";
let gameWindow = null;

/**
 * Returns field with single player game results stored in local storage
 *
 * @param time - time of game for what we are looking
 * @returns {Array} of tuples [player, score] - results of high scores of given time games
 */
const getResultFor = (time) => {
    try {
        let resultStringField = localStorage.getItem(time);
        if(resultStringField === null) return [];
        return JSON.parse(resultStringField);
    } catch(e){
        console.warn(e);
    }
};

/**
 * Save given field to local storage with time as a key
 *
 * @param time - time of game that we are saving results for
 * @param field - field of tuples that will be saved to local storage with given time as a key
 */
const saveField = (time, field) => {
    try {
        localStorage.setItem(time, JSON.stringify(field));
    } catch (e){
        console.warn(e);
    }
};

/**
 * Create tables for results from local storage
 *
 * @param section - where tables will be placed
 */
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

/**
 * Creates header for given table with given time
 *
 * @param time - time that will be mentioned in header (it's results will be in table under it)
 * @returns {Element} header h2 with inner text
 */
const createHeaderFor = (time) => {
    let header = document.createElement('h2');
    header.innerHTML = "Výsledky pro "+time+" vteřin";
    return header;
};

/**
 * Creates table with results from local storage
 *
 * @param time - that is result for
 * @returns {Element} table with results for given time
 */
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

/**
 * Reloads all states and load given state
 * @param state - visible section id
 */
const setState = (state) => {
    //video in intro pause
    let video = document.querySelector("#introductionContent article video");
    video.pause();

    let allSections = document.querySelectorAll("section");

    //hide other sections
    for(let i = 0; i < allSections.length; i++) {
        allSections[i].style.display = "none";
    }

    //gameContent reload
    let gameContent = document.getElementById("gameContent");
    gameContent.innerHTML = "<h2>Hra</h2>";
    if(gameWindow !== null){
        gameWindow.destroyWindow();
        gameWindow = null;
    }

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
        if(mapOption[0].checked) map = null;

        let timeOption = document.getElementById("gameTime");
        let time = timeOption.options[timeOption.selectedIndex].value;

        if(numPlayers === 1) {
            gameWindow = new GameWindow(document.getElementById("gameContent"), time, map, player1Name);
        } else {
            let name2Field = document.getElementById("playerTwoName");
            if (name2Field.value.length > 0) player2Name = name2Field.value;

            gameWindow = new GameWindow(document.getElementById("gameContent"), time, map, player1Name, player2Name);
        }
        gameWindow.run();
    }

    else if (state === "#leaderBoardContent"){
        createTables(leaderBoardSection);
    }
};

/**
 * Load selected item to menu (for history API and going to menu from game)
 *
 * @param state - visible section id
 */
const setMenu = (state) => {
    if(state === "#logoContent"){
        let radiosToUncheck = document.getElementsByName("radioButton");
        for(let i = 0; i < radios.length; i++) {
            radiosToUncheck[i].checked = false;
        }
        return;
    }
    let menuId = state.replace("Content", "");
    const currentMenuOption = document.querySelector(menuId);
    currentMenuOption.checked = true;
};

/**
 * Creates svg map and event listeners on it
 *
 * @param createdMap - map that will be set (saved result to)
 */
const createSvg = (createdMap) => {
    let svg = document.querySelector("#svgMap");
    const ROWS = 12;
    const COLUMNS = 20;

    //create default map
    for (let i = 0; i < ROWS; i++) {
        let line = [];
        for (let j = 0; j < COLUMNS; j++) {
            line.push(-2);

        }
        createdMap.push(line);
    }

    //create svgMap
    const svgNS = "http://www.w3.org/2000/svg";
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            //creates rect and set it's attributes
            let rect = document.createElementNS(svgNS, 'rect');
            rect.setAttributeNS('', 'x', '' + j);
            rect.setAttributeNS('', 'y', '' + i);
            rect.setAttributeNS('', 'height', '1');
            rect.setAttributeNS('', 'width', '1');

            //set color due to position
            let color = "";
            if (i % 2 === 0) {
                if (j % 2 === 0) color = "#2a7f35";
                else color = "#2c8d3d";
            } else {
                if (j % 2 === 0) color = "#2c8d3d";
                else color = "#2a7f35";
            }
            rect.setAttributeNS('', 'fill', color);

            //every field but last row and column
            if (i !== ROWS - 1 && j !== COLUMNS -1) {
                //set click event
                rect.addEventListener("click", () => {

                    //find column and line
                    let col = parseInt(rect.getAttribute("x"));
                    let line = parseInt(rect.getAttribute("y"));

                    //if already tree there, do nothing
                    if(createdMap[line][col] !== -2 ||
                        createdMap[line + 1][col] !== -2 ||
                        createdMap[line][col + 1] !== -2 ||
                        createdMap[line + 1][col + 1] !== -2
                    ) return;

                    //find checked tree number
                    let treeNumber = 0;
                    let treesRadioButtons = document.getElementsByName("treeOption");
                    for(let i = 0; i < 9; i++){
                        if (treesRadioButtons[i].checked) treeNumber = parseInt(treesRadioButtons[i].value);
                    }

                    //set tree on createdMap
                    createdMap[line][col] = treeNumber;
                    createdMap[line + 1][col] = treeNumber;
                    createdMap[line][col + 1] = treeNumber;
                    createdMap[line + 1][col + 1] = treeNumber;

                    //create group that represents tree
                    let g = document.createElementNS(svgNS, 'g');
                    let circle = document.createElementNS(svgNS, 'circle');
                    circle.setAttributeNS('', 'cx', (col+1) + '');
                    circle.setAttributeNS('', 'cy', (line+1) + '');
                    circle.setAttributeNS('', 'r', '1');
                    circle.setAttributeNS('', 'fill', '#8d0002');
                    let text = document.createElementNS(svgNS, 'text');
                    text.setAttributeNS('', 'x', (col+1) + '');
                    text.setAttributeNS('', 'y', (line+1.15) + '');
                    text.setAttributeNS('', 'font-family', 'Verdana');
                    text.setAttributeNS('', 'font-size', '0.5');
                    text.setAttributeNS('', 'text-anchor', 'middle');
                    text.setAttributeNS('', 'fill', '#FFFFFF');
                    text.innerHTML = treeNumber;

                    //add removing group on click
                    g.addEventListener("click", () => {
                        //find column and line
                        let c = parseInt(circle.getAttribute("cx")) - 1;
                        let l = parseInt(circle.getAttribute("cy")) - 1;

                        //delete tree on createdMap
                        createdMap[l][c] = -2;
                        createdMap[l + 1][c] = -2;
                        createdMap[l][c + 1] = -2;
                        createdMap[l + 1][c + 1] = -2;

                        //delete group
                        svg.removeChild(g);
                    });

                    //append children to group
                    g.appendChild(circle);
                    g.appendChild(text);

                    //append group to svg
                    svg.appendChild(g)
                });
            }
            //append rect to svg
            svg.appendChild(rect);
        }
    }
};

/**
 * Function for creating downloadable file
 *
 * @param filename - name of file created
 * @param text - string that will be in file
 */
const download = (filename, text) =>{
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};