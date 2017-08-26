$(document).ready(function() {

  document.styleSheets[1].disabled = true;
  document.styleSheets[2].disabled = true;
  document.styleSheets[3].disabled = true;
  document.styleSheets[4].disabled = true;
  document.getElementById('theme' + defaultThemeIndex).checked = true;

  createLayout('classLayout');
  createLayout('carpetLayout');
  seatingChartMode('layout');
  carpetChartMode('carpetLayout');
  toggleView('classLayout', 'tableView');
  toggleView('carpetLayout', 'tableView');
  updateSeatsNeeded();
  updateCarpetSpotsNeeded();
  document.getElementById('versionLabel').innerText = version;

  // Seating Chart Modes -------------------
  // var onTableView = true;
  var opacity = 0.45;
  // Initialize View Mode
  $("#genderViewBtn").fadeTo("fast", opacity);

  // var onLayoutMode = true;
  // Initialize Click Mode
  $("#studentsModeBtn").fadeTo("fast", opacity);

  $("#carpetGenderViewBtn").fadeTo("fast", opacity);
  $("#carpetStudentsModeBtn").fadeTo("fast", opacity);


  
  // Carpet Chart Modes -------------------
  

  // var sheet = document.createElement('style');
  // sheet.innerHTML = "{}";
  // sheet.id = "currentTheme";
  // document.body.appendChild(sheet);
});

// -------------------------- Global Vars --------------------------
// Version
var version = "2.1";
var students = [];
var ranomizedList = [];
var seatsNeeded = 0;
var carpetSpotsNeeded = 0;

var btnColorName = "red";
var btnColor = "red";
var btnColorNameCarpet = "red";
var btnColorCarpet = "red";

var currentCarpetChartMode = "carpetLayout";
var currentChartMode = "layout";

var selectedBtn = null;
var selectedCarpetBtn = null;

  function fade(id) {
    $(id).fadeTo("fast", 0.45);
  } 

  function unFade(id) {
    $(id).fadeTo("fast", 1);
  }

// ------------------------- Menu Bar ---------------------------
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// ------------------------- Class List ---------------------------
function addStudent() {
    // Add new input field to type student name
	var classList = document.getElementById("classListTable");
	var numStudents = classList.getElementsByTagName("tr").length;
	var newRow = classList.insertRow(numStudents);
	var newTextBox = document.createElement("INPUT");
    newTextBox.class = "studentBox";
    newRow.appendChild(newTextBox);

    // Add male/female radio buttons on same row

    var maleRadioBtn = document.createElement("INPUT");
    maleRadioBtn.setAttribute("type", "radio");
    maleRadioBtn.setAttribute("name", "student" + numStudents);
    // maleRadioBtn.style.backgroundColor = "blue";
    newRow.appendChild(maleRadioBtn);

    var femaleRadioBtn = document.createElement("INPUT");
    femaleRadioBtn.setAttribute("type", "radio");
    femaleRadioBtn.setAttribute("name", "student" + numStudents);
    // femaleRadioBtn.style.backgroundColor = "red";
    newRow.appendChild(femaleRadioBtn);

    // Add button to remove student
    var removeButton = document.createElement("BUTTON");
    removeButton.classList += ' mdl-button';
    removeButton.classList += ' mdl-js-button';
    removeButton.classList += ' mdl-button--icon';
    removeButton.classList += ' mdl-js-ripple-effect';

    removeButton.onclick = function() {
        document.getElementById("classListTable").deleteRow(this.parentNode.rowIndex);
        seatsNeeded--;
        carpetSpotsNeeded--;
        updateSeatsNeeded();
        updateCarpetSpotsNeeded();
    } 
    removeButton.innerHTML = "<i class='material-icons'>cancel</i>";
    // var text = document.createTextNode("X");
    // removeButton.appendChild(text);
    newRow.appendChild(removeButton);

    // Increment seats needed count
    seatsNeeded++;
    carpetSpotsNeeded++;
    updateSeatsNeeded();
    updateCarpetSpotsNeeded();
    unsavedChanges = true;
    addAsterisk();
}

function updateSeatsNeeded() {
    var label = document.getElementById("seatsNeeded");
    label.innerText = "Seats Left to Add: " + seatsNeeded;
    if (seatsNeeded > 0) {
        label.style.border = "3px solid red";
    }
    else if (seatsNeeded < 0) {
        label.style.border = "3px solid orange";
    } else {
        label.style.border = "3px solid green";
    }
}

function updateCarpetSpotsNeeded() {
    var label = document.getElementById("carpetSpotsNeeded");
    label.innerText = "Carpet Spots Left to Add: " + carpetSpotsNeeded;
    if (carpetSpotsNeeded > 0) {
        label.style.border = "3px solid red";
    }
    else if (carpetSpotsNeeded < 0) {
        label.style.border = "3px solid orange";
    } else {
        label.style.border = "3px solid green";
    }
}

function updateList() {
    students = [];
    var classList = document.getElementById("classListTable");
    var row, student;
    for (var m = 0; row = classList.rows[m]; m++){
        // row.childNodes[0].value !== "" ? students.push(row.childNodes[0].value);
        students.push(row.childNodes[0].value);
    }
}

// ------------------------- Randomize List ---------------------------
function randomizeList() {
    updateList();
    var tempStudents = students;
    randomizedList = [];
    var len = students.length;
    var high = len;
    var num, temp;
    for (var i = 0; i < len; i++) {
        num = Math.floor(Math.random() * high);
        temp = students[num];
        randomizedList[i] = temp;
        tempStudents.splice(num, 1);
        high--;
    }

    // For Debugging --------------------
    // document.getElementById("list").innerHTML = randomizedList.toString();
}

function randomizeSeatingChart() {
    if (seatsNeeded > 0) {
        alert("You do not have enough seats for your students. Please add more.");
        return;
    }

    randomizeList();
    var row, cell;
    var i = 0;
    var seatingChart = document.getElementById("classLayout");
    for (var r = 0; row = seatingChart.rows[r]; r++) {
        for (var c = 0; cell = row.cells[c]; c++) {
            cell = cell.childNodes[0];
            if (cell.isSeat) {
                if (i > randomizedList.length - 1) {
                    cell.innerText = "EMPTY"
                }
                else {
                    cell.innerText = randomizedList[i];
                    i++;
                }
                
            }
        }
    }
    unsavedChanges = true;
    addAsterisk();

    // If in gender view mode, update seat colors
    if (classView === "genderView") {
        colorSeatsByGender("classLayout");
    }
}

function randomizeCarpetChart() {
    if (carpetSpotsNeeded > 0) {
        alert("You do not have enough seats for your students. Please add more.");
        return;
    }

    randomizeList();
    var row, cell;
    var i = 0;
    var seatingChart = document.getElementById("carpetLayout");
    for (var r = 0; row = seatingChart.rows[r]; r++) {
        for (var c = 0; cell = row.cells[c]; c++) {
            cell = cell.childNodes[0];
            if (cell.isSeat) {
                if (i > randomizedList.length - 1) {
                    cell.innerText = ""
                }
                else {
                    cell.innerText = randomizedList[i];
                    i++;
                }
                
            }
        }
    }
    unsavedChanges = true;
    addAsterisk();

    // If in gender view mode, update seat colors
    if (carpetView === "genderView") {
        colorSeatsByGender("carpetLayout");
    }
}

// var side_bar_open = false;
// ------------------------- Sidebar -------------------------
function toggle_sidebar(x) {
    mySidebar = document.getElementById("ClassListSidebar");
    if (!mySidebar.hasOwnProperty("opened")){
        mySidebar.opened = false;
    }

    if (mySidebar.opened) {
        mySidebar.opened = false;
        close_sidebar();
    }
    else {
        mySidebar.opened = true;
        open_sidebar();
    }
    x.classList.toggle("change");
}
function open_sidebar() {
  // document.getElementById("sidebar-btn").innerHTML = "&#8678;"
  document.getElementById("main").style.marginLeft = "215px";//"16%";
  document.getElementById("main").style.display = "inline"; // Fixed sidebar issue
  document.getElementById("ClassListSidebar").style.width = "215px";//"16%";
  document.getElementById("ClassListSidebar").style.display = "inline-block";
  // document.getElementById("openNav").style.display = 'none';
}
function close_sidebar() {
  // document.getElementById("sidebar-btn").innerHTML = "&#8680;"
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("ClassListSidebar").style.display = "none";
  // document.getElementById("openNav").style.display = "inline-block";
}

// --------------------- Seating & Carpet Charts -----------------------------

function createLayout(table) {
    var layout = document.getElementById(table);
    var rows, cols;

    if (table === 'classLayout') {
        rows = numRows;
        cols = numCols;
    }
    else if (table === 'carpetLayout') {
        rows = numCarpetRows;
        cols = numCarpetCols;
    }

    for (var r = 0; r < rows; r++) {
        var newRow = getNewChartRow(table, r);
        layout.appendChild(newRow);
    }
    // var frontLabel = document.createElement("tr");
    // frontLabel.innerText = "Front";
    // frontLabel.setAttribute("class", "frontLabel");
    // layout.appendChild(frontLabel);
}

function swapText(btn) {
    if (currentChartMode === "layout") {
        if (btnColor !== "black") {
            btn.style.backgroundColor = btnColor;
            btn.style.color = "black";
        }
        
        if (btnColorName === "none") {
            if (btn.isSeat) {
                seatsNeeded++;
                updateSeatsNeeded();
                btn.isSeat = false;
            }
            btn.innerText = "";
        }
        else if (btnColorName === "black") { // Furniture
            var label = prompt("Give this item a label:");
            if (label === null) {
                // btn.style.backgroundColor = document.getElementById('none').backgroundColor;
                return;
            }
            else {
                // btn.style.backgroundColor = color;
                btn.style.backgroundColor = btnColor;
                btn.innerText = label;
                btn.style.color = "white";
                if (btn.isSeat) {
                    btn.isSeat = false;
                    seatsNeeded++;
                    updateSeatsNeeded();
                }
            }
        }
        else {
            if (!btn.isSeat) {
                btn.isSeat = true;
                seatsNeeded--;
                updateSeatsNeeded();
            }
            
        }
    }
    else if (currentChartMode === "students") {
        if (selectedBtn === null) {
            selectedBtn = btn;
            // btn.set
            btn.style.border = "5px solid black";
        }
        else {
            var temp = selectedBtn.innerText;
            selectedBtn.innerText = btn.innerText;
            btn.innerText = temp;
            //$(btn.id).before($(selectedBtn.id));
            selectedBtn.style.border = "";
            selectedBtn = null;
        }
    }
    unsavedChanges = true;
    addAsterisk();

    // If in gender view, update seat colors
    if (classView === "genderView") {
        colorSeatsByGender("classLayout");
    }
}

function swapCarpetText(btn) {
    if (currentCarpetChartMode === "carpetLayout") {
        if (btnColorCarpet !== "black") {
            btn.style.backgroundColor = btnColorCarpet;
            btn.style.color = "black";
        }

        if (btnColorNameCarpet === "none") {
            if (btn.isSeat) {
                carpetSpotsNeeded++;
                updateCarpetSpotsNeeded();
                btn.isSeat = false;
            }
            btn.innerText = "";
        }
        else if (btnColorNameCarpet === "black") { // Furniture
            var label = prompt("Give this item a label:");
            if (label === null) {
                // btn.style.backgroundColor = document.getElementById('none').backgroundColor;
                return;
            }
            else {
                // btn.style.backgroundColor = color;
                btn.style.backgroundColor = btnColorCarpet;
                btn.innerText = label;
                btn.style.color = "white";
                if (btn.isSeat) {
                    btn.isSeat = false;
                    carpetSpotsNeeded++;
                    updateCarpetSpotsNeeded();
                }
            }
        }
        else {
            if (!btn.isSeat) {
                btn.isSeat = true;
                carpetSpotsNeeded--;
                updateCarpetSpotsNeeded();
            }
            
        }
    }
    else if (currentCarpetChartMode === "carpetStudents") {
        if (selectedCarpetBtn === null) {
            selectedCarpetBtn = btn;
            // btn.set
            btn.style.border = "5px solid black";
            // btn.disabled = false;
        }
        else {
            var temp = selectedCarpetBtn.innerText;
            selectedCarpetBtn.innerText = btn.innerText;
            btn.innerText = temp;
            //$(btn.id).before($(selectedBtn.id));
            selectedCarpetBtn.style.border = "";
            // btn.disabled = true;
            selectedCarpetBtn = null;
        }
    }
    unsavedChanges = true;
    addAsterisk();

    // If in gender view, update seat colors
    if (carpetView === "genderView") {
        colorSeatsByGender("carpetLayout");
    }
}

