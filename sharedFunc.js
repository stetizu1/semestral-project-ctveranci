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