function seatingChartMode(mode) {
    currentChartMode = mode;
    if (mode === "layout") {
        // document.getElementById("layoutModeBtn").style.border = "5px solid black";
        // document.getElementById("studentsModeBtn").style.border = "";
        unFade("#layoutModeBtn");
        fade("#studentsModeBtn");
        if (selectedBtn != null) {
            selectedBtn.style.border = "";
            selectedBtn = null;
        }
    }
    else if (mode === "students") {
        // document.getElementById("layoutModeBtn").style.border = "";
        // document.getElementById("studentsModeBtn").style.border = "5px solid black";
        fade("#layoutModeBtn");
        unFade("#studentsModeBtn");
    }

    // If in genderView mode, switch to tableView
    if (classView === "genderView" && mode === "layout") {
        switchView("classLayout", "tableView");
    }
}

function carpetChartMode(mode) {
    currentCarpetChartMode = mode;
    if (mode === "carpetLayout") {
        // document.getElementById("carpetLayoutModeBtn").style.border = "5px solid black";
        // document.getElementById("carpetStudentsModeBtn").style.border = "";
        unFade("#carpetLayoutModeBtn");
        fade("#carpetStudentsModeBtn");
        if (selectedCarpetBtn != null) {
            selectedCarpetBtn.style.border = "";
            selectedCarpetBtn = null;
        }
    }
    else if (mode === "carpetStudents") {
        // document.getElementById("carpetLayoutModeBtn").style.border = "";
        // document.getElementById("carpetStudentsModeBtn").style.border = "5px solid black";
        fade("#carpetLayoutModeBtn");
        unFade("#carpetStudentsModeBtn");
    }

    // If in genderView mode, switch to tableView
    if (carpetView === "genderView" && mode === "carpetLayout") {
        switchView("carpetLayout", "tableView");
    }
}

function changeSeatColor(btn, color) {
    seatingChartMode("layout");
    document.getElementById(btnColorName).style.border = "";
    if (color === "black") {
        document.getElementById(color).style.border = "5px solid grey";
    } else {
        document.getElementById(color).style.border = "5px solid black";
    }
    
    if (color === "none") {
        btnColor = document.getElementById("layoutModeBtn").style.backgroundColor;
        btnColorName = "none";
    }
    else {
        btnColor = color;
        btnColorName = color;
    }

    // If in genderView mode, switch to tableView
    if (classView === "genderView") {
        seatingChartMode("layout");
        // switchView("classLayout", "tableView"); 
    }
}

function changeCarpetSeatColor(btn, color) {
    carpetChartMode("carpetLayout");
    document.getElementById(btnColorNameCarpet + "Carpet").style.border = "";

    if (color === "black") {
        document.getElementById(color + "Carpet").style.border = "5px solid grey";
    } else {
        document.getElementById(color + "Carpet").style.border = "5px solid black";
    }
    // document.getElementById(color + "Carpet").style.border = "5px solid black";
    if (color === "none") {
        btnColorCarpet = document.getElementById("carpetLayoutModeBtn").style.backgroundColor;
        btnColorNameCarpet = "none";
    }
    else {
        btnColorCarpet = color;
        btnColorNameCarpet = color;
    }

    // If in genderView mode, switch to tableView
    if (classView === "genderView") {
        carpetChartMode("layout");
        // switchView("carpetLayout", "tableView"); 
    }
}

// ------------------------ Reset Chart and/or Text ---------------------------
function resetChart(tableId) {
    if (confirm("Are you sure you wish to reset the chart? Doing so will delete all student names and seat colors.")) {
        resetTable(tableId, true);
        unsavedChanges = true;
        addAsterisk();
    }
}

function clearTextFromChart(tableId) {
    if (confirm("Are you sure you wish to remove all names from the chart?")) {
        resetTable(tableId, false);
		if ((tableId === "classLayout" && classView === "genderView") || (tableId === "carpetLayout" && carpetView === "genderView")) {
			colorSeatsByGender(tableId);
		}
        unsavedChanges = true;
        addAsterisk();
    }
}

function resetTable(tableId, clearSeats) {
    var table = document.getElementById(tableId);
    if (clearSeats) {
        var noColor;
        updateList();
    
        if (tableId === "classLayout") {
            seatsNeeded = students.length;
            updateSeatsNeeded();
            noColor = document.getElementById("none").style.backgroundColor;
        }
        else if (tableId === "carpetLayout") {
            carpetSpotsNeeded = students.length;
            updateCarpetSpotsNeeded();
            noColor = document.getElementById("noneCarpet").style.backgroundColor;
        }
    }

    for (var r = 0; row = table.rows[r]; r++) {
        for (var c = 0; cell = row.cells[c]; c++) {
            cell = cell.childNodes[0];
            if (cell.style.color !== "white") {
				cell.innerText = "";
			}
            if (clearSeats) {
                cell.isSeat = false;
                cell.style.backgroundColor = noColor;
				cell.innerText = "";
            }
        }
    }
}

// ------------------------ Save, Save As, Load ---------------------------
var currentSession = null;
var unsavedChanges = false;
var salt = "R@nd0m$alt";

function save() {
    if (currentSession === null) {
        saveAs();
    }
    else {
        saveSession(currentSession);
        document.getElementById('sessionName').innerText = currentSession;
    }
    unsavedChanges = false;
    setSessionTitle(currentSession);
}

function saveAs() {
    var sessionName = prompt("Give this session a name:\n(i.e. '2017/2018 Q1', 'Fall Seating Chart', etc.)\n\n" + printSessions());
    if (sessionName !== null) {
        if (checkSessionName(sessionName)) {
            saveSession(sessionName);
            currentSession = sessionName;
        }
    }
    unsavedChanges = false;
    setSessionTitle(currentSession);
}

function saveSession(sessionName) {
    console.log("saveSession");
    // Save the session name to the 'seatingChartSessions' array
    var sessions = JSON.parse(localStorage.getItem("seatingChartSessions"));
    if (sessions.indexOf(sessionName) === -1) { // Add the session name only if it is new. Also update list in localStorage
        sessions.push(sessionName); 
        localStorage.setItem("seatingChartSessions", JSON.stringify(sessions));
    }

    // Save the session information in local storage under the specified name + salt
    localStorage.setItem(sessionName + salt, JSON.stringify(getSessionInfo()));
}

function load() {
    if (unsavedChanges) {
        if (confirm("You have unsaved changes in this session. If you load a new session, all changes will be lost. Continue?")) {
            loadSession();
        }
        else {
            return;
        }
    }
    else {
        loadSession();
    }
    unsavedChanges = false;
}

// Checks if the session name already exists. If not, saves the session under that name. If the session name
// does already exist, the user is asked to confirm that they want to overwrite that session.
function checkSessionName(sessionName) {
    console.log("checkSessionName");
    if (localStorage.getItem("seatingChartSessions") === null) {
        var emptySessionsList = [];
        localStorage.setItem('seatingChartSessions', JSON.stringify(emptySessionsList));
    }
    var sessions = JSON.parse(localStorage.getItem("seatingChartSessions"));
    console.log(sessions.toString());
    if (sessions.length > 0 && sessions.indexOf(sessionName) !== -1) { // session exists
        return confirm("This session name already exists. Would you like to overwrite it?");
    }
    return true;
}

function loadSession() {
    console.log("loadSession");

    var sessions2 = localStorage.getItem("seatingChartSessions");
    if (sessions2 === null || sessions2.length === 0) {
        alert("You do not have any saved sessions.");
        return;
    }

    // Get the session to be loaded from the user
    var sessionName = prompt("Enter the name of the session you wish to load.\n\n" + printSessions());
    if (sessionName !== null && localStorage.getItem(sessionName + salt) !== null) {
        // Get session info
        var sessionInfo = JSON.parse(localStorage.getItem(sessionName + salt));

        // Clear current session changes(list, charts)
        updateList();
        // for (var j = 0; j < students.length; j++) {
        if (students.length > 0) {
            // var student = document.getElementById("classListTable").childNodes[2].childNodes[j].childNodes[0];
            var student = document.getElementById("classListTable").childNodes[2].childNodes[0];
            document.getElementById("classListTable").childNodes[2].remove(student);
        }

        resetTable("classLayout", true);
        resetTable("carpetLayout", true);

        // Set session changes to current session
        for (var i = 0; i < sessionInfo.studentInfo.length; i++) {
            addStudent();
            var student = document.getElementById("classListTable").childNodes[2].childNodes[i].childNodes[0];
            student.value = sessionInfo.studentInfo[i].name;
            if (sessionInfo.studentInfo[i].isMale) {
                student.parentNode.childNodes[1].checked = true;
            }
            else if (sessionInfo.studentInfo[i].isFemale) {
                student.parentNode.childNodes[2].checked = true;
            }
        }

        // Update Chart size
        setChartSize(sessionInfo);

        // Update chart layout
        setChart("classLayout", sessionInfo.seatingChartInfo);
        setChart("carpetLayout", sessionInfo.carpetChartInfo);

        // TODO: add loading groups tab

        // Set seats/carpet spots needed
        seatsNeeded = sessionInfo.seatsNeeded;
        carpetSpotsNeeded = sessionInfo.carpetSpotsNeeded;
        updateSeatsNeeded();
        updateCarpetSpotsNeeded();

        // TODO: Save and restore or reset selected buttons

        // Set current session to the loaded session
        currentSession = sessionName;

        // Set theme
        sessionInfo.defaultThemeIndex ? defaultThemeIndex = sessionInfo.defaultThemeIndex : defaultThemeIndex = 0;
        changeTheme(defaultThemeIndex, false);
        document.getElementById('theme' + defaultThemeIndex).checked = true;
        
        // Set current session
        setSessionTitle(currentSession);
        unsavedChanges = false;
    }
    else if (sessionName !== null) {
        alert("Sorry, that session could not be found.");
    }
}

function setChartSize(sessionInfo) {
    var classLayout = document.getElementById('classLayout');
    var carpetLayout = document.getElementById('carpetLayout');

    while (classLayout.firstChild) {
        classLayout.removeChild(classLayout.firstChild);
    }
    while (carpetLayout.firstChild) {
        carpetLayout.removeChild(carpetLayout.firstChild);
    }

    numRows = sessionInfo.numRows;
    numCols = sessionInfo.numCols;
    numCarpetRows = sessionInfo.numCarpetRows;
    numCarpetCols = sessionInfo.numCarpetCols;

    createLayout('classLayout');
    createLayout('carpetLayout');

    setRowsAndCols();
    updateRowCount('classLayout');
    updateRowCount('carpetLayout');
    updateColCount('classLayout');
    updateColCount('carpetLayout');
}

function setChart(tableId, chartInfo) {
    console.log("setChart");
    var table = document.getElementById(tableId);

    for (var i = 0; i < chartInfo.length; i++) {
        var cell = table.rows[chartInfo[i].row].cells[chartInfo[i].col].childNodes[0];

        // Set text
        cell.innerHTML = chartInfo[i].studentName ? chartInfo[i].studentName : "";

        // Set color
        cell.style.backgroundColor = chartInfo[i].color === "" ? document.getElementById("none").style.backgroundColor : chartInfo[i].color;
        // var color = chartInfo[i].color === "" ? "none" : chartInfo[i].color;
        // if (chartInfo[i].tableId === "classLayout") {
        //     changeSeatColor(cell, color);
        // }
        // else {
        //     changeCarpetSeatColor(cell, color);
        // }
        
        // Set isSeat field
        cell.style.color = chartInfo[i].fontColor;
        cell.isSeat = chartInfo[i].isSeat;
        // if (chartInfo.color !== document.getElementById("none").style.backgroundColor) {
        //     cell.isSeat = true;
        // }
    }
}

function printSessions() {
    var sessions = getSessionNames();
    var sessionsString = "Saved Sessions:";

    if (sessions.length === 0) {
        return sessionsString + "\nThere are no saved sessions.";
    }
    
    for (var i = 0; i < sessions.length; i++) {
        sessionsString += "\n" + sessions[i];
    }
    return sessionsString;
}

// Returns an array of all the session names stored in the 'seatingChartSessions' variable.
function getSessionNames() {
    return localStorage.getItem("seatingChartSessions") ? JSON.parse(localStorage.getItem("seatingChartSessions")) : [];
}

// ------------------------ Get Session Info ---------------------------
function getSessionInfo() {
    console.log("getSessionInfo");

    //TODO: switch to table view for both seating and carpet charts
    switchView("classLayout", "tableView");
    switchView("carpetLayout", "tableView");

    // Get students list
    updateList();
    // var studentInfo = students;
    var studentInfo = getStudentInfo();

    // Get seating chart info
    var seatingChartInfo = getChartInfo("classLayout");

    // Get carpet chart info
    var carpetChartInfo = getChartInfo("carpetLayout");

    // Get groups info
    // var groupInfo = getGroupInfo();

    // Return one object with all info
    return {
        "studentInfo": studentInfo,
        "seatingChartInfo": seatingChartInfo,
        "carpetChartInfo": carpetChartInfo,
        "carpetSpotsNeeded": carpetSpotsNeeded,
        "seatsNeeded": seatsNeeded,
        "numRows": numRows,
        "numCols": numCols,
        "numCarpetRows": numCarpetRows,
        "numCarpetCols": numCarpetCols,
        "version": version,
        "defaultThemeIndex": defaultThemeIndex
        // "groupInfo": groupInfo
    }
}

function getStudentInfo() {
    updateList();
    var studentInfoArray = [];
    
    for (var i = 0; i < students.length; i++) {
        var studentObj = new Object();
        studentObj.name = document.getElementById("classListTable").rows[i].childNodes[0].value;
        studentObj.isMale = document.getElementById("classListTable").rows[i].childNodes[1].checked;
        studentObj.isFemale = document.getElementById("classListTable").rows[i].childNodes[2].checked;
        // studentObj.isMale = document.getElementById("classListTable").childNodes[0].childNodes[i].childNodes[1].checked;
        // studentObj.isFemale = document.getElementById("classListTable").childNodes[0].childNodes[i].childNodes[2].checked;
        studentInfoArray.push(studentObj);
    }
    return studentInfoArray;
}

function getChartInfo(tableId) {
    var table = document.getElementById(tableId);
    var seats = [];

    

    // for (var r = 0; row = table.rows[r]; r++) {
    //     for (var c = 0; cell = row.cells[c]; c++) {
    //         var cell = cell.childNodes[0];
            
    //         if (cell.isSeat || cell.innerHTML !== "") {
    //             var seat = new Object();
    //             seat.tableId = tableId;
    //             seat.studentName = cell.innerHTML;
    //             seat.color = cell.style.backgroundColor;
    //             seat.row = cell.myRowIndex;
    //             seat.col = cell.myColIndex;
    //             seat.isSeat = cell.isSeat;
    //             seats.push(seat);
    //         }
    //     }
    // }

    // return seats;
    if (carpetView === "tableView" && tableId === "carpetLayout") {
        storeSeatColors(tableId);
    }
    else if (classView === "tableView" && tableId === "classLayout") {
        storeSeatColors(tableId);
    }
    
    if (tableId === "classLayout") {
        return tableColors;
    }
    else if (tableId === "carpetLayout") {
        return carpetColors;
    }
}

// ---------------------------- Views (tables/gender) -------------------------------

var carpetView = "";
var classView = "";
var buttonColors = [];

// This function checks to see if the view is changing. If so, it calls the switchView function
function toggleView(tableId, view) {
    if ((tableId === "classLayout" && classView !== view) || (tableId === "carpetLayout" && carpetView !== view)) {
        switchView(tableId, view);
    }
}

// Toggles the button to the appropriate views and then calls the colorButtons method, which changes the buttons colors
function switchView(tableId, view) {
    // Toggle Button
    if (tableId === "classLayout") {
        classView = view;
        if (view === "tableView") {
            // document.getElementById("tableViewBtn").style.border = "5px solid black";
            // document.getElementById("genderViewBtn").style.border = "";
            // $("tableViewBtn").fadeTo("fast", 1);
            // $("genderViewBtn").fadeTo("fast", 0.5);
            unFade("#tableViewBtn");
            fade("#genderViewBtn");
        } 
        else if (view === "genderView") {
            // document.getElementById("genderViewBtn").style.border = "5px solid black";
            // document.getElementById("tableViewBtn").style.border = "";
            // $("tableViewBtn").fadeTo("fast", 0.5);
            // $("genderViewBtn").fadeTo("fast", 1);
            fade("#tableViewBtn");
            unFade("#genderViewBtn");
            // Change mode to manage students
            seatingChartMode("students");
        }
        
    }
    else if (tableId === "carpetLayout") {
        carpetView = view;
        if (view === "tableView") {
            unFade("#carpetTableViewBtn");
            fade("#carpetGenderViewBtn");
            // document.getElementById("carpetTableViewBtn").style.border = "5px solid black";
            // document.getElementById("carpetGenderViewBtn").style.border = "";
        } 
        else if (view === "genderView") {
            // document.getElementById("carpetGenderViewBtn").style.border = "5px solid black";
            // document.getElementById("carpetTableViewBtn").style.border = "";
            // Change mode to manage students
            fade("#carpetTableViewBtn");
            unFade("#carpetGenderViewBtn");
            carpetChartMode("carpetStudents");
        }
    }

    // Update button colors
    colorButtons(tableId, view);
}

// Changes the seats/buttons to the appropriate color scheme
function colorButtons(tableId, view) {
    // Get chart
    var table = document.getElementById(tableId);

    if (view === "tableView") {
        // Restore previous colors
        
        if (tableId === "classLayout") {
            for (var i = 0; i < tableColors.length; i++) {
                var cell = table.rows[tableColors[i].row].cells[tableColors[i].col].childNodes[0];
                cell.style.backgroundColor = tableColors[i].color;
            }
        }
        else if (tableId === "carpetLayout") {
            for (var i = 0; i < carpetColors.length; i++) {
                var cell = table.rows[carpetColors[i].row].cells[carpetColors[i].col].childNodes[0];
                cell.style.backgroundColor = carpetColors[i].color;
            }
        }

        // In tableView, no non-seat buttons should be colored, except furniture buttons
        for (var r = 0; row = table.rows[r]; r++) {
            for (var c = 0; cell = row.cells[c]; c++) {
                var seat = cell.childNodes[0];
                if (!seat.isSeat && seat.style.color !== "white") {
                    seat.style.backgroundColor = document.getElementById("none").style.backgroundColor;
                }
            }
        }

    }
    else if (view === "genderView") {
        // Save the previous color
        storeSeatColors(tableId);

        colorSeatsByGender(tableId);
    }
}

function colorSeatsByGender(tableId) {
    var table = document.getElementById(tableId);

    // Set colors
    var maleColor = "deepskyblue";
    var femaleColor = "violet";
    var unknownColor = "666699";//"darkgray";
    var noColor = document.getElementById("none").style.backgroundColor;

    // Go through each seat and mark blue or pink (check list for matching name)
    for (var r = 0; row = table.rows[r]; r++) {
        for (var c = 0; cell = row.cells[c]; c++) {
            var seat = cell.childNodes[0];
            
            if (seat.innerHTML !== "" || seat.isSeat) { // We mark all buttons with a student name, not all seats (usually will be the same)
                // seat.setAttribute("previousColor", seat.style.backgroundColor);
                var gender = getGender(seat.innerHTML);
                if ( gender === "male") {
                    seat.style.backgroundColor = maleColor;
                }
                else if (gender === "female") {
                    seat.style.backgroundColor = femaleColor;
                }
                else if (seat.style.backgroundColor !== "black") { // unknown
                    seat.style.backgroundColor = unknownColor;
                }
            }
            else if (seat.style.backgroundColor !== "black") {
                seat.style.backgroundColor = noColor;
            }
        }
    }
}

// This function takes in a student name and returns the gender, as a string ('male', 'female', 'unknown')
function getGender(name) {
    updateList();
    var index = -1;
    for (var i = 0; i < students.length; i++) {
        if (students[i].toLowerCase() === name.toLowerCase()) {
            index = i;
        }
    }

    // var isMale1 = document.getElementById("classListTable").childNodes[0];
    // var isMale2 = document.getElementById("classListTable").childNodes[0].childNodes[index];
    // var isMale3 = document.getElementById("classListTable").childNodes[0].childNodes[index].childNodes[1];
    // var isMale4 = document.getElementById("classListTable").childNodes[0].childNodes[index].childNodes[1].checked;

    if (index > -1) {
        var isMale = document.getElementById("classListTable").rows[index].childNodes[1].checked;
        var isFemale = document.getElementById("classListTable").rows[index].childNodes[2].checked;
        if (isMale) {
            return "male";
        }
        else if (isFemale) {
            return "female";
        }
    }
    return "unknown"; // If no gender specified or name not found, return 'unknown'
}

var tableColors = [];
var carpetColors = [];

//
function storeSeatColors(tableId) {
    if (tableId === "classLayout") {
        tableColors = [];
    } 
    else if (tableId === "carpetLayout") {
        carpetColors = [];
    }

    var table = document.getElementById(tableId);

    for (var r = 0; row = table.rows[r]; r++) {
        for (var c = 0; cell = row.cells[c]; c++) {

            var seat = cell.childNodes[0];
            if (seat.innerHTML !== "" || seat.isSeat || seat.style.backgroundColor === "black") { 
                var seatObj = new Object();
                seatObj.row = seat.myRowIndex;
                seatObj.col = seat.myColIndex;
                seatObj.color = seat.style.backgroundColor;
                seatObj.fontColor = seat.style.color;
                seatObj.tableId = tableId;
                seatObj.studentName = seat.innerHTML;
                seatObj.isSeat = seat.isSeat;

                if (tableId === "classLayout") {
                    tableColors.push(seatObj);
                }
                else if (tableId === "carpetLayout") {
                    carpetColors.push(seatObj);
                }
                
            }

        }
    }
}

// ----------------------------------- Manage Sessions -----------------------------

function deleteSession() {

    var sessions2 = JSON.parse(localStorage.getItem("seatingChartSessions"));
    if (sessions2 === null || sessions2.length === 0) {
        alert("There are no saved sessions.");
        return;
    }

    var sessionName = prompt("Deleting a session cannot be reversed.\nEnter the session name" + 
        "you would like to delete or press 'Cancel':\n\n" + printSessions());
    if (sessionName !== null) {
        var sessions = JSON.parse(localStorage.getItem("seatingChartSessions"));
        if (sessions.indexOf(sessionName) !== -1) { // Session exists

            localStorage.removeItem(sessionName + salt);
            // Update session list
            var newSessions = [];
            for (var i = 0; i < sessions.length; i++) {
                if (sessions[i] !== sessionName) {
                    newSessions.push(sessions[i]);
                }
            }
            localStorage.removeItem("seatingChartSessions");

            // If there are no sessions, do not readd session item to local storage
            if (newSessions.length > 0) {
                localStorage.setItem("seatingChartSessions", JSON.stringify(newSessions));
            }

            // If current session is deleted, reset the session title label
            if (sessionName === currentSession) {
                setSessionTitle('Untitled Session*');
                currentSession = null;
            }
        }
        else { // Session does not exist
            alert("Sorry, that session could not be found.");
        }
    }
}

function viewSessions() {
    alert(printSessions());
}

function deleteAllSessions() {
    var sessions = localStorage.getItem("seatingChartSessions");
    if (sessions === null || sessions.length === 0) {
        alert("There are no saved sessions.");
        return;
    }

    if (confirm("This will delete all saved sessions and cannot be reversed. Are you sure you want to continue?")) {
        // Remove each session history
        for (var i = 0; i < sessions.length; i++) {
            if (localStorage.getItem(sessions[i] + salt) !== null) {
                localStorage.removeItem(sessions[i] + salt);
            }
        }
        // Remove session list
        localStorage.removeItem("seatingChartSessions");
    }

    currentSession = null;
    setSessionTitle("Untitled Session*");
}

// ------------------------------ Add/Delete Rows/Columns ---------------------------
var numRows = 13;
var numCols = 13;
var numCarpetRows = 13;
var numCarpetCols = 13;

function addRow(tableId) {
    setRowsAndCols(tableId);

    if (cols === 0) {
        return;
    }

    if (tableId === 'classLayout') {
        numRows++;
    } else {
        numCarpetRows++;
    }
    
    var layout = document.getElementById(tableId);

    var newRow = getNewChartRow(tableId, rows);
    layout.appendChild(newRow);

    unsavedChanges = true;
    addAsterisk();
    updateRowCount(tableId);
}

function deleteRow(tableId) {
    setRowsAndCols(tableId);

    if (cols === 0 || rows === 0) {
        return;
    }

    if (checkLastRow(tableId)) {
        var table = document.getElementById(tableId);
        var row = table.rows[rows-1];
        for (var c = 0; cell = row.cells[c]; c++) {
            cell = cell.childNodes[0];
            if (cell.isSeat) {
                if (tableId === 'classLayout') {
                    seatsNeeded++;
                }
                else if (tableId === 'carpetLayout') {
                    carpetSpotsNeeded++;
                }
            }
        }
        document.getElementById(tableId).deleteRow(rows-1);

        if (tableId === 'classLayout') {
        numRows--;
        updateSeatsNeeded();
        }
        else if (tableId === 'carpetLayout') {
            numCarpetRows--;
            updateCarpetSpotsNeeded();
        }
    }

    unsavedChanges = true;
    addAsterisk();
    updateRowCount(tableId);
}

function addColumn(tableId) {
    setRowsAndCols(tableId);

    if (rows === 0) {
        return;
    }

    var table = document.getElementById(tableId);

    for (var r = 0; row = table.rows[r]; r++) {
        var newBtn = getNewChartBtn(tableId, r, cols);
        var newTd = document.createElement("td");
        newTd.appendChild(newBtn);
        row.appendChild(newTd);
    }

    if (tableId === 'classLayout') {
        numCols++;
    }
    else if (tableId === 'carpetLayout') {
        numCarpetCols++;
    }

    unsavedChanges = true;
    addAsterisk();
    updateColCount(tableId);
}

function deleteColumn(tableId) {
    setRowsAndCols(tableId);

    if (cols === 0 || rows === 0) {
        return;
    }

    if (checkLastColumn(tableId)) {
        var table = document.getElementById(tableId);

        for (var r = 0; row = table.rows[r]; r++) {
            var cell = row.cells[cols-1].childNodes[0];
            
            if (cell.isSeat) {
                if (tableId === 'classLayout') {
                    seatsNeeded++;
                }
                else if (tableId === 'carpetLayout') {
                    carpetSpotsNeeded++;
                }
            }

            cell.parentNode.parentNode.removeChild(cell.parentNode);
        }

        if (tableId === 'classLayout') {
            numCols--;
            updateSeatsNeeded();
        }
        else if (tableId === 'carpetLayout') {
            numCarpetCols--;
            updateCarpetSpotsNeeded();
        }
    }   

    unsavedChanges = true;
    addAsterisk();
    updateColCount(tableId);
}

function checkLastColumn(tableId) {
    var table = document.getElementById(tableId);
    var hasData = false;
    for (var r = 0; row = table.rows[r]; r++) {
        var cell = row.cells[cols-1].childNodes[0];
        if (cell.isSeat || cell.innerText !== "" || cell.style.backgroundColor === "black") {
            hasData = true;
        }
    }
    if (hasData) {
        return confirm("This operation may result in a loss of data. Continue?");
    }
    return true;
}

function checkLastRow(tableId) {
    var table = document.getElementById(tableId);
    var row = table.rows[rows-1];
    var hasData = false;
    for (var c = 0; cell = row.cells[c]; c++) {
        cell = cell.childNodes[0];
        if (cell.isSeat || cell.innerText !== "" || cell.style.backgroundColor === "black") {
            hasData = true;
        }
    }
    if (hasData) {
        return confirm("This operation may result in a loss of data. Continue?");
    }
    return true; // No data confilcts
}

function getNewChartRow(tableId, row) {

    setRowsAndCols(tableId);

    var newRow = document.createElement("tr");
    for (var c = 0; c < cols; c++) {
        var newBtn = getNewChartBtn(tableId, row, c);
        var newTd = document.createElement("td");
        newTd.appendChild(newBtn);
        newRow.appendChild(newTd);
    }
    return newRow;
}

function getNewChartBtn(tableId, row, col) {
    var newBtn = document.createElement("button");
    newBtn.isSeat = false;
    newBtn.setAttribute("class", "studentBtn");
    if (tableId === "classLayout") {
        newBtn.setAttribute("onclick", "swapText(this)");
    }
    else if (tableId === "carpetLayout") {
        newBtn.setAttribute("onclick", "swapCarpetText(this)");
    }
    newBtn.myRowIndex = row;
    newBtn.myColIndex = col;
    newBtn.id = row + "," + col;
    // newBtn.innerText = r + ", " + c;
    newBtn.style.width = "75px";
    newBtn.style.height = "35px";
    newBtn.style.fontSize = "10";

    newBtn.classList += ' mdl-button';
    newBtn.classList += ' mdl-js-button';
    newBtn.classList += ' mdl-button--raised';
    newBtn.classList += ' mdl-js-ripple-effect';
    // newBtn.classList += ' mdl-button--colored';

    // newBtn.style.backgroundColor = "Gainsboro";

    return newBtn;
}

var rows = 0;
var cols = 0;
function setRowsAndCols(tableId) {
    if (tableId === 'classLayout') {
        rows = numRows;
        cols = numCols;
    }
    else if (tableId === 'carpetLayout') {
        rows = numCarpetRows;
        cols = numCarpetCols;
    }
}

// ------------------------ Handle Display (session name and row/col count), theme --------------
function setSessionTitle(title) {
    document.getElementById('sessionName').innerText = title;
}

function addAsterisk() {
    setSessionTitle(getSessionTitle() + '*');
}

function getSessionTitle() {
    return currentSession !== null ? currentSession : 'Untitled Session';
}

function updateRowCount(tableId) {
    setRowsAndCols(tableId);
    if (tableId === 'classLayout') {
        document.getElementById('classRows').innerText = rows;
    }
    else if (tableId === 'carpetLayout') {
        document.getElementById('carpetRows').innerText = rows;
    }
}

function updateColCount(tableId) {
    setRowsAndCols(tableId);
    if (tableId === 'classLayout') {
        document.getElementById('classCols').innerText = cols;
    }
    else if (tableId === 'carpetLayout') {
        document.getElementById('carpetCols').innerText = cols;
    }
}

var defaultThemeIndex = 0;
function changeTheme(themeIndex, userChange) {
    console.log("changeTheme: " + themeIndex);
    // var currentTheme = document.getElementById('currentTheme');
    // currentTheme.parentNode.removeChild(currentTheme);

    // var sheet = document.createElement('style');
    document.styleSheets[0].disabled = true;
    document.styleSheets[1].disabled = true;
    document.styleSheets[2].disabled = true;
    document.styleSheets[3].disabled = true;
    document.styleSheets[4].disabled = true;

    document.styleSheets[themeIndex].disabled = false;

    defaultThemeIndex = themeIndex;

    if (userChange) {
        unsavedChanges = true;
        addAsterisk();
    }
    

    // document.body.appendChild(sheet);

}


// ------------------- Import/Export Sessions ----------------------
function exportSession() {
	if (localStorage.getItem("seatingChartSessions") === null) {
		alert("Sorry, you don't have any saved sessions to be exported.");
		return;
	}

	var sessionName = prompt("Which session would you like to export?\n\n" + printSessions());

	if (sessionName === null) {
		return;
	}
	else if (sessionName === currentSession && unsavedChanges) {
		if (!confirm("You are exporting the current session but have not saved all your changes. You may want to save your changes before continuing. Continue with export?")) {
			return;
		}
	}

	var sessions = JSON.parse(localStorage.getItem("seatingChartSessions"));
	var sessionJson = "";
  if (sessions.indexOf(sessionName) === -1) { // Add the session name only if it is new. Also update list in localStorage
    alert("Sorry, that session cannot be found.");
  }
  else {
  	session = JSON.parse(localStorage.getItem(sessionName + salt));
  	session.sessionName = sessionName;
  	sessionJson += JSON.stringify(session);
  	alert("Export succeded. Your file will now be downloaded. Please do not alter the contents of the exported file in anyway, as this will corrupt the data and make it unable to be imported.");
  	createFile(sessionName, sessionJson);
  }
  
}

function exportAll() {
	var sessionNames = getSessionNames();
	if (sessionNames === null) {
		alert("Sorry, you don't have any saved sessions to be exported.");
		return;
	}

	var allSessions = "";
	for (var i = 0; i < sessionNames.length; i++) {
		var currSession = JSON.parse(localStorage.getItem(sessionNames[i] + salt));
		currSession.sessionName = sessionNames[i];
		allSessions += JSON.stringify(currSession);
		if (i + 1 !== sessionNames.length) {
			allSessions += "|";
		}
	}
	alert("Export succeded. Your file will now be downloaded. Please do not alter the contents of the exported file in anyway, as this will corrupt the data and make it unable to be imported.");
	createFile("Classroom-Organizer", allSessions);
	
}

function createFile(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function importSessions(sessionJson) {
	var sessions = sessionJson.split("|");
	for (var i = 0; i < sessions.length; i++) {
		var currSession = JSON.parse(sessions[i]);
		if (!validateSessionJson(currSession)) {
			alert("Sorry, this file cannot be imported.");
			return;
		}

		var sessionNames = getSessionNames();
		if (sessionNames.indexOf(currSession.sessionName) !== -1) {
			var sessionName = currSession.sessionName;
			currSession.sessionName = prompt("The session '" + currSession.sessionName + "' already exists. Give it a new name: ");
			if (currSession.sessionName === "" || currSession.sessionName === null) {
				currSession.sessionName = sessionName += "(2)";
			}
		}
		sessionNames.push(currSession.sessionName);
		localStorage.setItem("seatingChartSessions", JSON.stringify(sessionNames));

		var name = currSession.sessionName;
		delete currSession.sessionName;

		localStorage.setItem(name + salt, JSON.stringify(currSession));
		alert("Import succeeded. Your session was saved as '" + name + "'.");
	}
	document.getElementById("importFile").value = "";
}

function validateSessionJson(sessionInfo) {
	if (sessionInfo.sessionName === null 
		|| sessionInfo.studentInfo === null
		|| sessionInfo.seatingChartInfo === null
		|| sessionInfo.carpetChartInfo === null
		|| sessionInfo.carpetSpotsNeeded  === null 
		|| sessionInfo.seatsNeeded === null
		|| sessionInfo.numRows === null
		|| sessionInfo.numCols === null
		|| sessionInfo.numCarpetRows  === null
		|| sessionInfo.numCarpetCols === null
		|| sessionInfo.version === null
		|| sessionInfo.defaultThemeIndex === null) {

		return false;
	}

	return true;
}

=======
$(document).ready(function() {

  document.styleSheets[1].disabled = true;
  document.styleSheets[2].disabled = true;
  document.styleSheets[3].disabled = true;
  document.styleSheets[4].disabled = true;
  document.getElementById('theme' + defaultThemeIndex).checked = true;

  createLayout('classLayout');
  createLayout('carpetLayout');
  seatingChartMode('layout');
  carpetChartMode('carpetLayout');
  toggleView('classLayout', 'tableView');
  toggleView('carpetLayout', 'tableView');
  updateSeatsNeeded();
  updateCarpetSpotsNeeded();
  document.getElementById('versionLabel').innerText = version;

  // Seating Chart Modes -------------------
  // var onTableView = true;
  var opacity = 0.45;
  // Initialize View Mode
  $("#genderViewBtn").fadeTo("fast", opacity);

  // var onLayoutMode = true;
  // Initialize Click Mode
  $("#studentsModeBtn").fadeTo("fast", opacity);

  $("#carpetGenderViewBtn").fadeTo("fast", opacity);
  $("#carpetStudentsModeBtn").fadeTo("fast", opacity);


  
  // Carpet Chart Modes -------------------
  

  // var sheet = document.createElement('style');
  // sheet.innerHTML = "{}";
  // sheet.id = "currentTheme";
  // document.body.appendChild(sheet);
});

// -------------------------- Global Vars --------------------------
// Version
var version = "2.0";
var students = [];
var ranomizedList = [];
var seatsNeeded = 0;
var carpetSpotsNeeded = 0;

var btnColorName = "red";
var btnColor = "red";
var btnColorNameCarpet = "red";
var btnColorCarpet = "red";

var currentCarpetChartMode = "carpetLayout";
var currentChartMode = "layout";

var selectedBtn = null;
var selectedCarpetBtn = null;

  function fade(id) {
    $(id).fadeTo("fast", 0.45);
  } 

  function unFade(id) {
    $(id).fadeTo("fast", 1);
  }

// ------------------------- Menu Bar ---------------------------
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// ------------------------- Class List ---------------------------
function addStudent() {
    // Add new input field to type student name
	var classList = document.getElementById("classListTable");
	var numStudents = classList.getElementsByTagName("tr").length;
	var newRow = classList.insertRow(numStudents);
	var newTextBox = document.createElement("INPUT");
    newTextBox.class = "studentBox";
    newRow.appendChild(newTextBox);

    // Add male/female radio buttons on same row

    var maleRadioBtn = document.createElement("INPUT");
    maleRadioBtn.setAttribute("type", "radio");
    maleRadioBtn.setAttribute("name", "student" + numStudents);
    // maleRadioBtn.style.backgroundColor = "blue";
    newRow.appendChild(maleRadioBtn);

    var femaleRadioBtn = document.createElement("INPUT");
    femaleRadioBtn.setAttribute("type", "radio");
    femaleRadioBtn.setAttribute("name", "student" + numStudents);
    // femaleRadioBtn.style.backgroundColor = "red";
    newRow.appendChild(femaleRadioBtn);

    // Add button to remove student
    var removeButton = document.createElement("BUTTON");
    removeButton.classList += ' mdl-button';
    removeButton.classList += ' mdl-js-button';
    removeButton.classList += ' mdl-button--icon';
    removeButton.classList += ' mdl-js-ripple-effect';

    removeButton.onclick = function() {
        document.getElementById("classListTable").deleteRow(this.parentNode.rowIndex);
        seatsNeeded--;
        carpetSpotsNeeded--;
        updateSeatsNeeded();
        updateCarpetSpotsNeeded();
    } 
    removeButton.innerHTML = "<i class='material-icons'>cancel</i>";
    // var text = document.createTextNode("X");
    // removeButton.appendChild(text);
    newRow.appendChild(removeButton);

    // Increment seats needed count
    seatsNeeded++;
    carpetSpotsNeeded++;
    updateSeatsNeeded();
    updateCarpetSpotsNeeded();
    unsavedChanges = true;
    addAsterisk();
}

function updateSeatsNeeded() {
    var label = document.getElementById("seatsNeeded");
    label.innerText = "Seats Left to Add: " + seatsNeeded;
    if (seatsNeeded > 0) {
        label.style.border = "3px solid red";
    }
    else if (seatsNeeded < 0) {
        label.style.border = "3px solid orange";
    } else {
        label.style.border = "3px solid green";
    }
}

function updateCarpetSpotsNeeded() {
    var label = document.getElementById("carpetSpotsNeeded");
    label.innerText = "Carpet Spots Left to Add: " + carpetSpotsNeeded;
    if (carpetSpotsNeeded > 0) {
        label.style.border = "3px solid red";
    }
    else if (carpetSpotsNeeded < 0) {
        label.style.border = "3px solid orange";
    } else {
        label.style.border = "3px solid green";
    }
}

function updateList() {
    students = [];
    var classList = document.getElementById("classListTable");
    var row, student;
    for (var m = 0; row = classList.rows[m]; m++){
        // row.childNodes[0].value !== "" ? students.push(row.childNodes[0].value);
        students.push(row.childNodes[0].value);
    }
}

// ------------------------- Randomize List ---------------------------
function randomizeList() {
    updateList();
    var tempStudents = students;
    randomizedList = [];
    var len = students.length;
    var high = len;
    var num, temp;
    for (var i = 0; i < len; i++) {
        num = Math.floor(Math.random() * high);
        temp = students[num];
        randomizedList[i] = temp;
        tempStudents.splice(num, 1);
        high--;
    }

    // For Debugging --------------------
    // document.getElementById("list").innerHTML = randomizedList.toString();
}

function randomizeSeatingChart() {
    if (seatsNeeded > 0) {
        alert("You do not have enough seats for your students. Please add more.");
        return;
    }

    randomizeList();
    var row, cell;
    var i = 0;
    var seatingChart = document.getElementById("classLayout");
    for (var r = 0; row = seatingChart.rows[r]; r++) {
        for (var c = 0; cell = row.cells[c]; c++) {
            cell = cell.childNodes[0];
            if (cell.isSeat) {
                if (i > randomizedList.length - 1) {
                    cell.innerText = "EMPTY"
                }
                else {
                    cell.innerText = randomizedList[i];
                    i++;
                }
                
            }
        }
    }
    unsavedChanges = true;
    addAsterisk();

    // If in gender view mode, update seat colors
    if (classView === "genderView") {
        colorSeatsByGender("classLayout");
    }
}

function randomizeCarpetChart() {
    if (carpetSpotsNeeded > 0) {
        alert("You do not have enough seats for your students. Please add more.");
        return;
    }

    randomizeList();
    var row, cell;
    var i = 0;
    var seatingChart = document.getElementById("carpetLayout");
    for (var r = 0; row = seatingChart.rows[r]; r++) {
        for (var c = 0; cell = row.cells[c]; c++) {
            cell = cell.childNodes[0];
            if (cell.isSeat) {
                if (i > randomizedList.length - 1) {
                    cell.innerText = ""
                }
                else {
                    cell.innerText = randomizedList[i];
                    i++;
                }
                
            }
        }
    }
    unsavedChanges = true;
    addAsterisk();

    // If in gender view mode, update seat colors
    if (carpetView === "genderView") {
        colorSeatsByGender("carpetLayout");
    }
}

// var side_bar_open = false;
// ------------------------- Sidebar -------------------------
function toggle_sidebar(x) {
    mySidebar = document.getElementById("ClassListSidebar");
    if (!mySidebar.hasOwnProperty("opened")){
        mySidebar.opened = false;
    }

    if (mySidebar.opened) {
        mySidebar.opened = false;
        close_sidebar();
    }
    else {
        mySidebar.opened = true;
        open_sidebar();
    }
    x.classList.toggle("change");
}
function open_sidebar() {
  // document.getElementById("sidebar-btn").innerHTML = "&#8678;"
  document.getElementById("main").style.marginLeft = "215px";//"16%";
  document.getElementById("main").style.display = "inline"; // Fixed sidebar issue
  document.getElementById("ClassListSidebar").style.width = "215px";//"16%";
  document.getElementById("ClassListSidebar").style.display = "inline-block";
  // document.getElementById("openNav").style.display = 'none';
}
function close_sidebar() {
  // document.getElementById("sidebar-btn").innerHTML = "&#8680;"
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("ClassListSidebar").style.display = "none";
  // document.getElementById("openNav").style.display = "inline-block";
}

// --------------------- Seating & Carpet Charts -----------------------------

function createLayout(table) {
    var layout = document.getElementById(table);
    var rows, cols;

    if (table === 'classLayout') {
        rows = numRows;
        cols = numCols;
    }
    else if (table === 'carpetLayout') {
        rows = numCarpetRows;
        cols = numCarpetCols;
    }

    for (var r = 0; r < rows; r++) {
        var newRow = getNewChartRow(table, r);
        layout.appendChild(newRow);
    }
    // var frontLabel = document.createElement("tr");
    // frontLabel.innerText = "Front";
    // frontLabel.setAttribute("class", "frontLabel");
    // layout.appendChild(frontLabel);
}

function swapText(btn) {
    if (currentChartMode === "layout") {
        if (btnColor !== "black") {
            btn.style.backgroundColor = btnColor;
            btn.style.color = "black";
        }
        
        if (btnColorName === "none") {
            if (btn.isSeat) {
                seatsNeeded++;
                updateSeatsNeeded();
                btn.isSeat = false;
            }
            btn.innerText = "";
        }
        else if (btnColorName === "black") { // Furniture
            var label = prompt("Give this item a label:");
            if (label === null) {
                // btn.style.backgroundColor = document.getElementById('none').backgroundColor;
                return;
            }
            else {
                // btn.style.backgroundColor = color;
                btn.style.backgroundColor = btnColor;
                btn.innerText = label;
                btn.style.color = "white";
                if (btn.isSeat) {
                    btn.isSeat = false;
                    seatsNeeded++;
                    updateSeatsNeeded();
                }
            }
        }
        else {
            if (!btn.isSeat) {
                btn.isSeat = true;
                seatsNeeded--;
                updateSeatsNeeded();
            }
            
        }
    }
    else if (currentChartMode === "students") {
        if (selectedBtn === null) {
            selectedBtn = btn;
            // btn.set
            btn.style.border = "5px solid black";
        }
        else {
            var temp = selectedBtn.innerText;
            selectedBtn.innerText = btn.innerText;
            btn.innerText = temp;
            //$(btn.id).before($(selectedBtn.id));
            selectedBtn.style.border = "";
            selectedBtn = null;
        }
    }
    unsavedChanges = true;
    addAsterisk();

    // If in gender view, update seat colors
    if (classView === "genderView") {
        colorSeatsByGender("classLayout");
    }
}

function swapCarpetText(btn) {
    if (currentCarpetChartMode === "carpetLayout") {
        if (btnColorCarpet !== "black") {
            btn.style.backgroundColor = btnColorCarpet;
            btn.style.color = "black";
        }

        if (btnColorNameCarpet === "none") {
            if (btn.isSeat) {
                carpetSpotsNeeded++;
                updateCarpetSpotsNeeded();
                btn.isSeat = false;
            }
            btn.innerText = "";
        }
        else if (btnColorNameCarpet === "black") { // Furniture
            var label = prompt("Give this item a label:");
            if (label === null) {
                // btn.style.backgroundColor = document.getElementById('none').backgroundColor;
                return;
            }
            else {
                // btn.style.backgroundColor = color;
                btn.style.backgroundColor = btnColorCarpet;
                btn.innerText = label;
                btn.style.color = "white";
                if (btn.isSeat) {
                    btn.isSeat = false;
                    carpetSpotsNeeded++;
                    updateCarpetSpotsNeeded();
                }
            }
        }
        else {
            if (!btn.isSeat) {
                btn.isSeat = true;
                carpetSpotsNeeded--;
                updateCarpetSpotsNeeded();
            }
            
        }
    }
    else if (currentCarpetChartMode === "carpetStudents") {
        if (selectedCarpetBtn === null) {
            selectedCarpetBtn = btn;
            // btn.set
            btn.style.border = "5px solid black";
            // btn.disabled = false;
        }
        else {
            var temp = selectedCarpetBtn.innerText;
            selectedCarpetBtn.innerText = btn.innerText;
            btn.innerText = temp;
            //$(btn.id).before($(selectedBtn.id));
            selectedCarpetBtn.style.border = "";
            // btn.disabled = true;
            selectedCarpetBtn = null;
        }
    }
    unsavedChanges = true;
    addAsterisk();

    // If in gender view, update seat colors
    if (carpetView === "genderView") {
        colorSeatsByGender("carpetLayout");
    }
}

function seatingChartMode(mode) {
    currentChartMode = mode;
    if (mode === "layout") {
        // document.getElementById("layoutModeBtn").style.border = "5px solid black";
        // document.getElementById("studentsModeBtn").style.border = "";
        unFade("#layoutModeBtn");
        fade("#studentsModeBtn");
        if (selectedBtn != null) {
            selectedBtn.style.border = "";
            selectedBtn = null;
        }
    }
    else if (mode === "students") {
        // document.getElementById("layoutModeBtn").style.border = "";
        // document.getElementById("studentsModeBtn").style.border = "5px solid black";
        fade("#layoutModeBtn");
        unFade("#studentsModeBtn");
    }

    // If in genderView mode, switch to tableView
    if (classView === "genderView" && mode === "layout") {
        switchView("classLayout", "tableView");
    }
}

function carpetChartMode(mode) {
    currentCarpetChartMode = mode;
    if (mode === "carpetLayout") {
        // document.getElementById("carpetLayoutModeBtn").style.border = "5px solid black";
        // document.getElementById("carpetStudentsModeBtn").style.border = "";
        unFade("#carpetLayoutModeBtn");
        fade("#carpetStudentsModeBtn");
        if (selectedCarpetBtn != null) {
            selectedCarpetBtn.style.border = "";
            selectedCarpetBtn = null;
        }
    }
    else if (mode === "carpetStudents") {
        // document.getElementById("carpetLayoutModeBtn").style.border = "";
        // document.getElementById("carpetStudentsModeBtn").style.border = "5px solid black";
        fade("#carpetLayoutModeBtn");
        unFade("#carpetStudentsModeBtn");
    }

    // If in genderView mode, switch to tableView
    if (carpetView === "genderView" && mode === "carpetLayout") {
        switchView("carpetLayout", "tableView");
    }
}

function changeSeatColor(btn, color) {
    seatingChartMode("layout");
    document.getElementById(btnColorName).style.border = "";
    if (color === "black") {
        document.getElementById(color).style.border = "5px solid grey";
    } else {
        document.getElementById(color).style.border = "5px solid black";
    }
    
    if (color === "none") {
        btnColor = document.getElementById("layoutModeBtn").style.backgroundColor;
        btnColorName = "none";
    }
    else {
        btnColor = color;
        btnColorName = color;
    }

    // If in genderView mode, switch to tableView
    if (classView === "genderView") {
        seatingChartMode("layout");
        // switchView("classLayout", "tableView"); 
    }
}

function changeCarpetSeatColor(btn, color) {
    carpetChartMode("carpetLayout");
    document.getElementById(btnColorNameCarpet + "Carpet").style.border = "";

    if (color === "black") {
        document.getElementById(color + "Carpet").style.border = "5px solid grey";
    } else {
        document.getElementById(color + "Carpet").style.border = "5px solid black";
    }
    // document.getElementById(color + "Carpet").style.border = "5px solid black";
    if (color === "none") {
        btnColorCarpet = document.getElementById("carpetLayoutModeBtn").style.backgroundColor;
        btnColorNameCarpet = "none";
    }
    else {
        btnColorCarpet = color;
        btnColorNameCarpet = color;
    }

    // If in genderView mode, switch to tableView
    if (classView === "genderView") {
        carpetChartMode("layout");
        // switchView("carpetLayout", "tableView"); 
    }
}

// ------------------------ Reset Chart and/or Text ---------------------------
function resetChart(tableId) {
    if (confirm("Are you sure you wish to reset the chart? Doing so will delete all student names and seat colors.")) {
        resetTable(tableId, true);
        unsavedChanges = true;
        addAsterisk();
    }
}

function clearTextFromChart(tableId) {
    if (confirm("Are you sure you wish to remove all names from the chart?")) {
        resetTable(tableId, false);
		if ((tableId === "classLayout" && classView === "genderView") || (tableId === "carpetLayout" && carpetView === "genderView")) {
			colorSeatsByGender(tableId);
		}
        unsavedChanges = true;
        addAsterisk();
    }
}

function resetTable(tableId, clearSeats) {
    var table = document.getElementById(tableId);
    if (clearSeats) {
        var noColor;
        updateList();
    
        if (tableId === "classLayout") {
            seatsNeeded = students.length;
            updateSeatsNeeded();
            noColor = document.getElementById("none").style.backgroundColor;
        }
        else if (tableId === "carpetLayout") {
            carpetSpotsNeeded = students.length;
            updateCarpetSpotsNeeded();
            noColor = document.getElementById("noneCarpet").style.backgroundColor;
        }
    }

    for (var r = 0; row = table.rows[r]; r++) {
        for (var c = 0; cell = row.cells[c]; c++) {
            cell = cell.childNodes[0];
            if (cell.style.color !== "white") {
				cell.innerText = "";
			}
            if (clearSeats) {
                cell.isSeat = false;
                cell.style.backgroundColor = noColor;
				cell.innerText = "";
            }
        }
    }
}

// ------------------------ Save, Save As, Load ---------------------------
var currentSession = null;
var unsavedChanges = false;
var salt = "R@nd0m$alt";

function save() {
    if (currentSession === null) {
        saveAs();
    }
    else {
        saveSession(currentSession);
        document.getElementById('sessionName').innerText = currentSession;
    }
    unsavedChanges = false;
    setSessionTitle(currentSession);
}

function saveAs() {
    var sessionName = prompt("Give this session a name:\n(i.e. '2017/2018 Q1', 'Fall Seating Chart', etc.)\n\n" + printSessions());
    if (sessionName !== null) {
        if (checkSessionName(sessionName)) {
            saveSession(sessionName);
            currentSession = sessionName;
        }
    }
    unsavedChanges = false;
    setSessionTitle(currentSession);
}

function saveSession(sessionName) {
    console.log("saveSession");
    // Save the session name to the 'seatingChartSessions' array
    var sessions = JSON.parse(localStorage.getItem("seatingChartSessions"));
    if (sessions.indexOf(sessionName) === -1) { // Add the session name only if it is new. Also update list in localStorage
        sessions.push(sessionName); 
        localStorage.setItem("seatingChartSessions", JSON.stringify(sessions));
    }

    // Save the session information in local storage under the specified name + salt
    localStorage.setItem(sessionName + salt, JSON.stringify(getSessionInfo()));
}

function load() {
    if (unsavedChanges) {
        if (confirm("You have unsaved changes in this session. If you load a new session, all changes will be lost. Continue?")) {
            loadSession();
        }
        else {
            return;
        }
    }
    else {
        loadSession();
    }
    unsavedChanges = false;
}

// Checks if the session name already exists. If not, saves the session under that name. If the session name
// does already exist, the user is asked to confirm that they want to overwrite that session.
function checkSessionName(sessionName) {
    console.log("checkSessionName");
    if (localStorage.getItem("seatingChartSessions") === null) {
        var emptySessionsList = [];
        localStorage.setItem('seatingChartSessions', JSON.stringify(emptySessionsList));
    }
    var sessions = JSON.parse(localStorage.getItem("seatingChartSessions"));
    console.log(sessions.toString());
    if (sessions.length > 0 && sessions.indexOf(sessionName) !== -1) { // session exists
        return confirm("This session name already exists. Would you like to overwrite it?");
    }
    return true;
}

function loadSession() {
    console.log("loadSession");

    var sessions2 = localStorage.getItem("seatingChartSessions");
    if (sessions2 === null || sessions2.length === 0) {
        alert("You do not have any saved sessions.");
        return;
    }

    // Get the session to be loaded from the user
    var sessionName = prompt("Enter the name of the session you wish to load.\n\n" + printSessions());
    if (sessionName !== null && localStorage.getItem(sessionName + salt) !== null) {
        // Get session info
        var sessionInfo = JSON.parse(localStorage.getItem(sessionName + salt));

        // Clear current session changes(list, charts)
        updateList();
        // for (var j = 0; j < students.length; j++) {
        if (students.length > 0) {
            // var student = document.getElementById("classListTable").childNodes[2].childNodes[j].childNodes[0];
            var student = document.getElementById("classListTable").childNodes[2].childNodes[0];
            document.getElementById("classListTable").childNodes[2].remove(student);
        }

        resetTable("classLayout", true);
        resetTable("carpetLayout", true);

        // Set session changes to current session
        for (var i = 0; i < sessionInfo.studentInfo.length; i++) {
            addStudent();
            var student = document.getElementById("classListTable").childNodes[2].childNodes[i].childNodes[0];
            student.value = sessionInfo.studentInfo[i].name;
            if (sessionInfo.studentInfo[i].isMale) {
                student.parentNode.childNodes[1].checked = true;
            }
            else if (sessionInfo.studentInfo[i].isFemale) {
                student.parentNode.childNodes[2].checked = true;
            }
        }

        // Update Chart size
        setChartSize(sessionInfo);

        // Update chart layout
        setChart("classLayout", sessionInfo.seatingChartInfo);
        setChart("carpetLayout", sessionInfo.carpetChartInfo);

        // TODO: add loading groups tab

        // Set seats/carpet spots needed
        seatsNeeded = sessionInfo.seatsNeeded;
        carpetSpotsNeeded = sessionInfo.carpetSpotsNeeded;
        updateSeatsNeeded();
        updateCarpetSpotsNeeded();

        // TODO: Save and restore or reset selected buttons

        // Set current session to the loaded session
        currentSession = sessionName;

        // Set theme
        sessionInfo.defaultThemeIndex ? defaultThemeIndex = sessionInfo.defaultThemeIndex : defaultThemeIndex = 0;
        changeTheme(defaultThemeIndex, false);
        document.getElementById('theme' + defaultThemeIndex).checked = true;
        
        // Set current session
        setSessionTitle(currentSession);
        unsavedChanges = false;
    }
    else if (sessionName !== null) {
        alert("Sorry, that session could not be found.");
    }
}

function setChartSize(sessionInfo) {
    var classLayout = document.getElementById('classLayout');
    var carpetLayout = document.getElementById('carpetLayout');

    while (classLayout.firstChild) {
        classLayout.removeChild(classLayout.firstChild);
    }
    while (carpetLayout.firstChild) {
        carpetLayout.removeChild(carpetLayout.firstChild);
    }

    numRows = sessionInfo.numRows;
    numCols = sessionInfo.numCols;
    numCarpetRows = sessionInfo.numCarpetRows;
    numCarpetCols = sessionInfo.numCarpetCols;

    createLayout('classLayout');
    createLayout('carpetLayout');

    setRowsAndCols();
    updateRowCount('classLayout');
    updateRowCount('carpetLayout');
    updateColCount('classLayout');
    updateColCount('carpetLayout');
}

function setChart(tableId, chartInfo) {
    console.log("setChart");
    var table = document.getElementById(tableId);

    for (var i = 0; i < chartInfo.length; i++) {
        var cell = table.rows[chartInfo[i].row].cells[chartInfo[i].col].childNodes[0];

        // Set text
        cell.innerHTML = chartInfo[i].studentName ? chartInfo[i].studentName : "";

        // Set color
        cell.style.backgroundColor = chartInfo[i].color === "" ? document.getElementById("none").style.backgroundColor : chartInfo[i].color;
        // var color = chartInfo[i].color === "" ? "none" : chartInfo[i].color;
        // if (chartInfo[i].tableId === "classLayout") {
        //     changeSeatColor(cell, color);
        // }
        // else {
        //     changeCarpetSeatColor(cell, color);
        // }
        
        // Set isSeat field
        cell.style.color = chartInfo[i].fontColor;
        cell.isSeat = chartInfo[i].isSeat;
        // if (chartInfo.color !== document.getElementById("none").style.backgroundColor) {
        //     cell.isSeat = true;
        // }
    }
}

function printSessions() {
    var sessions = getSessionNames();
    var sessionsString = "Saved Sessions:";

    if (sessions.length === 0) {
        return sessionsString + "\nThere are no saved sessions.";
    }
    
    for (var i = 0; i < sessions.length; i++) {
        sessionsString += "\n" + sessions[i];
    }
    return sessionsString;
}

// Returns an array of all the session names stored in the 'seatingChartSessions' variable.
function getSessionNames() {
    return localStorage.getItem("seatingChartSessions") ? JSON.parse(localStorage.getItem("seatingChartSessions")) : [];
}

// ------------------------ Get Session Info ---------------------------
function getSessionInfo() {
    console.log("getSessionInfo");

    //TODO: switch to table view for both seating and carpet charts
    switchView("classLayout", "tableView");
    switchView("carpetLayout", "tableView");

    // Get students list
    updateList();
    // var studentInfo = students;
    var studentInfo = getStudentInfo();

    // Get seating chart info
    var seatingChartInfo = getChartInfo("classLayout");

    // Get carpet chart info
    var carpetChartInfo = getChartInfo("carpetLayout");

    // Get groups info
    // var groupInfo = getGroupInfo();

    // Return one object with all info
    return {
        "studentInfo": studentInfo,
        "seatingChartInfo": seatingChartInfo,
        "carpetChartInfo": carpetChartInfo,
        "carpetSpotsNeeded": carpetSpotsNeeded,
        "seatsNeeded": seatsNeeded,
        "numRows": numRows,
        "numCols": numCols,
        "numCarpetRows": numCarpetRows,
        "numCarpetCols": numCarpetCols,
        "version": version,
        "defaultThemeIndex": defaultThemeIndex
        // "groupInfo": groupInfo
    }
}

function getStudentInfo() {
    updateList();
    var studentInfoArray = [];
    
    for (var i = 0; i < students.length; i++) {
        var studentObj = new Object();
        studentObj.name = document.getElementById("classListTable").rows[i].childNodes[0].value;
        studentObj.isMale = document.getElementById("classListTable").rows[i].childNodes[1].checked;
        studentObj.isFemale = document.getElementById("classListTable").rows[i].childNodes[2].checked;
        // studentObj.isMale = document.getElementById("classListTable").childNodes[0].childNodes[i].childNodes[1].checked;
        // studentObj.isFemale = document.getElementById("classListTable").childNodes[0].childNodes[i].childNodes[2].checked;
        studentInfoArray.push(studentObj);
    }
    return studentInfoArray;
}

function getChartInfo(tableId) {
    var table = document.getElementById(tableId);
    var seats = [];

    

    // for (var r = 0; row = table.rows[r]; r++) {
    //     for (var c = 0; cell = row.cells[c]; c++) {
    //         var cell = cell.childNodes[0];
            
    //         if (cell.isSeat || cell.innerHTML !== "") {
    //             var seat = new Object();
    //             seat.tableId = tableId;
    //             seat.studentName = cell.innerHTML;
    //             seat.color = cell.style.backgroundColor;
    //             seat.row = cell.myRowIndex;
    //             seat.col = cell.myColIndex;
    //             seat.isSeat = cell.isSeat;
    //             seats.push(seat);
    //         }
    //     }
    // }

    // return seats;
    if (carpetView === "tableView" && tableId === "carpetLayout") {
        storeSeatColors(tableId);
    }
    else if (classView === "tableView" && tableId === "classLayout") {
        storeSeatColors(tableId);
    }
    
    if (tableId === "classLayout") {
        return tableColors;
    }
    else if (tableId === "carpetLayout") {
        return carpetColors;
    }
}

// ---------------------------- Views (tables/gender) -------------------------------

var carpetView = "";
var classView = "";
var buttonColors = [];

// This function checks to see if the view is changing. If so, it calls the switchView function
function toggleView(tableId, view) {
    if ((tableId === "classLayout" && classView !== view) || (tableId === "carpetLayout" && carpetView !== view)) {
        switchView(tableId, view);
    }
}

// Toggles the button to the appropriate views and then calls the colorButtons method, which changes the buttons colors
function switchView(tableId, view) {
    // Toggle Button
    if (tableId === "classLayout") {
        classView = view;
        if (view === "tableView") {
            // document.getElementById("tableViewBtn").style.border = "5px solid black";
            // document.getElementById("genderViewBtn").style.border = "";
            // $("tableViewBtn").fadeTo("fast", 1);
            // $("genderViewBtn").fadeTo("fast", 0.5);
            unFade("#tableViewBtn");
            fade("#genderViewBtn");
        } 
        else if (view === "genderView") {
            // document.getElementById("genderViewBtn").style.border = "5px solid black";
            // document.getElementById("tableViewBtn").style.border = "";
            // $("tableViewBtn").fadeTo("fast", 0.5);
            // $("genderViewBtn").fadeTo("fast", 1);
            fade("#tableViewBtn");
            unFade("#genderViewBtn");
            // Change mode to manage students
            seatingChartMode("students");
        }
        
    }
    else if (tableId === "carpetLayout") {
        carpetView = view;
        if (view === "tableView") {
            unFade("#carpetTableViewBtn");
            fade("#carpetGenderViewBtn");
            // document.getElementById("carpetTableViewBtn").style.border = "5px solid black";
            // document.getElementById("carpetGenderViewBtn").style.border = "";
        } 
        else if (view === "genderView") {
            // document.getElementById("carpetGenderViewBtn").style.border = "5px solid black";
            // document.getElementById("carpetTableViewBtn").style.border = "";
            // Change mode to manage students
            fade("#carpetTableViewBtn");
            unFade("#carpetGenderViewBtn");
            carpetChartMode("carpetStudents");
        }
    }

    // Update button colors
    colorButtons(tableId, view);
}

// Changes the seats/buttons to the appropriate color scheme
function colorButtons(tableId, view) {
    // Get chart
    var table = document.getElementById(tableId);

    if (view === "tableView") {
        // Restore previous colors
        
        if (tableId === "classLayout") {
            for (var i = 0; i < tableColors.length; i++) {
                var cell = table.rows[tableColors[i].row].cells[tableColors[i].col].childNodes[0];
                cell.style.backgroundColor = tableColors[i].color;
            }
        }
        else if (tableId === "carpetLayout") {
            for (var i = 0; i < carpetColors.length; i++) {
                var cell = table.rows[carpetColors[i].row].cells[carpetColors[i].col].childNodes[0];
                cell.style.backgroundColor = carpetColors[i].color;
            }
        }

        // In tableView, no non-seat buttons should be colored, except furniture buttons
        for (var r = 0; row = table.rows[r]; r++) {
            for (var c = 0; cell = row.cells[c]; c++) {
                var seat = cell.childNodes[0];
                if (!seat.isSeat && seat.style.color !== "white") {
                    seat.style.backgroundColor = document.getElementById("none").style.backgroundColor;
                }
            }
        }

    }
    else if (view === "genderView") {
        // Save the previous color
        storeSeatColors(tableId);

        colorSeatsByGender(tableId);
    }
}

function colorSeatsByGender(tableId) {
    var table = document.getElementById(tableId);

    // Set colors
    var maleColor = "deepskyblue";
    var femaleColor = "violet";
    var unknownColor = "666699";//"darkgray";
    var noColor = document.getElementById("none").style.backgroundColor;

    // Go through each seat and mark blue or pink (check list for matching name)
    for (var r = 0; row = table.rows[r]; r++) {
        for (var c = 0; cell = row.cells[c]; c++) {
            var seat = cell.childNodes[0];
            
            if (seat.innerHTML !== "" || seat.isSeat) { // We mark all buttons with a student name, not all seats (usually will be the same)
                // seat.setAttribute("previousColor", seat.style.backgroundColor);
                var gender = getGender(seat.innerHTML);
                if ( gender === "male") {
                    seat.style.backgroundColor = maleColor;
                }
                else if (gender === "female") {
                    seat.style.backgroundColor = femaleColor;
                }
                else if (seat.style.backgroundColor !== "black") { // unknown
                    seat.style.backgroundColor = unknownColor;
                }
            }
            else if (seat.style.backgroundColor !== "black") {
                seat.style.backgroundColor = noColor;
            }
        }
    }
}

// This function takes in a student name and returns the gender, as a string ('male', 'female', 'unknown')
function getGender(name) {
    updateList();
    var index = -1;
    for (var i = 0; i < students.length; i++) {
        if (students[i].toLowerCase() === name.toLowerCase()) {
            index = i;
        }
    }

    // var isMale1 = document.getElementById("classListTable").childNodes[0];
    // var isMale2 = document.getElementById("classListTable").childNodes[0].childNodes[index];
    // var isMale3 = document.getElementById("classListTable").childNodes[0].childNodes[index].childNodes[1];
    // var isMale4 = document.getElementById("classListTable").childNodes[0].childNodes[index].childNodes[1].checked;

    if (index > -1) {
        var isMale = document.getElementById("classListTable").rows[index].childNodes[1].checked;
        var isFemale = document.getElementById("classListTable").rows[index].childNodes[2].checked;
        if (isMale) {
            return "male";
        }
        else if (isFemale) {
            return "female";
        }
    }
    return "unknown"; // If no gender specified or name not found, return 'unknown'
}

var tableColors = [];
var carpetColors = [];

//
function storeSeatColors(tableId) {
    if (tableId === "classLayout") {
        tableColors = [];
    } 
    else if (tableId === "carpetLayout") {
        carpetColors = [];
    }

    var table = document.getElementById(tableId);

    for (var r = 0; row = table.rows[r]; r++) {
        for (var c = 0; cell = row.cells[c]; c++) {

            var seat = cell.childNodes[0];
            if (seat.innerHTML !== "" || seat.isSeat || seat.style.backgroundColor === "black") { 
                var seatObj = new Object();
                seatObj.row = seat.myRowIndex;
                seatObj.col = seat.myColIndex;
                seatObj.color = seat.style.backgroundColor;
                seatObj.fontColor = seat.style.color;
                seatObj.tableId = tableId;
                seatObj.studentName = seat.innerHTML;
                seatObj.isSeat = seat.isSeat;

                if (tableId === "classLayout") {
                    tableColors.push(seatObj);
                }
                else if (tableId === "carpetLayout") {
                    carpetColors.push(seatObj);
                }
                
            }

        }
    }
}

// ----------------------------------- Manage Sessions -----------------------------

function deleteSession() {

    var sessions2 = JSON.parse(localStorage.getItem("seatingChartSessions"));
    if (sessions2 === null || sessions2.length === 0) {
        alert("There are no saved sessions.");
        return;
    }

    var sessionName = prompt("Deleting a session cannot be reversed.\nEnter the session name" + 
        "you would like to delete or press 'Cancel':\n\n" + printSessions());
    if (sessionName !== null) {
        var sessions = JSON.parse(localStorage.getItem("seatingChartSessions"));
        if (sessions.indexOf(sessionName) !== -1) { // Session exists

            localStorage.removeItem(sessionName + salt);
            // Update session list
            var newSessions = [];
            for (var i = 0; i < sessions.length; i++) {
                if (sessions[i] !== sessionName) {
                    newSessions.push(sessions[i]);
                }
            }
            localStorage.removeItem("seatingChartSessions");

            // If there are no sessions, do not readd session item to local storage
            if (newSessions.length > 0) {
                localStorage.setItem("seatingChartSessions", JSON.stringify(newSessions));
            }

            // If current session is deleted, reset the session title label
            if (sessionName === currentSession) {
                setSessionTitle('Untitled Session*');
                currentSession = null;
            }
        }
        else { // Session does not exist
            alert("Sorry, that session could not be found.");
        }
    }
}

function viewSessions() {
    alert(printSessions());
}

function deleteAllSessions() {
    var sessions = localStorage.getItem("seatingChartSessions");
    if (sessions === null || sessions.length === 0) {
        alert("There are no saved sessions.");
        return;
    }

    if (confirm("This will delete all saved sessions and cannot be reversed. Are you sure you want to continue?")) {
        // Remove each session history
        for (var i = 0; i < sessions.length; i++) {
            if (localStorage.getItem(sessions[i] + salt) !== null) {
                localStorage.removeItem(sessions[i] + salt);
            }
        }
        // Remove session list
        localStorage.removeItem("seatingChartSessions");
    }

    currentSession = null;
}

// ------------------------------ Add/Delete Rows/Columns ---------------------------
var numRows = 13;
var numCols = 13;
var numCarpetRows = 13;
var numCarpetCols = 13;

function addRow(tableId) {
    setRowsAndCols(tableId);

    if (cols === 0) {
        return;
    }

    if (tableId === 'classLayout') {
        numRows++;
    } else {
        numCarpetRows++;
    }
    
    var layout = document.getElementById(tableId);

    var newRow = getNewChartRow(tableId, rows);
    layout.appendChild(newRow);

    unsavedChanges = true;
    addAsterisk();
    updateRowCount(tableId);
}

function deleteRow(tableId) {
    setRowsAndCols(tableId);

    if (cols === 0 || rows === 0) {
        return;
    }

    if (checkLastRow(tableId)) {
        var table = document.getElementById(tableId);
        var row = table.rows[rows-1];
        for (var c = 0; cell = row.cells[c]; c++) {
            cell = cell.childNodes[0];
            if (cell.isSeat) {
                if (tableId === 'classLayout') {
                    seatsNeeded++;
                }
                else if (tableId === 'carpetLayout') {
                    carpetSpotsNeeded++;
                }
            }
        }
        document.getElementById(tableId).deleteRow(rows-1);

        if (tableId === 'classLayout') {
        numRows--;
        updateSeatsNeeded();
        }
        else if (tableId === 'carpetLayout') {
            numCarpetRows--;
            updateCarpetSpotsNeeded();
        }
    }

    unsavedChanges = true;
    addAsterisk();
    updateRowCount(tableId);
}

function addColumn(tableId) {
    setRowsAndCols(tableId);

    if (rows === 0) {
        return;
    }

    var table = document.getElementById(tableId);

    for (var r = 0; row = table.rows[r]; r++) {
        var newBtn = getNewChartBtn(tableId, r, cols);
        var newTd = document.createElement("td");
        newTd.appendChild(newBtn);
        row.appendChild(newTd);
    }

    if (tableId === 'classLayout') {
        numCols++;
    }
    else if (tableId === 'carpetLayout') {
        numCarpetCols++;
    }

    unsavedChanges = true;
    addAsterisk();
    updateColCount(tableId);
}

function deleteColumn(tableId) {
    setRowsAndCols(tableId);

    if (cols === 0 || rows === 0) {
        return;
    }

    if (checkLastColumn(tableId)) {
        var table = document.getElementById(tableId);

        for (var r = 0; row = table.rows[r]; r++) {
            var cell = row.cells[cols-1].childNodes[0];
            
            if (cell.isSeat) {
                if (tableId === 'classLayout') {
                    seatsNeeded++;
                }
                else if (tableId === 'carpetLayout') {
                    carpetSpotsNeeded++;
                }
            }

            cell.parentNode.parentNode.removeChild(cell.parentNode);
        }

        if (tableId === 'classLayout') {
            numCols--;
            updateSeatsNeeded();
        }
        else if (tableId === 'carpetLayout') {
            numCarpetCols--;
            updateCarpetSpotsNeeded();
        }
    }   

    unsavedChanges = true;
    addAsterisk();
    updateColCount(tableId);
}

function checkLastColumn(tableId) {
    var table = document.getElementById(tableId);
    var hasData = false;
    for (var r = 0; row = table.rows[r]; r++) {
        var cell = row.cells[cols-1].childNodes[0];
        if (cell.isSeat || cell.innerText !== "" || cell.style.backgroundColor === "black") {
            hasData = true;
        }
    }
    if (hasData) {
        return confirm("This operation may result in a loss of data. Continue?");
    }
    return true;
}

function checkLastRow(tableId) {
    var table = document.getElementById(tableId);
    var row = table.rows[rows-1];
    var hasData = false;
    for (var c = 0; cell = row.cells[c]; c++) {
        cell = cell.childNodes[0];
        if (cell.isSeat || cell.innerText !== "" || cell.style.backgroundColor === "black") {
            hasData = true;
        }
    }
    if (hasData) {
        return confirm("This operation may result in a loss of data. Continue?");
    }
    return true; // No data confilcts
}

function getNewChartRow(tableId, row) {

    setRowsAndCols(tableId);

    var newRow = document.createElement("tr");
    for (var c = 0; c < cols; c++) {
        var newBtn = getNewChartBtn(tableId, row, c);
        var newTd = document.createElement("td");
        newTd.appendChild(newBtn);
        newRow.appendChild(newTd);
    }
    return newRow;
}

function getNewChartBtn(tableId, row, col) {
    var newBtn = document.createElement("button");
    newBtn.isSeat = false;
    newBtn.setAttribute("class", "studentBtn");
    if (tableId === "classLayout") {
        newBtn.setAttribute("onclick", "swapText(this)");
    }
    else if (tableId === "carpetLayout") {
        newBtn.setAttribute("onclick", "swapCarpetText(this)");
    }
    newBtn.myRowIndex = row;
    newBtn.myColIndex = col;
    newBtn.id = row + "," + col;
    // newBtn.innerText = r + ", " + c;
    newBtn.style.width = "75px";
    newBtn.style.height = "35px";
    newBtn.style.fontSize = "10";

    newBtn.classList += ' mdl-button';
    newBtn.classList += ' mdl-js-button';
    newBtn.classList += ' mdl-button--raised';
    newBtn.classList += ' mdl-js-ripple-effect';
    // newBtn.classList += ' mdl-button--colored';

    // newBtn.style.backgroundColor = "Gainsboro";

    return newBtn;
}

var rows = 0;
var cols = 0;
function setRowsAndCols(tableId) {
    if (tableId === 'classLayout') {
        rows = numRows;
        cols = numCols;
    }
    else if (tableId === 'carpetLayout') {
        rows = numCarpetRows;
        cols = numCarpetCols;
    }
}

// ------------------------ Handle Display (session name and row/col count), theme --------------
function setSessionTitle(title) {
    document.getElementById('sessionName').innerText = title;
}

function addAsterisk() {
    setSessionTitle(getSessionTitle() + '*');
}

function getSessionTitle() {
    return currentSession !== null ? currentSession : 'Untitled Session';
}

function updateRowCount(tableId) {
    setRowsAndCols(tableId);
    if (tableId === 'classLayout') {
        document.getElementById('classRows').innerText = rows;
    }
    else if (tableId === 'carpetLayout') {
        document.getElementById('carpetRows').innerText = rows;
    }
}

function updateColCount(tableId) {
    setRowsAndCols(tableId);
    if (tableId === 'classLayout') {
        document.getElementById('classCols').innerText = cols;
    }
    else if (tableId === 'carpetLayout') {
        document.getElementById('carpetCols').innerText = cols;
    }
}

var defaultThemeIndex = 0;
function changeTheme(themeIndex, userChange) {
    console.log("changeTheme: " + themeIndex);
    // var currentTheme = document.getElementById('currentTheme');
    // currentTheme.parentNode.removeChild(currentTheme);

    // var sheet = document.createElement('style');
    document.styleSheets[0].disabled = true;
    document.styleSheets[1].disabled = true;
    document.styleSheets[2].disabled = true;
    document.styleSheets[3].disabled = true;
    document.styleSheets[4].disabled = true;

    document.styleSheets[themeIndex].disabled = false;

    defaultThemeIndex = themeIndex;

    if (userChange) {
        unsavedChanges = true;
        addAsterisk();
    }
    

    // document.body.appendChild(sheet);

}

// ------------------- Import/Export Sessions ----------------------
function exportSession() {
    if (localStorage.getItem("seatingChartSessions") === null) {
        alert("Sorry, you don't have any saved sessions to be exported.");
        return;
    }

    var sessionName = prompt("Which session would you like to export?\n\n" + printSessions());

    if (sessionName === null) {
        return;
    }
    else if (sessionName === currentSession && unsavedChanges) {
        if (!confirm("You are exporting the current session but have not saved all your changes. You may want to save your changes before continuing. Continue with export?")) {
            return;
        }
    }

    var sessions = JSON.parse(localStorage.getItem("seatingChartSessions"));
    var sessionJson = "";
  if (sessions.indexOf(sessionName) === -1) { // Add the session name only if it is new. Also update list in localStorage
    alert("Sorry, that session cannot be found.");
  }
  else {
    session = JSON.parse(localStorage.getItem(sessionName + salt));
    session.sessionName = sessionName;
    sessionJson += JSON.stringify(session);
    alert("Export succeded. Your file will now be downloaded. Please do not alter the contents of the exported file in anyway, as this will corrupt the data and make it unable to be imported.");
    createFile(sessionName, sessionJson);
  }
  
}

function exportAll() {
    var sessionNames = getSessionNames();
    if (sessionNames === null) {
        alert("Sorry, you don't have any saved sessions to be exported.");
        return;
    }

    var allSessions = "";
    for (var i = 0; i < sessionNames.length; i++) {
        var currSession = JSON.parse(localStorage.getItem(sessionNames[i] + salt));
        currSession.sessionName = sessionNames[i];
        allSessions += JSON.stringify(currSession);
        if (i + 1 !== sessionNames.length) {
            allSessions += "|";
        }
    }
    alert("Export succeded. Your file will now be downloaded. Please do not alter the contents of the exported file in anyway, as this will corrupt the data and make it unable to be imported.");
    createFile("Classroom-Organizer", allSessions);
    
}

function createFile(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function importSessions(sessionJson) {
    var sessions = sessionJson.split("|");
    for (var i = 0; i < sessions.length; i++) {
        var currSession = JSON.parse(sessions[i]);
        if (!validateSessionJson(currSession)) {
            alert("Sorry, this file cannot be imported.");
            return;
        }

        var sessionNames = getSessionNames();
        if (sessionNames.indexOf(currSession.sessionName) !== -1) {
            var sessionName = currSession.sessionName;
            currSession.sessionName = prompt("The session '" + currSession.sessionName + "' already exists. Give it a new name: ");
            if (currSession.sessionName === "" || currSession.sessionName === null) {
                currSession.sessionName = sessionName += "(2)";
            }
        }
        sessionNames.push(currSession.sessionName);
        localStorage.setItem("seatingChartSessions", JSON.stringify(sessionNames));

        var name = currSession.sessionName;
        delete currSession.sessionName;

        localStorage.setItem(name + salt, JSON.stringify(currSession));
        alert("Import succeeded. Your session was saved as '" + name + "'.");
    }
    document.getElementById("importFile").value = "";
}

function validateSessionJson(sessionInfo) {
    if (sessionInfo.sessionName === null 
        || sessionInfo.studentInfo === null
        || sessionInfo.seatingChartInfo === null
        || sessionInfo.carpetChartInfo === null
        || sessionInfo.carpetSpotsNeeded  === null 
        || sessionInfo.seatsNeeded === null
        || sessionInfo.numRows === null
        || sessionInfo.numCols === null
        || sessionInfo.numCarpetRows  === null
        || sessionInfo.numCarpetCols === null
        || sessionInfo.version === null
        || sessionInfo.defaultThemeIndex === null) {

        return false;
    }

    return true;
}
