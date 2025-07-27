//priority preferences change
let priorityPreference = 1; 
document.getElementById("priority-toggle-btn").onclick = () => {
    let currentPriorityPreference = document.getElementById("priority-preference").innerText;
    if (currentPriorityPreference == "high") {
        document.getElementById("priority-preference").innerText = "low";
    } else {
        document.getElementById("priority-preference").innerText = "high";
    }
    priorityPreference *= -1;
};

let selectedAlgorithm = document.querySelector("#algo");

//check wether process is rr or not, if rr then remove 'hide' means show time-quantum colomn
function checkTimeQuantumInput() {
    let timequantum = document.querySelector("#time-quantum").classList;
    if (selectedAlgorithm.value === 'rr') {
        timequantum.remove("hide");
    } else {
        timequantum.add("hide");
    }
}

//Similar to the checkTimeQuantumInput() function, this checks if the selected algorithm is 
// "priority non-preemptive" (pnp) or "priority preemptive" (pp). 
// If so, it shows priority-related fields; 
// otherwise, it hides them.

function checkPriorityCell() {
    let prioritycell = document.querySelectorAll(".priority");
    if (selectedAlgorithm.value === "pnp" || selectedAlgorithm.value === "pp") {
        prioritycell.forEach((element) => {
            element.classList.remove("hide");
        });
    } else {
        prioritycell.forEach((element) => {
            element.classList.add("hide");
        });
    }
}

 selectedAlgorithm.onchange = () => {
    checkTimeQuantumInput();
    checkPriorityCell();
 };


function inputOnChange() { //onchange EventListener for input
    let inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        if (input.type == 'number') {
            input.onchange = () => {
                let inputVal = Number(input.value);
                let isInt = Number.isInteger(inputVal);
                if (input.parentNode.classList.contains('arrival-time') || input.id == 'context-switch') //min 0 : arrival time
                {
                    if (!isInt || (isInt && inputVal < 0)) {
                        input.value = 0;
                    } else {
                        input.value = inputVal;
                    }
                } else //min 1 : time quantum, priority, process time
                {
                    if (!isInt || (isInt && inputVal < 1)) {
                        input.value = 1;
                    } else {
                        input.value = inputVal;
                    }
                }
            }
        }
    });
}

inputOnChange();
let process = 1;
//resize burst time rows size on +/-

function gcd(x, y) {
    while (y) {
        let t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function lcm(x, y) {
    return (x * y) / gcd(x, y);
}

function lcmAll() {
    let result = 1;
    for (let i = 0; i < process; i++) {
        result = lcm(result, document.querySelector(".main-table").rows[2 * i + 2].cells.length);
    }
    return result;
}

function updateColspan() { //update burst time cell colspan
    let totalColumns = lcmAll();
    let processHeading = document.querySelector("thead .process-time");
    processHeading.setAttribute("colspan", totalColumns);
    let processTimes = [];
    let table = document.querySelector(".main-table");
    for (let i = 0; i < process; i++) {
        let row = table.rows[2 * i + 2].cells;
        processTimes.push(row.length);
    }
    for (let i = 0; i < process; i++) {
        let row1 = table.rows[2 * i + 1].cells;
        let row2 = table.rows[2 * i + 2].cells;
        for (let j = 0; j < processTimes[i]; j++) {
            row1[j + 3].setAttribute("colspan", totalColumns / processTimes[i]);
            row2[j].setAttribute("colspan", totalColumns / processTimes[i]);
        }
    }
}

function addremove() { //add remove bt-io time pair add event listener
    let processTimes = [];
    let table = document.querySelector(".main-table");
    for (let i = 0; i < process; i++) {
        let row = table.rows[2 * i + 2].cells;
        processTimes.push(row.length);
    }
    let addbtns = document.querySelectorAll(".add-process-btn");
    for (let i = 0; i < process; i++) {
        addbtns[i].onclick = () => {
            let table = document.querySelector(".main-table");
            let row1 = table.rows[2 * i + 1];
            let row2 = table.rows[2 * i + 2];
            let newcell1 = row1.insertCell(processTimes[i] + 3);
            newcell1.innerHTML = "IO";
            newcell1.classList.add("process-time");
            newcell1.classList.add("io");
            newcell1.classList.add("process-heading");
            let newcell2 = row2.insertCell(processTimes[i]);
            newcell2.innerHTML = '<input type="number" min="1" step="1" value="1">';
            newcell2.classList.add("process-time");
            newcell2.classList.add("io");
            newcell2.classList.add("process-input");
            let newcell3 = row1.insertCell(processTimes[i] + 4);
            newcell3.innerHTML = "CPU";
            newcell3.classList.add("process-time");
            newcell3.classList.add("cpu");
            newcell3.classList.add("process-heading");
            let newcell4 = row2.insertCell(processTimes[i] + 1);
            newcell4.innerHTML = '<input type="number" min="1" step="1" value="1">';
            newcell4.classList.add("process-time");
            newcell4.classList.add("cpu");
            newcell4.classList.add("process-input");
            processTimes[i] += 2;
            updateColspan();
            inputOnChange();
        };
    }
    let removebtns = document.querySelectorAll(".remove-process-btn");
    for (let i = 0; i < process; i++) {
        removebtns[i].onclick = () => {
            if (processTimes[i] > 1) {
                let table = document.querySelector(".main-table");
                processTimes[i]--;
                let row1 = table.rows[2 * i + 1];
                row1.deleteCell(processTimes[i] + 3);
                let row2 = table.rows[2 * i + 2];
                row2.deleteCell(processTimes[i]);
                processTimes[i]--;
                table = document.querySelector(".main-table");
                row1 = table.rows[2 * i + 1];
                row1.deleteCell(processTimes[i] + 3);
                row2 = table.rows[2 * i + 2];
                row2.deleteCell(processTimes[i]);
                updateColspan();
            }
        };
    }
}
addremove();

function addProcess() {
    process++;
    let rowHTML1 = `
                          <td class="process-id" rowspan="2">P${process}</td>
                          <td class="priority hide" rowspan="2"><input type="number" min="1" step="1" value="1"></td>
                          <td class="arrival-time" rowspan="2"><input type="number" min="0" step="1" value="0"> </td>
                          <td class="process-time cpu process-heading" colspan="">CPU</td>
                          <td class="process-btn"><button type="button" class="add-process-btn">+</button></td>
                          <td class="process-btn"><button type="button" class="remove-process-btn">-</button></td>
                      `;
    let rowHTML2 = `
                           <td class="process-time cpu process-input"><input type="number" min="1" step="1" value="1"> </td>
                      `;
    let table = document.querySelector(".main-table tbody");
    table.insertRow(table.rows.length).innerHTML = rowHTML1;
    table.insertRow(table.rows.length).innerHTML = rowHTML2;
    checkPriorityCell();
    addremove();
    updateColspan();
    inputOnChange();
}

function deleteProcess() {
    let table = document.querySelector(".main-table");
    if (process > 1) {
        table.deleteRow(table.rows.length - 1);
        table.deleteRow(table.rows.length - 1);
        process--;
    }
    updateColspan();
    inputOnChange();
}

document.querySelector(".add-btn").onclick = () => { //add row event listener
    addProcess();
};
document.querySelector(".remove-btn").onclick = () => { //remove row event listener
    deleteProcess();
};

//------------------------
class Input {
//     //EX -> let input = new Input();
// input.processId = [0, 1, 2];
// input.arrivalTime = [0, 1, 2];
// input.processTime = [
//   [4, 2, 3],  // Process 0: burst 4 → block 2 → burst 3
//   [3, 5],     // Process 1: burst 3 → block 5
//   [6]         // Process 2: burst 6
// ];
// input.processTimeLength = [3, 2, 1];
// input.totalBurstTime = [7, 3, 6]; // (Sum of burst times: Process 0: 4+3, Process 1: 3, Process 2: 6)
// input.algorithm = 'rr'; // Example: Round Robin
// input.algorithmType = 'preemptive';
// input.timeQuantum = 2;
// input.contextSwitch = 1;

    constructor() {
        this.processId = [];// Array of process IDs. For example, [0, 1, 2] for three processes.
        this.priority = [];//Array of priorities for each process (used in priority-based algorithms).
        this.arrivalTime = [];//Array of arrival times for each process. Determines when a process becomes eligible to execute.
        this.processTime = [];//2D array where each sub-array represents the burst times and block times 
        // for a process. E.g., [[4, 3, 2]] for a process with burst 4, block 3, and burst 2. block means i/o
        // [4, 3, 2] means burst time 4 then i/o 3 then burst 2
        this.processTimeLength = [];//Array representing the length of processTime for each process. E.g., [3] for the example above.[[4,3,2]] 3 for [4,3,2]
        this.totalBurstTime = [];//Total CPU burst time of each process (sum of all burst times in processTime). for each process it is array so
        //totalBurstTIme[0] = 4 + 2 (for process 0 bt is 4 + 2)
    
        this.algorithm = "";//The scheduling algorithm used (e.g., "fcfs", "rr", "sjf").
        this.algorithmType = "";// Type of algorithm: "preemptive" or "non-preemptive".
        this.timeQuantum = 0;//Time quantum for Round Robin (RR) scheduling.
        this.contextSwitch = 0;//Time required to switch between processes.
    }
}
class Utility {
    constructor() {

        this.remainingProcessTime = [];
        //Represents the remaining execution times for each phase (burst/block) of each process.\
        //  It mirrors processTime, but it gets updated during execution.
        /////////
        // utility.remainingProcessTime = [
        //     [4, 2, 3],  // Process 0: burst-block-burst
        //     [3, 5],     // Process 1: burst-block
        //     [6]         // Process 2: single burst
        //   ];
////////////////
          //After 2 time units (Round Robin):
        //Process 0 executes for 2 units: remainingProcessTime[0] = [2, 2, 3].
        //Process 1 and Process 2 remain unchanged.
        
        this.remainingBurstTime = [];
        //Initial Value:utility.remainingBurstTime = [7, 3, 6]; // Total burst time per process
        //After 2 time units (Round Robin):
        //Process 0 executes for 2 units: remainingBurstTime[0] = 5.
        //Process 1 and Process 2 remain unchanged.

        this.remainingTimeRunning = [];
       // Tracks the remaining time for the currently running process, especially for algorithms like Round Robin.
        //Initial Value:utility.remainingTimeRunning = [0, 0, 0]; // No process is running initially
        //When Process 0 starts executing with a time quantum of 2:
        //utility.remainingTimeRunning[0] = 2; // Process 0 can run for 2 time units before being preempted
        //After 2 time units:The time quantum for Process 0 expires: remainingTimeRunning[0] = 0.

        this.currentProcessIndex = [];
        //Tracks the current phase (burst or block) for each process.
        //Initial Value : utility.currentProcessIndex = [0, 0, 0]; // All processes start at their first burst phase
        //After Process 0 finishes its first burst (4 time units):Process 0 moves to its second phase (block): currentProcessIndex[0] = 1.

        this.start = [];
        //Boolean array to track whether a process has started execution.
        // Initial Value: utility.start = [false, false, false]; // No processes have started
        //After Process 0 starts: utility.start = [true, false, false];

        this.done = [];
        //Boolean array to track whether a process has completed execution.
        //Initial Value : utility.done = [false, false, false]; // No processes are done
        //After all phases of Process 0 are complete: utility.done = [true, false, false];

        this.returnTime = [];
        //Tracks the time when a blocked process is expected to return to the ready queue.
        //Initial Value : utility.returnTime = [Infinity, Infinity, Infinity]; // No processes are in the block state initially
        //After Process 0 enters its block phase at time 4 (block time = 2):
        // Process 0 will return at currentTime + 2 = 6.
        //utility.returnTime = [6, Infinity, Infinity];

        this.currentTime = 0;
        //utility.currentTime = 0; // Simulation starts at time 0
        //After 3 time units:
        //utility.currentTime = 3;
    }
}
class Output {
    constructor() {
        this.completionTime = [];
        this.turnAroundTime = [];
        this.waitingTime = [];
        this.responseTime = [];
        this.schedule = [];
        this.timeLog = [];
        this.contextSwitches = 0;
        this.averageTimes = []; //ct,tat,wt,rt
    }
}
class TimeLog {
    constructor() {
        this.time = -1;
        //The current simulation time.
        this.remain = [];
        //Array of processes yet to start execution (remaining processes).
        this.ready = [];
        //Array of processes ready for execution.
        this.running = [];
        //Array containing the process currently executing (usually at most one process).
        this.block = [];
        //Array of processes in the block state.
        this.terminate = [];
        //Array of processes that have completed execution.
        this.move = []; //0-remain->ready 1-ready->running 2-running->terminate 3-running->ready 4-running->block 5-block->ready
    }
    //Input provides static process and algorithm information.
    // Utility maintains and updates process states dynamically during simulation.
    // Output stores results, logs, and metrics of the scheduling simulation.
    // TimeLog captures snapshots of the system state, which are saved in Output.timeLog.
}

function setAlgorithmNameType(input, algorithm) {
    input.algorithm = algorithm;
    switch (algorithm) {
        case 'fcfs':
        case 'sjf':
        case 'ljf':
        case 'pnp':
        case 'hrrn':
            input.algorithmType = "nonpreemptive";
            break;
        case 'srtf':
        case 'lrtf':
        case 'pp':
            input.algorithmType = "preemptive";
            break;
        case 'rr':
            input.algorithmType = "roundrobin";
            break;
    }
}

function setInput(input) {
    for (let i = 1; i <= process; i++) {

        input.processId.push(i - 1);
        //rowCells1: Contains priority and arrival time
        let rowCells1 = document.querySelector(".main-table").rows[2 * i - 1].cells;
        //rowCells2: Contains alternating CPU/I/O burst times
        let rowCells2 = document.querySelector(".main-table").rows[2 * i].cells;

        input.priority.push(Number(rowCells1[1].firstElementChild.value));
        input.arrivalTime.push(Number(rowCells1[2].firstElementChild.value));

        let ptn = Number(rowCells2.length);//// how many burst/block times
        let pta = [];
        for (let j = 0; j < ptn; j++) {
            pta.push(Number(rowCells2[j].firstElementChild.value));
        }
        input.processTime.push(pta);// Save burst/block times
        input.processTimeLength.push(ptn);// Save how many entries
    } 

    //total burst time for each process ignoring i/o
    input.totalBurstTime = new Array(process).fill(0);
    input.processTime.forEach((e1, i) => {
        e1.forEach((e2, j) => {
            if (j % 2 == 0) {
                input.totalBurstTime[i] += e2;
            }
        });
    });
    setAlgorithmNameType(input, selectedAlgorithm.value);
    input.contextSwitch = Number(document.querySelector("#context-switch").value);
    input.timeQuantum = Number(document.querySelector("#tq").value);
}

function setUtility(input, utility) {

    utility.remainingProcessTime = input.processTime.slice();
    //remainingProcessTime is a copy of the full 2D array of CPU and IO times for each process.
    //For example, if input.processTime = [[5, 3, 4], [2, 2]], then utility.remainingProcessTime = [[5, 3, 4], [2, 2]].

    utility.remainingBurstTime = input.totalBurstTime.slice();
    //Copies the total CPU burst time for each process.
    //Used to track how much CPU time is still left in total.(array)

    utility.remainingTimeRunning = new Array(process).fill(0);
    //Initializes to 0 for each process.
    //This is used to track how much time is left in the current CPU or I/O burst 
    // (i.e., the currentProcessIndex-th entry of that process's time array).

    utility.currentProcessIndex = new Array(process).fill(0);
    //Keeps track of which index in the processTime array the process is currently executing.
    //For example: if processTime = [5, 3, 4], and currentProcessIndex = 2, then the process is in the last burst (4 units).
    utility.start = new Array(process).fill(false);
    //A flag array to track if a process has started its first CPU burst yet.
    //Useful for computing response time.
    utility.done = new Array(process).fill(false);
    //A flag array to track whether the process is fully completed (all bursts done and terminated).
    utility.returnTime = input.arrivalTime.slice();
    //Initially, this is just the process arrival time.
    //Later, it is updated to track the return time from the block (I/O) phase to decide when the process is ready again.
}

function reduceSchedule(schedule) {
    let newSchedule = [];
    let currentScheduleElement = schedule[0][0];

    let currentScheduleLength = schedule[0][1];
    for (let i = 1; i < schedule.length; i++) {
        if (schedule[i][0] == currentScheduleElement) {
            currentScheduleLength += schedule[i][1];
        } else {
            newSchedule.push([currentScheduleElement, currentScheduleLength]);
            currentScheduleElement = schedule[i][0];
            currentScheduleLength = schedule[i][1];
        }
    }
    newSchedule.push([currentScheduleElement, currentScheduleLength]);
    return newSchedule;
} 

function reduceTimeLog(timeLog) {
    let timeLogLength = timeLog.length;
    let newTimeLog = [],
        j = 0;
    for (let i = 0; i < timeLogLength - 1; i++) {
        if (timeLog[i] != timeLog[i + 1]) {
            newTimeLog.push(timeLog[j]);
        }
        j = i + 1;
    }
    if (j == timeLogLength - 1) {
        newTimeLog.push(timeLog[j]);
    }
    return newTimeLog;
}

function outputAverageTimes(output) {
    let avgct = 0;
    output.completionTime.forEach((element) => {
        avgct += element;
    });
    avgct /= process;
    let avgtat = 0;
    output.turnAroundTime.forEach((element) => {
        avgtat += element;
    });
    avgtat /= process;
    let avgwt = 0;
    output.waitingTime.forEach((element) => {
        avgwt += element;
    });
    avgwt /= process;
    let avgrt = 0;
    output.responseTime.forEach((element) => {
        avgrt += element;
    });
    avgrt /= process;
    return [avgct, avgtat, avgwt, avgrt];
}

function setOutput(input, output) {
    //set turn around time and waiting time
    for (let i = 0; i < process; i++) {
        output.turnAroundTime[i] = output.completionTime[i] - input.arrivalTime[i];
        output.waitingTime[i] = output.turnAroundTime[i] - input.totalBurstTime[i];
    }
    output.schedule = reduceSchedule(output.schedule);
    output.timeLog = reduceTimeLog(output.timeLog);
    output.averageTimes = outputAverageTimes(output);
}

function getDate(sec) {
    return (new Date(0, 0, 0, 0, sec / 60, sec % 60));
}

function showGanttChart(output, outputDiv) {
    let ganttChartHeading = document.createElement("h3");
    ganttChartHeading.innerHTML = "Gantt Chart";
    outputDiv.appendChild(ganttChartHeading);
    let ganttChartData = [];
    let startGantt = 0;
    output.schedule.forEach((element) => {
        if (element[0] == -2) { //context switch
            ganttChartData.push([
                "Time",
                "CS",
                "grey",
                getDate(startGantt),
                getDate(startGantt + element[1])
            ]);

        } else if (element[0] == -1) { //nothing
            ganttChartData.push([
                "Time",
                "Empty",
                "black",
                getDate(startGantt),
                getDate(startGantt + element[1])
            ]);

        } else { //process 
            ganttChartData.push([
                "Time",
                "P" + element[0],
                "",
                getDate(startGantt),
                getDate(startGantt + element[1])
            ]);
        }
        startGantt += element[1];
    });
    let ganttChart = document.createElement("div");
    ganttChart.id = "gantt-chart";

    google.charts.load("current", { packages: ["timeline"] });
    google.charts.setOnLoadCallback(drawGanttChart);

    function drawGanttChart() {
        var container = document.getElementById("gantt-chart");
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn({ type: "string", id: "Gantt Chart" });
        dataTable.addColumn({ type: "string", id: "Process" });
        dataTable.addColumn({ type: 'string', id: 'style', role: 'style' });
        dataTable.addColumn({ type: "date", id: "Start" });
        dataTable.addColumn({ type: "date", id: "End" });
        dataTable.addRows(ganttChartData);
        let ganttWidth = '100%';
        if (startGantt >= 20) {
            ganttWidth = 0.05 * startGantt * screen.availWidth;
        }
        var options = {
            width: ganttWidth,
            timeline: {
                showRowLabels: false,
                avoidOverlappingGridLines: false
            }
        };
        chart.draw(dataTable, options);
    }
    outputDiv.appendChild(ganttChart);
}

function showTimelineChart(output, outputDiv) {
    let timelineChartHeading = document.createElement("h3");
    timelineChartHeading.innerHTML = "Timeline Chart";
    outputDiv.appendChild(timelineChartHeading);
    let timelineChartData = [];
    let startTimeline = 0;
    output.schedule.forEach((element) => {
        if (element[0] >= 0) { //process 
            timelineChartData.push([
                "P" + element[0],
                getDate(startTimeline),
                getDate(startTimeline + element[1])
            ]);
        }
        startTimeline += element[1];
    });
    timelineChartData.sort((a, b) => parseInt(a[0].substring(1, a[0].length)) - parseInt(b[0].substring(1, b[0].length)));
    let timelineChart = document.createElement("div");
    timelineChart.id = "timeline-chart";

    google.charts.load("current", { packages: ["timeline"] });
    google.charts.setOnLoadCallback(drawTimelineChart);

    function drawTimelineChart() {
        var container = document.getElementById("timeline-chart");
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn({ type: "string", id: "Process" });
        dataTable.addColumn({ type: "date", id: "Start" });
        dataTable.addColumn({ type: "date", id: "End" });
        dataTable.addRows(timelineChartData);

        let timelineWidth = '100%';
        if (startTimeline >= 20) {
            timelineWidth = 0.05 * startTimeline * screen.availWidth;
        }
        var options = {
            width: timelineWidth,
        };
        chart.draw(dataTable, options);
    }
    outputDiv.appendChild(timelineChart);
}

function showFinalTable(input, output, outputDiv) {
    let finalTableHeading = document.createElement("h3");
    finalTableHeading.innerHTML = "Final Table";
    outputDiv.appendChild(finalTableHeading);
    let table = document.createElement("table");
    table.classList.add("final-table");
    let thead = table.createTHead();
    let row = thead.insertRow(0);
    let headings = [
        "Process",
        "Arrival Time",
        "Total Burst Time",
        "Completion Time",
        "Turn Around Time",
        "Waiting Time",
        "Response Time",
    ];
    headings.forEach((element, index) => {
        let cell = row.insertCell(index);
        cell.innerHTML = element;
    });
    let tbody = table.createTBody();
    for (let i = 0; i < process; i++) {
        let row = tbody.insertRow(i);
        let cell = row.insertCell(0);
        cell.innerHTML = "P" + (i + 1);
        cell = row.insertCell(1);
        cell.innerHTML = input.arrivalTime[i];
        cell = row.insertCell(2);
        cell.innerHTML = input.totalBurstTime[i];
        cell = row.insertCell(3);
        cell.innerHTML = output.completionTime[i];
        cell = row.insertCell(4);
        cell.innerHTML = output.turnAroundTime[i];
        cell = row.insertCell(5);
        cell.innerHTML = output.waitingTime[i];
        cell = row.insertCell(6);
        cell.innerHTML = output.responseTime[i];
    }
    outputDiv.appendChild(table);

    let tbt = 0;
    input.totalBurstTime.forEach((element) => (tbt += element));
    let lastct = 0;
    output.completionTime.forEach((element) => (lastct = Math.max(lastct, element)));

    let cpu = document.createElement("p");
    cpu.innerHTML = "CPU Utilization : " + (tbt / lastct) * 100 + "%";
    outputDiv.appendChild(cpu);

    let tp = document.createElement("p");
    tp.innerHTML = "Throughput : " + process / lastct;
    outputDiv.appendChild(tp);
    if (input.contextSwitch > 0) {

        let cs = document.createElement("p");
        cs.innerHTML = "Number of Context Switches : " + (output.contextSwitches - 1);
        outputDiv.appendChild(cs);
    }
}

function toggleTimeLogArrowColor(timeLog, color) {
    let timeLogMove = ['remain-ready', 'ready-running', 'running-terminate', 'running-ready', 'running-block', 'block-ready'];
    timeLog.move.forEach(element => {
        document.getElementById(timeLogMove[element]).style.color = color;
    });
}

function nextTimeLog(timeLog) {
    let timeLogTableDiv = document.getElementById("time-log-table-div");

    let arrowHTML = `
    <p id = "remain-ready" class = "arrow">&rarr;</p>
    <p id = "ready-running" class = "arrow">&#10554;</p>
    <p id = "running-ready" class = "arrow">&#10554;</p>
    <p id = "running-terminate" class = "arrow">&rarr;</p>
    <p id = "running-block" class = "arrow">&rarr;</p>
    <p id = "block-ready" class = "arrow">&rarr;</p>
    `;
    timeLogTableDiv.innerHTML = arrowHTML;

    let remainTable = document.createElement("table");
    remainTable.id = "remain-table";
    remainTable.className = 'time-log-table';
    let remainTableHead = remainTable.createTHead();
    let remainTableHeadRow = remainTableHead.insertRow(0);
    let remainTableHeading = remainTableHeadRow.insertCell(0);
    remainTableHeading.innerHTML = "Remain";
    let remainTableBody = remainTable.createTBody();
    for (let i = 0; i < timeLog.remain.length; i++) {
        let remainTableBodyRow = remainTableBody.insertRow(i);
        let remainTableValue = remainTableBodyRow.insertCell(0);
        remainTableValue.innerHTML = 'P' + (timeLog.remain[i] + 1);
    }
    timeLogTableDiv.appendChild(remainTable);

    let readyTable = document.createElement("table");
    readyTable.id = "ready-table";
    readyTable.className = 'time-log-table';
    let readyTableHead = readyTable.createTHead();
    let readyTableHeadRow = readyTableHead.insertRow(0);
    let readyTableHeading = readyTableHeadRow.insertCell(0);
    readyTableHeading.innerHTML = "Ready";
    let readyTableBody = readyTable.createTBody();
    for (let i = 0; i < timeLog.ready.length; i++) {
        let readyTableBodyRow = readyTableBody.insertRow(i);
        let readyTableValue = readyTableBodyRow.insertCell(0);
        readyTableValue.innerHTML = 'P' + (timeLog.ready[i] + 1);
    }
    timeLogTableDiv.appendChild(readyTable);

    let runningTable = document.createElement("table");
    runningTable.id = "running-table";
    runningTable.className = 'time-log-table';
    let runningTableHead = runningTable.createTHead();
    let runningTableHeadRow = runningTableHead.insertRow(0);
    let runningTableHeading = runningTableHeadRow.insertCell(0);
    runningTableHeading.innerHTML = "Running";
    let runningTableBody = runningTable.createTBody();
    for (let i = 0; i < timeLog.running.length; i++) {
        let runningTableBodyRow = runningTableBody.insertRow(i);
        let runningTableValue = runningTableBodyRow.insertCell(0);
        runningTableValue.innerHTML = 'P' + (timeLog.running[i] + 1);
    }
    timeLogTableDiv.appendChild(runningTable);

    let blockTable = document.createElement("table");
    blockTable.id = "block-table";
    blockTable.className = 'time-log-table';
    let blockTableHead = blockTable.createTHead();
    let blockTableHeadRow = blockTableHead.insertRow(0);
    let blockTableHeading = blockTableHeadRow.insertCell(0);
    blockTableHeading.innerHTML = "Block";
    let blockTableBody = blockTable.createTBody();
    for (let i = 0; i < timeLog.block.length; i++) {
        let blockTableBodyRow = blockTableBody.insertRow(i);
        let blockTableValue = blockTableBodyRow.insertCell(0);
        blockTableValue.innerHTML = 'P' + (timeLog.block[i] + 1);
    }
    timeLogTableDiv.appendChild(blockTable);

    let terminateTable = document.createElement("table");
    terminateTable.id = "terminate-table";
    terminateTable.className = 'time-log-table';
    let terminateTableHead = terminateTable.createTHead();
    let terminateTableHeadRow = terminateTableHead.insertRow(0);
    let terminateTableHeading = terminateTableHeadRow.insertCell(0);
    terminateTableHeading.innerHTML = "Terminate";
    let terminateTableBody = terminateTable.createTBody();
    for (let i = 0; i < timeLog.terminate.length; i++) {
        let terminateTableBodyRow = terminateTableBody.insertRow(i);
        let terminateTableValue = terminateTableBodyRow.insertCell(0);
        terminateTableValue.innerHTML = 'P' + (timeLog.terminate[i] + 1);
    }
    timeLogTableDiv.appendChild(terminateTable);
    document.getElementById("time-log-time").innerHTML = "Time : " + timeLog.time;
}

function showTimeLog(output, outputDiv) {
    reduceTimeLog(output.timeLog);
    let timeLogDiv = document.createElement("div");
    timeLogDiv.id = "time-log-div";
    timeLogDiv.style.height = (15 * process) + 300 + "px";
    let startTimeLogButton = document.createElement("button");
    startTimeLogButton.id = "start-time-log";
    startTimeLogButton.innerHTML = "Start Time Log";
    timeLogDiv.appendChild(startTimeLogButton);
    outputDiv.appendChild(timeLogDiv);

    document.querySelector("#start-time-log").onclick = () => {
        timeLogStart = 1;
        let timeLogDiv = document.getElementById("time-log-div");
        let timeLogOutputDiv = document.createElement("div");
        timeLogOutputDiv.id = "time-log-output-div";

        let timeLogTableDiv = document.createElement("div");
        timeLogTableDiv.id = "time-log-table-div";

        let timeLogTime = document.createElement("p");
        timeLogTime.id = "time-log-time";

        timeLogOutputDiv.appendChild(timeLogTableDiv);
        timeLogOutputDiv.appendChild(timeLogTime);
        timeLogDiv.appendChild(timeLogOutputDiv);
        let index = 0;
        let timeLogInterval = setInterval(() => {
            nextTimeLog(output.timeLog[index]);
            if (index != output.timeLog.length - 1) {
                setTimeout(() => {
                    toggleTimeLogArrowColor(output.timeLog[index], 'red');
                    setTimeout(() => {
                        toggleTimeLogArrowColor(output.timeLog[index], 'black');
                    }, 600);
                }, 200);
            }
            index++;
            if (index == output.timeLog.length) {
                clearInterval(timeLogInterval);
            }
            document.getElementById("calculate").onclick = () => {
                clearInterval(timeLogInterval);
                document.getElementById("time-log-output-div").innerHTML = "";
                calculateOutput();
            }
        }, 1000);
    };
}

function showRoundRobinChart(outputDiv) {
    let roundRobinInput = new Input();
    setInput(roundRobinInput);
    let maxTimeQuantum = 0;
    roundRobinInput.processTime.forEach(processTimeArray => {
        processTimeArray.forEach((time, index) => {
            if (index % 2 == 0) {
                maxTimeQuantum = Math.max(maxTimeQuantum, time);
            }
        });
    });
    let roundRobinChartData = [
        [],
        [],
        [],
        [],
        []
    ];
    let timeQuantumArray = [];
    for (let timeQuantum = 1; timeQuantum <= maxTimeQuantum; timeQuantum++) {
        timeQuantumArray.push(timeQuantum);
        let roundRobinInput = new Input();
        setInput(roundRobinInput);
        setAlgorithmNameType(roundRobinInput, 'rr');
        roundRobinInput.timeQuantum = timeQuantum;
        let roundRobinUtility = new Utility();
        setUtility(roundRobinInput, roundRobinUtility);
        let roundRobinOutput = new Output();
        CPUScheduler(roundRobinInput, roundRobinUtility, roundRobinOutput);
        setOutput(roundRobinInput, roundRobinOutput);
        for (let i = 0; i < 4; i++) {
            roundRobinChartData[i].push(roundRobinOutput.averageTimes[i]);
        }
        roundRobinChartData[4].push(roundRobinOutput.contextSwitches);
    }
    let roundRobinChartCanvas = document.createElement('canvas');
    roundRobinChartCanvas.id = "round-robin-chart";
    let roundRobinChartDiv = document.createElement('div');
    roundRobinChartDiv.id = "round-robin-chart-div";
    roundRobinChartDiv.appendChild(roundRobinChartCanvas);
    outputDiv.appendChild(roundRobinChartDiv);

    new Chart(document.getElementById('round-robin-chart'), {
        type: 'line',
        data: {
            labels: timeQuantumArray,
            datasets: [{
                    label: "Completion Time",
                    borderColor: '#3366CC',
                    data: roundRobinChartData[0]
                },
                {
                    label: "Turn Around Time",
                    borderColor: '#DC3912',
                    data: roundRobinChartData[1]
                },
                {
                    label: "Waiting Time",
                    borderColor: '#FF9900',
                    data: roundRobinChartData[2]
                },
                {
                    label: "Response Time",
                    borderColor: '#109618',
                    data: roundRobinChartData[3]
                },
                {
                    label: "Context Switches",
                    borderColor: '#990099',
                    data: roundRobinChartData[4]
                },
            ]
        },
        options: {
            title: {
                display: true,
                text: ['Round Robin', 'Comparison of Completion, Turn Around, Waiting, Response Time and Context Switches', 'The Lower The Better']
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Time Quantum'
                    }
                }]
            },
            legend: {
                display: true,
                labels: {
                    fontColor: 'black'
                }
            }
        }
    });
}

function showAlgorithmChart(outputDiv) {
    let algorithmArray = ["fcfs", "sjf", "srtf", "ljf", "lrtf", "rr", "hrrn", "pnp", "pp"];
    let algorithmNameArray = ["FCFS", "SJF", "SRTF", "LJF", "LRTF", "RR", "HRRN", "PNP", "PP"];
    let algorithmChartData = [
        [],
        [],
        [],
        []
    ];
    algorithmArray.forEach(currentAlgorithm => {
        let chartInput = new Input();
        let chartUtility = new Utility();
        let chartOutput = new Output();
        setInput(chartInput);
        setAlgorithmNameType(chartInput, currentAlgorithm);
        setUtility(chartInput, chartUtility);
        CPUScheduler(chartInput, chartUtility, chartOutput);
        setOutput(chartInput, chartOutput);
        for (let i = 0; i < 4; i++) {
            algorithmChartData[i].push(chartOutput.averageTimes[i]);
        }
    });
    let algorithmChartCanvas = document.createElement('canvas');
    algorithmChartCanvas.id = "algorithm-chart";
    let algorithmChartDiv = document.createElement('div');
    algorithmChartDiv.id = "algorithm-chart-div";
    algorithmChartDiv.style.height = "40vh";
    algorithmChartDiv.style.width = "80%";
    algorithmChartDiv.appendChild(algorithmChartCanvas);
    outputDiv.appendChild(algorithmChartDiv);
    new Chart(document.getElementById('algorithm-chart'), {
        type: 'bar',
        data: {
            labels: algorithmNameArray,
            datasets: [{
                    label: "Completion Time",
                    backgroundColor: '#3366CC',
                    data: algorithmChartData[0]
                },
                {
                    label: "Turn Around Time",
                    backgroundColor: '#DC3912',
                    data: algorithmChartData[1]
                },
                {
                    label: "Waiting Time",
                    backgroundColor: '#FF9900',
                    data: algorithmChartData[2]
                },
                {
                    label: "Response Time",
                    backgroundColor: '#109618',
                    data: algorithmChartData[3]
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: ['Algorithm', 'Comparison of Completion, Turn Around, Waiting and Response Time', 'The Lower The Better']
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Algorithms'
                    }
                }]
            },
            legend: {
                display: true,
                labels: {
                    fontColor: 'black'
                }
            }
        }
    });
}

function showOutput(input, output, outputDiv) {
    showGanttChart(output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    showTimelineChart(output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    showFinalTable(input, output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    showTimeLog(output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    if (selectedAlgorithm.value == "rr") {
        showRoundRobinChart(outputDiv);
        outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    }
    showAlgorithmChart(outputDiv);
}

function CPUScheduler(input, utility, output) {
    function updateReadyQueue(currentTimeLog) {
        //This nested helper function updates the ready queue at each time step.

        let candidatesRemain = currentTimeLog.remain.filter((element) => input.arrivalTime[element] <= currentTimeLog.time);
        //It selects processes from remain (not yet started) that have arrived by currentTimeLog.time.

        if (candidatesRemain.length > 0) {
            currentTimeLog.move.push(0);
        }
        //Logs move type 0 (remain → ready).

        let candidatesBlock = currentTimeLog.block.filter((element) => utility.returnTime[element] <= currentTimeLog.time);
        //Picks processes from block that are done with I/O and should go back to ready.

        if (candidatesBlock.length > 0) {
            currentTimeLog.move.push(5);
        }
        //Logs move type 5 (block → ready).

        let candidates = candidatesRemain.concat(candidatesBlock);
        candidates.sort((a, b) => utility.returnTime[a] - utility.returnTime[b]);
        //Merges both groups and sorts by returnTime (indicating when process becomes ready).
        //Processes from remain come before block, always — because concat adds candidatesRemain first.
        //If two have same return time, and:
        //both from remain: order as in remain
        //both from block: order as in block
        //one from each: remain always comes before block

        candidates.forEach(element => {
            moveElement(element, currentTimeLog.remain, currentTimeLog.ready);
            moveElement(element, currentTimeLog.block, currentTimeLog.ready);
        });
        //Moves processes from remain or block → ready.

        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
        currentTimeLog.move = [];
        //Saves current state in output.timeLog, then clears move.
    } 

    function moveElement(value, from, to) { //if present in from and not in to then remove from 'from' and put it into to
        let index = from.indexOf(value);
        if (index != -1) {
            from.splice(index, 1);
        }
        if (to.indexOf(value) == -1) {
            to.push(value);
        }
    }
    let currentTimeLog = new TimeLog();
    currentTimeLog.remain = input.processId;
    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
    currentTimeLog.move = [];
    currentTimeLog.time++;
    let lastFound = -1;////Keeps track of the previously running process (used for context switches).
    while (utility.done.some((element) => element == false)) {//Loop until all processes are marked as done.
        updateReadyQueue(currentTimeLog);

        let found = -1;
        if (currentTimeLog.running.length == 1) {//If something is already running, continue running it.
            found = currentTimeLog.running[0];//process id of process that is currently running
        } 
        else if (currentTimeLog.ready.length > 0) {//If ready queue has processes:
            if (input.algorithm == 'rr') {//Pick first ready process and assign time slice (quantum).
                found = currentTimeLog.ready[0];
                utility.remainingTimeRunning[found] = Math.min(utility.remainingProcessTime[found][utility.currentProcessIndex[found]], input.timeQuantum);
            } else {
                let candidates = currentTimeLog.ready;
                candidates.sort((a, b) => a - b);//ascending order (sort by process id)
                candidates.sort((a, b) => {
                    switch (input.algorithm) {
                        case 'fcfs':
                            return utility.returnTime[a] - utility.returnTime[b];//Intially returnTime is arrivalTime// FCFS: Select the process that arrived first (i.e., lowest returnTime).
                        case 'sjf':
                        case 'srtf':
                            return utility.remainingBurstTime[a] - utility.remainingBurstTime[b];//SJF/SRTF: Choose the process with the shortest remaining burst time.
                        case 'ljf':
                        case 'lrtf':
                            return utility.remainingBurstTime[b] - utility.remainingBurstTime[a];//LJF/LRTF: Choose the process with the longest remaining burst time.
                        case 'pnp':
                        case 'pp':
                            return priorityPreference * (input.priority[a] - input.priority[b]);//Priority (Preemptive or Non-Preemptive): Pick the process with higher priority.
                            //priorityPreference is likely -1 if lower number means higher priority.

                            //ignore
                        // case 'hrrn':
                        //     function responseRatio(id) {
                        //         let s = utility.remainingBurstTime[id];
                        //         let w = currentTimeLog.time - input.arrivalTime[id] - s;
                        //         return 1 + w / s;
                        //     }
                        //     return responseRatio(b) - responseRatio(a);
                        //     //
                    }
                });

                found = candidates[0];//After sorting, the best candidate is chosen as the first one in the list.

                //if found != lastFound and apan ne sort kiya hai based on priority and lastfound != found hai matlab jo nai process aayi hai vo upar hai to high priority hai lastfound se so context switch 
                if (input.algorithmType == "preemptive" && found >= 0 && lastFound >= 0 && found != lastFound) { //context switch
                    output.schedule.push([-2, input.contextSwitch]);//[-2, X] is a marker in the schedule for context switch.
                    for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {//Increment the current time during context switch, and update the queues.
                        updateReadyQueue(currentTimeLog);
                    }//this loop is for context switch like if context switch time is 5 sec so in this 5 sec cpu is idle and we increase current time by 5 sec and update the ready queue
                
                    if (input.contextSwitch > 0) {
                        output.contextSwitches++;
                    }
                }
            }
            moveElement(found, currentTimeLog.ready, currentTimeLog.running);// remove from ready(if present agar phale se running mai hai to if vala case hoga to running mai phale se hoga or ready mai nahi) state and put it into running state if not in running
            currentTimeLog.move.push(1);
            output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
            currentTimeLog.move = [];
            if (utility.start[found] == false) {
                utility.start[found] = true;
                output.responseTime[found] = currentTimeLog.time - input.arrivalTime[found];
            }
        }
        currentTimeLog.time++;
        if (found != -1) {
            output.schedule.push([found + 1, 1]);
            utility.remainingProcessTime[found][utility.currentProcessIndex[found]]--;
            utility.remainingBurstTime[found]--;

            if (input.algorithm == 'rr') {
                utility.remainingTimeRunning[found]--;
                if (utility.remainingTimeRunning[found] == 0) {
                    if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
                        utility.currentProcessIndex[found]++;
                        if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
                            utility.done[found] = true;
                            output.completionTime[found] = currentTimeLog.time;
                            moveElement(found, currentTimeLog.running, currentTimeLog.terminate);
                            currentTimeLog.move.push(2);
                        } else {
                            utility.returnTime[found] = currentTimeLog.time + input.processTime[found][utility.currentProcessIndex[found]];
                            utility.currentProcessIndex[found]++;
                            moveElement(found, currentTimeLog.running, currentTimeLog.block);
                            currentTimeLog.move.push(4);
                        }
                        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
                        currentTimeLog.move = [];
                        updateReadyQueue(currentTimeLog);
                    } else {
                        updateReadyQueue(currentTimeLog);
                        moveElement(found, currentTimeLog.running, currentTimeLog.ready);
                        currentTimeLog.move.push(3);
                        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
                        currentTimeLog.move = [];
                    }
                    output.schedule.push([-2, input.contextSwitch]);
                    for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {
                        updateReadyQueue(currentTimeLog);
                    }
                    if (input.contextSwitch > 0) {
                        output.contextSwitches++;
                    }
                }
            } else { //preemptive and non-preemptive
                if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
                    utility.currentProcessIndex[found]++;
                    if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
                        utility.done[found] = true;
                        output.completionTime[found] = currentTimeLog.time;
                        moveElement(found, currentTimeLog.running, currentTimeLog.terminate);
                        currentTimeLog.move.push(2);
                    } else {
                        utility.returnTime[found] = currentTimeLog.time + input.processTime[found][utility.currentProcessIndex[found]];
                        utility.currentProcessIndex[found]++;
                        moveElement(found, currentTimeLog.running, currentTimeLog.block);
                        currentTimeLog.move.push(4);
                    }
                    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
                    currentTimeLog.move = [];
                    if (currentTimeLog.running.length == 0) { //context switch
                        output.schedule.push([-2, input.contextSwitch]);
                        for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {
                            updateReadyQueue(currentTimeLog);
                        }
                        if (input.contextSwitch > 0) {
                            output.contextSwitches++;
                        }
                    }
                    lastFound = -1;
                } else if (input.algorithmType == "preemptive") {
                    moveElement(found, currentTimeLog.running, currentTimeLog.ready);
                    currentTimeLog.move.push(3);
                    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
                    currentTimeLog.move = [];
                    lastFound = found;
                }
            }
        } else {
            output.schedule.push([-1, 1]);
            lastFound = -1;
        }
        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
    }
    output.schedule.pop();
}

function calculateOutput() {
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
    let mainInput = new Input();
    let mainUtility = new Utility();
    let mainOutput = new Output();
    setInput(mainInput);
    setUtility(mainInput, mainUtility);
    CPUScheduler(mainInput, mainUtility, mainOutput);
    setOutput(mainInput, mainOutput);
    showOutput(mainInput, mainOutput, outputDiv);
}

document.getElementById("calculate").onclick = () => {
    calculateOutput();
};

// //priority preferences change
// let priorityPreference = 1; 
// document.getElementById("priority-toggle-btn").onclick = () => {
//     let currentPriorityPreference = document.getElementById("priority-preference").innerText;
//     if (currentPriorityPreference == "high") {
//         document.getElementById("priority-preference").innerText = "low";
//     } else {
//         document.getElementById("priority-preference").innerText = "high";
//     }
//     priorityPreference *= -1;
// };

// let selectedAlgorithm = document.querySelector("#algo");

// //check wether process is rr or not, if rr then remove 'hide' means show time-quantum colomn
// function checkTimeQuantumInput() {
//     let timequantum = document.querySelector("#time-quantum").classList;
//     if (selectedAlgorithm.value === 'rr') {
//         timequantum.remove("hide");
//     } else {
//         timequantum.add("hide");
//     }
// }

// //Similar to the checkTimeQuantumInput() function, this checks if the selected algorithm is 
// // "priority non-preemptive" (pnp) or "priority preemptive" (pp). 
// // If so, it shows priority-related fields; 
// // otherwise, it hides them.

// function checkPriorityCell() {
//     let prioritycell = document.querySelectorAll(".priority");
//     if (selectedAlgorithm.value === "pnp" || selectedAlgorithm.value === "pp") {
//         prioritycell.forEach((element) => {
//             element.classList.remove("hide");
//         });
//     } else {
//         prioritycell.forEach((element) => {
//             element.classList.add("hide");
//         });
//     }
// }

//  selectedAlgorithm.onchange = () => {
//     checkTimeQuantumInput();
//     checkPriorityCell();
//  };


// function inputOnChange() { //onchange EventListener for input
//     let inputs = document.querySelectorAll('input');
//     inputs.forEach((input) => {
//         if (input.type == 'number') {
//             input.onchange = () => {
//                 let inputVal = Number(input.value);
//                 let isInt = Number.isInteger(inputVal);
//                 if (input.parentNode.classList.contains('arrival-time') || input.id == 'context-switch') //min 0 : arrival time
//                 {
//                     if (!isInt || (isInt && inputVal < 0)) {
//                         input.value = 0;
//                     } else {
//                         input.value = inputVal;
//                     }
//                 } else //min 1 : time quantum, priority, process time
//                 {
//                     if (!isInt || (isInt && inputVal < 1)) {
//                         input.value = 1;
//                     } else {
//                         input.value = inputVal;
//                     }
//                 }
//             }
//         }
//     });
// }

// inputOnChange();
// let process = 1;
// //resize burst time rows size on +/-

// function gcd(x, y) {
//     while (y) {
//         let t = y;
//         y = x % y;
//         x = t;
//     }
//     return x;
// }

// function lcm(x, y) {
//     return (x * y) / gcd(x, y);
// }

// function lcmAll() {
//     let result = 1;
//     for (let i = 0; i < process; i++) {
//         result = lcm(result, document.querySelector(".main-table").rows[2 * i + 2].cells.length);
//     }
//     return result;
// }

// function updateColspan() { //update burst time cell colspan
//     let totalColumns = lcmAll();
//     let processHeading = document.querySelector("thead .process-time");
//     processHeading.setAttribute("colspan", totalColumns);
//     let processTimes = [];
//     let table = document.querySelector(".main-table");
//     for (let i = 0; i < process; i++) {
//         let row = table.rows[2 * i + 2].cells;
//         processTimes.push(row.length);
//     }
//     for (let i = 0; i < process; i++) {
//         let row1 = table.rows[2 * i + 1].cells;
//         let row2 = table.rows[2 * i + 2].cells;
//         for (let j = 0; j < processTimes[i]; j++) {
//             row1[j + 3].setAttribute("colspan", totalColumns / processTimes[i]);
//             row2[j].setAttribute("colspan", totalColumns / processTimes[i]);
//         }
//     }
// }

// function addremove() { //add remove bt-io time pair add event listener
//     let processTimes = [];
//     let table = document.querySelector(".main-table");
//     for (let i = 0; i < process; i++) {
//         let row = table.rows[2 * i + 2].cells;
//         processTimes.push(row.length);
//     }
//     let addbtns = document.querySelectorAll(".add-process-btn");
//     for (let i = 0; i < process; i++) {
//         addbtns[i].onclick = () => {
//             let table = document.querySelector(".main-table");
//             let row1 = table.rows[2 * i + 1];
//             let row2 = table.rows[2 * i + 2];
//             let newcell1 = row1.insertCell(processTimes[i] + 3);
//             newcell1.innerHTML = "IO";
//             newcell1.classList.add("process-time");
//             newcell1.classList.add("io");
//             newcell1.classList.add("process-heading");
//             let newcell2 = row2.insertCell(processTimes[i]);
//             newcell2.innerHTML = '<input type="number" min="1" step="1" value="1">';
//             newcell2.classList.add("process-time");
//             newcell2.classList.add("io");
//             newcell2.classList.add("process-input");
//             let newcell3 = row1.insertCell(processTimes[i] + 4);
//             newcell3.innerHTML = "CPU";
//             newcell3.classList.add("process-time");
//             newcell3.classList.add("cpu");
//             newcell3.classList.add("process-heading");
//             let newcell4 = row2.insertCell(processTimes[i] + 1);
//             newcell4.innerHTML = '<input type="number" min="1" step="1" value="1">';
//             newcell4.classList.add("process-time");
//             newcell4.classList.add("cpu");
//             newcell4.classList.add("process-input");
//             processTimes[i] += 2;
//             updateColspan();
//             inputOnChange();
//         };
//     }
//     let removebtns = document.querySelectorAll(".remove-process-btn");
//     for (let i = 0; i < process; i++) {
//         removebtns[i].onclick = () => {
//             if (processTimes[i] > 1) {
//                 let table = document.querySelector(".main-table");
//                 processTimes[i]--;
//                 let row1 = table.rows[2 * i + 1];
//                 row1.deleteCell(processTimes[i] + 3);
//                 let row2 = table.rows[2 * i + 2];
//                 row2.deleteCell(processTimes[i]);
//                 processTimes[i]--;
//                 table = document.querySelector(".main-table");
//                 row1 = table.rows[2 * i + 1];
//                 row1.deleteCell(processTimes[i] + 3);
//                 row2 = table.rows[2 * i + 2];
//                 row2.deleteCell(processTimes[i]);
//                 updateColspan();
//             }
//         };
//     }
// }
// addremove();

// function addProcess() {
//     process++;
//     let rowHTML1 = `
//                           <td class="process-id" rowspan="2">P${process}</td>
//                           <td class="priority hide" rowspan="2"><input type="number" min="1" step="1" value="1"></td>
//                           <td class="arrival-time" rowspan="2"><input type="number" min="0" step="1" value="0"> </td>
//                           <td class="process-time cpu process-heading" colspan="">CPU</td>
//                           <td class="process-btn"><button type="button" class="add-process-btn">+</button></td>
//                           <td class="process-btn"><button type="button" class="remove-process-btn">-</button></td>
//                       `;
//     let rowHTML2 = `
//                            <td class="process-time cpu process-input"><input type="number" min="1" step="1" value="1"> </td>
//                       `;
//     let table = document.querySelector(".main-table tbody");
//     table.insertRow(table.rows.length).innerHTML = rowHTML1;
//     table.insertRow(table.rows.length).innerHTML = rowHTML2;
//     checkPriorityCell();
//     addremove();
//     updateColspan();
//     inputOnChange();
// }

// function deleteProcess() {
//     let table = document.querySelector(".main-table");
//     if (process > 1) {
//         table.deleteRow(table.rows.length - 1);
//         table.deleteRow(table.rows.length - 1);
//         process--;
//     }
//     updateColspan();
//     inputOnChange();
// }

// document.querySelector(".add-btn").onclick = () => { //add row event listener
//     addProcess();
// };
// document.querySelector(".remove-btn").onclick = () => { //remove row event listener
//     deleteProcess();
// };

// //------------------------
// class Input {
// //     //EX -> let input = new Input();
// // input.processId = [0, 1, 2];
// // input.arrivalTime = [0, 1, 2];
// // input.processTime = [
// //   [4, 2, 3],  // Process 0: burst 4 → block 2 → burst 3
// //   [3, 5],     // Process 1: burst 3 → block 5
// //   [6]         // Process 2: burst 6
// // ];
// // input.processTimeLength = [3, 2, 1];
// // input.totalBurstTime = [7, 3, 6]; // (Sum of burst times: Process 0: 4+3, Process 1: 3, Process 2: 6)
// // input.algorithm = 'rr'; // Example: Round Robin
// // input.algorithmType = 'preemptive';
// // input.timeQuantum = 2;
// // input.contextSwitch = 1;

//     constructor() {
//         this.processId = [];// Array of process IDs. For example, [0, 1, 2] for three processes.
//         this.priority = [];//Array of priorities for each process (used in priority-based algorithms).
//         this.arrivalTime = [];//Array of arrival times for each process. Determines when a process becomes eligible to execute.
//         this.processTime = [];//2D array where each sub-array represents the burst times and block times 
//         // for a process. E.g., [[4, 3, 2]] for a process with burst 4, block 3, and burst 2. block means i/o
//         // [4, 3, 2] means burst time 4 then i/o 3 then burst 2
//         this.processTimeLength = [];//Array representing the length of processTime for each process. E.g., [3] for the example above.[[4,3,2]] 3 for [4,3,2]
//         this.totalBurstTime = [];//Total CPU burst time of each process (sum of all burst times in processTime). for each process it is array so
//         //totalBurstTIme[0] = 4 + 2 (for process 0 bt is 4 + 2)
    
//         this.algorithm = "";//The scheduling algorithm used (e.g., "fcfs", "rr", "sjf").
//         this.algorithmType = "";// Type of algorithm: "preemptive" or "non-preemptive".
//         this.timeQuantum = 0;//Time quantum for Round Robin (RR) scheduling.
//         this.contextSwitch = 0;//Time required to switch between processes.
//     }
// }
// class Utility {
//     constructor() {

//         this.remainingProcessTime = [];
//         //Represents the remaining execution times for each phase (burst/block) of each process.\
//         //  It mirrors processTime, but it gets updated during execution.
//         /////////
//         // utility.remainingProcessTime = [
//         //     [4, 2, 3],  // Process 0: burst-block-burst
//         //     [3, 5],     // Process 1: burst-block
//         //     [6]         // Process 2: single burst
//         //   ];
// ////////////////
//           //After 2 time units (Round Robin):
//         //Process 0 executes for 2 units: remainingProcessTime[0] = [2, 2, 3].
//         //Process 1 and Process 2 remain unchanged.
        
//         this.remainingBurstTime = [];
//         //Initial Value:utility.remainingBurstTime = [7, 3, 6]; // Total burst time per process
//         //After 2 time units (Round Robin):
//         //Process 0 executes for 2 units: remainingBurstTime[0] = 5.
//         //Process 1 and Process 2 remain unchanged.

//         this.remainingTimeRunning = [];
//        // Tracks the remaining time for the currently running process, especially for algorithms like Round Robin.
//         //Initial Value:utility.remainingTimeRunning = [0, 0, 0]; // No process is running initially
//         //When Process 0 starts executing with a time quantum of 2:
//         //utility.remainingTimeRunning[0] = 2; // Process 0 can run for 2 time units before being preempted
//         //After 2 time units:The time quantum for Process 0 expires: remainingTimeRunning[0] = 0.

//         this.currentProcessIndex = [];
//         //Tracks the current phase (burst or block) for each process.
//         //Initial Value : utility.currentProcessIndex = [0, 0, 0]; // All processes start at their first burst phase
//         //After Process 0 finishes its first burst (4 time units):Process 0 moves to its second phase (block): currentProcessIndex[0] = 1.

//         this.start = [];
//         //Boolean array to track whether a process has started execution.
//         // Initial Value: utility.start = [false, false, false]; // No processes have started
//         //After Process 0 starts: utility.start = [true, false, false];

//         this.done = [];
//         //Boolean array to track whether a process has completed execution.
//         //Initial Value : utility.done = [false, false, false]; // No processes are done
//         //After all phases of Process 0 are complete: utility.done = [true, false, false];

//         this.returnTime = [];
//         //Tracks the time when a blocked process is expected to return to the ready queue.
//         //Initial Value : utility.returnTime = [Infinity, Infinity, Infinity]; // No processes are in the block state initially
//         //After Process 0 enters its block phase at time 4 (block time = 2):
//         // Process 0 will return at currentTime + 2 = 6.
//         //utility.returnTime = [6, Infinity, Infinity];

//         this.currentTime = 0;
//         //utility.currentTime = 0; // Simulation starts at time 0
//         //After 3 time units:
//         //utility.currentTime = 3;
//     }
// }
// class Output {
//     constructor() {
//         this.completionTime = [];
//         this.turnAroundTime = [];
//         this.waitingTime = [];
//         this.responseTime = [];
//         this.schedule = [];
//         this.timeLog = [];
//         this.contextSwitches = 0;
//         this.averageTimes = []; //ct,tat,wt,rt
//     }
// }
// class TimeLog {
//     constructor() {
//         this.time = -1;
//         //The current simulation time.
//         this.remain = [];
//         //Array of processes yet to start execution (remaining processes).
//         this.ready = [];
//         //Array of processes ready for execution.
//         this.running = [];
//         //Array containing the process currently executing (usually at most one process).
//         this.block = [];
//         //Array of processes in the block state.
//         this.terminate = [];
//         //Array of processes that have completed execution.
//         this.move = []; //0-remain->ready 1-ready->running 2-running->terminate 3-running->ready 4-running->block 5-block->ready
//     }
//     //Input provides static process and algorithm information.
//     // Utility maintains and updates process states dynamically during simulation.
//     // Output stores results, logs, and metrics of the scheduling simulation.
//     // TimeLog captures snapshots of the system state, which are saved in Output.timeLog.
// }

// function setAlgorithmNameType(input, algorithm) {
//     input.algorithm = algorithm;
//     switch (algorithm) {
//         case 'fcfs':
//         case 'sjf':
//         case 'ljf':
//         case 'pnp':
//         case 'hrrn':
//             input.algorithmType = "nonpreemptive";
//             break;
//         case 'srtf':
//         case 'lrtf':
//         case 'pp':
//             input.algorithmType = "preemptive";
//             break;
//         case 'rr':
//             input.algorithmType = "roundrobin";
//             break;
//     }
// }

// function setInput(input) {
//     for (let i = 1; i <= process; i++) {

//         input.processId.push(i - 1);
//         //rowCells1: Contains priority and arrival time
//         let rowCells1 = document.querySelector(".main-table").rows[2 * i - 1].cells;
//         //rowCells2: Contains alternating CPU/I/O burst times
//         let rowCells2 = document.querySelector(".main-table").rows[2 * i].cells;

//         input.priority.push(Number(rowCells1[1].firstElementChild.value));
//         input.arrivalTime.push(Number(rowCells1[2].firstElementChild.value));

//         let ptn = Number(rowCells2.length);//// how many burst/block times
//         let pta = [];
//         for (let j = 0; j < ptn; j++) {
//             pta.push(Number(rowCells2[j].firstElementChild.value));
//         }
//         input.processTime.push(pta);// Save burst/block times
//         input.processTimeLength.push(ptn);// Save how many entries
//     } 

//     //total burst time for each process ignoring i/o
//     input.totalBurstTime = new Array(process).fill(0);
//     input.processTime.forEach((e1, i) => {
//         e1.forEach((e2, j) => {
//             if (j % 2 == 0) {
//                 input.totalBurstTime[i] += e2;
//             }
//         });
//     });
//     setAlgorithmNameType(input, selectedAlgorithm.value);
//     input.contextSwitch = Number(document.querySelector("#context-switch").value);
//     input.timeQuantum = Number(document.querySelector("#tq").value);
// }

// function setUtility(input, utility) {

//     utility.remainingProcessTime = input.processTime.slice();
//     //remainingProcessTime is a copy of the full 2D array of CPU and IO times for each process.
//     //For example, if input.processTime = [[5, 3, 4], [2, 2]], then utility.remainingProcessTime = [[5, 3, 4], [2, 2]].

//     utility.remainingBurstTime = input.totalBurstTime.slice();
//     //Copies the total CPU burst time for each process.
//     //Used to track how much CPU time is still left in total.(array)

//     utility.remainingTimeRunning = new Array(process).fill(0);
//     //Initializes to 0 for each process.
//     //This is used to track how much time is left in the current CPU or I/O burst 
//     // (i.e., the currentProcessIndex-th entry of that process's time array).

//     utility.currentProcessIndex = new Array(process).fill(0);
//     //Keeps track of which index in the processTime array the process is currently executing.
//     //For example: if processTime = [5, 3, 4], and currentProcessIndex = 2, then the process is in the last burst (4 units).
//     utility.start = new Array(process).fill(false);
//     //A flag array to track if a process has started its first CPU burst yet.
//     //Useful for computing response time.
//     utility.done = new Array(process).fill(false);
//     //A flag array to track whether the process is fully completed (all bursts done and terminated).
//     utility.returnTime = input.arrivalTime.slice();
//     //Initially, this is just the process arrival time.
//     //Later, it is updated to track the return time from the block (I/O) phase to decide when the process is ready again.
// }

// function reduceSchedule(schedule) {
//     let newSchedule = [];
//     let currentScheduleElement = schedule[0][0];

//     let currentScheduleLength = schedule[0][1];
//     for (let i = 1; i < schedule.length; i++) {
//         if (schedule[i][0] == currentScheduleElement) {
//             currentScheduleLength += schedule[i][1];
//         } else {
//             newSchedule.push([currentScheduleElement, currentScheduleLength]);
//             currentScheduleElement = schedule[i][0];
//             currentScheduleLength = schedule[i][1];
//         }
//     }
//     newSchedule.push([currentScheduleElement, currentScheduleLength]);
//     return newSchedule;
// } 

// function reduceTimeLog(timeLog) {
//     let timeLogLength = timeLog.length;
//     let newTimeLog = [],
//         j = 0;
//     for (let i = 0; i < timeLogLength - 1; i++) {
//         if (timeLog[i] != timeLog[i + 1]) {
//             newTimeLog.push(timeLog[j]);
//         }
//         j = i + 1;
//     }
//     if (j == timeLogLength - 1) {
//         newTimeLog.push(timeLog[j]);
//     }
//     return newTimeLog;
// }

// function outputAverageTimes(output) {
//     let avgct = 0;
//     output.completionTime.forEach((element) => {
//         avgct += element;
//     });
//     avgct /= process;
//     let avgtat = 0;
//     output.turnAroundTime.forEach((element) => {
//         avgtat += element;
//     });
//     avgtat /= process;
//     let avgwt = 0;
//     output.waitingTime.forEach((element) => {
//         avgwt += element;
//     });
//     avgwt /= process;
//     let avgrt = 0;
//     output.responseTime.forEach((element) => {
//         avgrt += element;
//     });
//     avgrt /= process;
//     return [avgct, avgtat, avgwt, avgrt];
// }

// function setOutput(input, output) {
//     //set turn around time and waiting time
//     for (let i = 0; i < process; i++) {
//         output.turnAroundTime[i] = output.completionTime[i] - input.arrivalTime[i];
//         output.waitingTime[i] = output.turnAroundTime[i] - input.totalBurstTime[i];
//     }
//     output.schedule = reduceSchedule(output.schedule);
//     output.timeLog = reduceTimeLog(output.timeLog);
//     output.averageTimes = outputAverageTimes(output);
// }

// function getDate(sec) {
//     return (new Date(0, 0, 0, 0, sec / 60, sec % 60));
// }

// function showGanttChart(output, outputDiv) {
//     let ganttChartHeading = document.createElement("h3");
//     ganttChartHeading.innerHTML = "Gantt Chart";
//     outputDiv.appendChild(ganttChartHeading);
//     let ganttChartData = [];
//     let startGantt = 0;
//     output.schedule.forEach((element) => {
//         if (element[0] == -2) { //context switch
//             ganttChartData.push([
//                 "Time",
//                 "CS",
//                 "grey",
//                 getDate(startGantt),
//                 getDate(startGantt + element[1])
//             ]);

//         } else if (element[0] == -1) { //nothing
//             ganttChartData.push([
//                 "Time",
//                 "Empty",
//                 "black",
//                 getDate(startGantt),
//                 getDate(startGantt + element[1])
//             ]);

//         } else { //process 
//             ganttChartData.push([
//                 "Time",
//                 "P" + element[0],
//                 "",
//                 getDate(startGantt),
//                 getDate(startGantt + element[1])
//             ]);
//         }
//         startGantt += element[1];
//     });
//     let ganttChart = document.createElement("div");
//     ganttChart.id = "gantt-chart";

//     google.charts.load("current", { packages: ["timeline"] });
//     google.charts.setOnLoadCallback(drawGanttChart);

//     function drawGanttChart() {
//         var container = document.getElementById("gantt-chart");
//         var chart = new google.visualization.Timeline(container);
//         var dataTable = new google.visualization.DataTable();

//         dataTable.addColumn({ type: "string", id: "Gantt Chart" });
//         dataTable.addColumn({ type: "string", id: "Process" });
//         dataTable.addColumn({ type: 'string', id: 'style', role: 'style' });
//         dataTable.addColumn({ type: "date", id: "Start" });
//         dataTable.addColumn({ type: "date", id: "End" });
//         dataTable.addRows(ganttChartData);
//         let ganttWidth = '100%';
//         if (startGantt >= 20) {
//             ganttWidth = 0.05 * startGantt * screen.availWidth;
//         }
//         var options = {
//             width: ganttWidth,
//             timeline: {
//                 showRowLabels: false,
//                 avoidOverlappingGridLines: false
//             }
//         };
//         chart.draw(dataTable, options);
//     }
//     outputDiv.appendChild(ganttChart);
// }

// function showTimelineChart(output, outputDiv) {
//     let timelineChartHeading = document.createElement("h3");
//     timelineChartHeading.innerHTML = "Timeline Chart";
//     outputDiv.appendChild(timelineChartHeading);
//     let timelineChartData = [];
//     let startTimeline = 0;
//     output.schedule.forEach((element) => {
//         if (element[0] >= 0) { //process 
//             timelineChartData.push([
//                 "P" + element[0],
//                 getDate(startTimeline),
//                 getDate(startTimeline + element[1])
//             ]);
//         }
//         startTimeline += element[1];
//     });
//     timelineChartData.sort((a, b) => parseInt(a[0].substring(1, a[0].length)) - parseInt(b[0].substring(1, b[0].length)));
//     let timelineChart = document.createElement("div");
//     timelineChart.id = "timeline-chart";

//     google.charts.load("current", { packages: ["timeline"] });
//     google.charts.setOnLoadCallback(drawTimelineChart);

//     function drawTimelineChart() {
//         var container = document.getElementById("timeline-chart");
//         var chart = new google.visualization.Timeline(container);
//         var dataTable = new google.visualization.DataTable();

//         dataTable.addColumn({ type: "string", id: "Process" });
//         dataTable.addColumn({ type: "date", id: "Start" });
//         dataTable.addColumn({ type: "date", id: "End" });
//         dataTable.addRows(timelineChartData);

//         let timelineWidth = '100%';
//         if (startTimeline >= 20) {
//             timelineWidth = 0.05 * startTimeline * screen.availWidth;
//         }
//         var options = {
//             width: timelineWidth,
//         };
//         chart.draw(dataTable, options);
//     }
//     outputDiv.appendChild(timelineChart);
// }

// function showFinalTable(input, output, outputDiv) {
//     let finalTableHeading = document.createElement("h3");
//     finalTableHeading.innerHTML = "Final Table";
//     outputDiv.appendChild(finalTableHeading);
//     let table = document.createElement("table");
//     table.classList.add("final-table");
//     let thead = table.createTHead();
//     let row = thead.insertRow(0);
//     let headings = [
//         "Process",
//         "Arrival Time",
//         "Total Burst Time",
//         "Completion Time",
//         "Turn Around Time",
//         "Waiting Time",
//         "Response Time",
//     ];
//     headings.forEach((element, index) => {
//         let cell = row.insertCell(index);
//         cell.innerHTML = element;
//     });
//     let tbody = table.createTBody();
//     for (let i = 0; i < process; i++) {
//         let row = tbody.insertRow(i);
//         let cell = row.insertCell(0);
//         cell.innerHTML = "P" + (i + 1);
//         cell = row.insertCell(1);
//         cell.innerHTML = input.arrivalTime[i];
//         cell = row.insertCell(2);
//         cell.innerHTML = input.totalBurstTime[i];
//         cell = row.insertCell(3);
//         cell.innerHTML = output.completionTime[i];
//         cell = row.insertCell(4);
//         cell.innerHTML = output.turnAroundTime[i];
//         cell = row.insertCell(5);
//         cell.innerHTML = output.waitingTime[i];
//         cell = row.insertCell(6);
//         cell.innerHTML = output.responseTime[i];
//     }
//     outputDiv.appendChild(table);

//     let tbt = 0;
//     input.totalBurstTime.forEach((element) => (tbt += element));
//     let lastct = 0;
//     output.completionTime.forEach((element) => (lastct = Math.max(lastct, element)));

//     let cpu = document.createElement("p");
//     cpu.innerHTML = "CPU Utilization : " + (tbt / lastct) * 100 + "%";
//     outputDiv.appendChild(cpu);

//     let tp = document.createElement("p");
//     tp.innerHTML = "Throughput : " + process / lastct;
//     outputDiv.appendChild(tp);
//     if (input.contextSwitch > 0) {

//         let cs = document.createElement("p");
//         cs.innerHTML = "Number of Context Switches : " + (output.contextSwitches - 1);
//         outputDiv.appendChild(cs);
//     }
// }

// function toggleTimeLogArrowColor(timeLog, color) {
//     let timeLogMove = ['remain-ready', 'ready-running', 'running-terminate', 'running-ready', 'running-block', 'block-ready'];
//     timeLog.move.forEach(element => {
//         document.getElementById(timeLogMove[element]).style.color = color;
//     });
// }

// function nextTimeLog(timeLog) {
//     let timeLogTableDiv = document.getElementById("time-log-table-div");

//     let arrowHTML = `
//     <p id = "remain-ready" class = "arrow">&rarr;</p>
//     <p id = "ready-running" class = "arrow">&#10554;</p>
//     <p id = "running-ready" class = "arrow">&#10554;</p>
//     <p id = "running-terminate" class = "arrow">&rarr;</p>
//     <p id = "running-block" class = "arrow">&rarr;</p>
//     <p id = "block-ready" class = "arrow">&rarr;</p>
//     `;
//     timeLogTableDiv.innerHTML = arrowHTML;

//     let remainTable = document.createElement("table");
//     remainTable.id = "remain-table";
//     remainTable.className = 'time-log-table';
//     let remainTableHead = remainTable.createTHead();
//     let remainTableHeadRow = remainTableHead.insertRow(0);
//     let remainTableHeading = remainTableHeadRow.insertCell(0);
//     remainTableHeading.innerHTML = "Remain";
//     let remainTableBody = remainTable.createTBody();
//     for (let i = 0; i < timeLog.remain.length; i++) {
//         let remainTableBodyRow = remainTableBody.insertRow(i);
//         let remainTableValue = remainTableBodyRow.insertCell(0);
//         remainTableValue.innerHTML = 'P' + (timeLog.remain[i] + 1);
//     }
//     timeLogTableDiv.appendChild(remainTable);

//     let readyTable = document.createElement("table");
//     readyTable.id = "ready-table";
//     readyTable.className = 'time-log-table';
//     let readyTableHead = readyTable.createTHead();
//     let readyTableHeadRow = readyTableHead.insertRow(0);
//     let readyTableHeading = readyTableHeadRow.insertCell(0);
//     readyTableHeading.innerHTML = "Ready";
//     let readyTableBody = readyTable.createTBody();
//     for (let i = 0; i < timeLog.ready.length; i++) {
//         let readyTableBodyRow = readyTableBody.insertRow(i);
//         let readyTableValue = readyTableBodyRow.insertCell(0);
//         readyTableValue.innerHTML = 'P' + (timeLog.ready[i] + 1);
//     }
//     timeLogTableDiv.appendChild(readyTable);

//     let runningTable = document.createElement("table");
//     runningTable.id = "running-table";
//     runningTable.className = 'time-log-table';
//     let runningTableHead = runningTable.createTHead();
//     let runningTableHeadRow = runningTableHead.insertRow(0);
//     let runningTableHeading = runningTableHeadRow.insertCell(0);
//     runningTableHeading.innerHTML = "Running";
//     let runningTableBody = runningTable.createTBody();
//     for (let i = 0; i < timeLog.running.length; i++) {
//         let runningTableBodyRow = runningTableBody.insertRow(i);
//         let runningTableValue = runningTableBodyRow.insertCell(0);
//         runningTableValue.innerHTML = 'P' + (timeLog.running[i] + 1);
//     }
//     timeLogTableDiv.appendChild(runningTable);

//     let blockTable = document.createElement("table");
//     blockTable.id = "block-table";
//     blockTable.className = 'time-log-table';
//     let blockTableHead = blockTable.createTHead();
//     let blockTableHeadRow = blockTableHead.insertRow(0);
//     let blockTableHeading = blockTableHeadRow.insertCell(0);
//     blockTableHeading.innerHTML = "Block";
//     let blockTableBody = blockTable.createTBody();
//     for (let i = 0; i < timeLog.block.length; i++) {
//         let blockTableBodyRow = blockTableBody.insertRow(i);
//         let blockTableValue = blockTableBodyRow.insertCell(0);
//         blockTableValue.innerHTML = 'P' + (timeLog.block[i] + 1);
//     }
//     timeLogTableDiv.appendChild(blockTable);

//     let terminateTable = document.createElement("table");
//     terminateTable.id = "terminate-table";
//     terminateTable.className = 'time-log-table';
//     let terminateTableHead = terminateTable.createTHead();
//     let terminateTableHeadRow = terminateTableHead.insertRow(0);
//     let terminateTableHeading = terminateTableHeadRow.insertCell(0);
//     terminateTableHeading.innerHTML = "Terminate";
//     let terminateTableBody = terminateTable.createTBody();
//     for (let i = 0; i < timeLog.terminate.length; i++) {
//         let terminateTableBodyRow = terminateTableBody.insertRow(i);
//         let terminateTableValue = terminateTableBodyRow.insertCell(0);
//         terminateTableValue.innerHTML = 'P' + (timeLog.terminate[i] + 1);
//     }
//     timeLogTableDiv.appendChild(terminateTable);
//     document.getElementById("time-log-time").innerHTML = "Time : " + timeLog.time;
// }

// function showTimeLog(output, outputDiv) {
//     reduceTimeLog(output.timeLog);
//     let timeLogDiv = document.createElement("div");
//     timeLogDiv.id = "time-log-div";
//     timeLogDiv.style.height = (15 * process) + 300 + "px";
//     let startTimeLogButton = document.createElement("button");
//     startTimeLogButton.id = "start-time-log";
//     startTimeLogButton.innerHTML = "Start Time Log";
//     timeLogDiv.appendChild(startTimeLogButton);
//     outputDiv.appendChild(timeLogDiv);

//     document.querySelector("#start-time-log").onclick = () => {
//         timeLogStart = 1;
//         let timeLogDiv = document.getElementById("time-log-div");
//         let timeLogOutputDiv = document.createElement("div");
//         timeLogOutputDiv.id = "time-log-output-div";

//         let timeLogTableDiv = document.createElement("div");
//         timeLogTableDiv.id = "time-log-table-div";

//         let timeLogTime = document.createElement("p");
//         timeLogTime.id = "time-log-time";

//         timeLogOutputDiv.appendChild(timeLogTableDiv);
//         timeLogOutputDiv.appendChild(timeLogTime);
//         timeLogDiv.appendChild(timeLogOutputDiv);
//         let index = 0;
//         let timeLogInterval = setInterval(() => {
//             nextTimeLog(output.timeLog[index]);
//             if (index != output.timeLog.length - 1) {
//                 setTimeout(() => {
//                     toggleTimeLogArrowColor(output.timeLog[index], 'red');
//                     setTimeout(() => {
//                         toggleTimeLogArrowColor(output.timeLog[index], 'black');
//                     }, 600);
//                 }, 200);
//             }
//             index++;
//             if (index == output.timeLog.length) {
//                 clearInterval(timeLogInterval);
//             }
//             document.getElementById("calculate").onclick = () => {
//                 clearInterval(timeLogInterval);
//                 document.getElementById("time-log-output-div").innerHTML = "";
//                 calculateOutput();
//             }
//         }, 1000);
//     };
// }

// function showRoundRobinChart(outputDiv) {
//     let roundRobinInput = new Input();
//     setInput(roundRobinInput);
//     let maxTimeQuantum = 0;
//     roundRobinInput.processTime.forEach(processTimeArray => {
//         processTimeArray.forEach((time, index) => {
//             if (index % 2 == 0) {
//                 maxTimeQuantum = Math.max(maxTimeQuantum, time);
//             }
//         });
//     });
//     let roundRobinChartData = [
//         [],
//         [],
//         [],
//         [],
//         []
//     ];
//     let timeQuantumArray = [];
//     for (let timeQuantum = 1; timeQuantum <= maxTimeQuantum; timeQuantum++) {
//         timeQuantumArray.push(timeQuantum);
//         let roundRobinInput = new Input();
//         setInput(roundRobinInput);
//         setAlgorithmNameType(roundRobinInput, 'rr');
//         roundRobinInput.timeQuantum = timeQuantum;
//         let roundRobinUtility = new Utility();
//         setUtility(roundRobinInput, roundRobinUtility);
//         let roundRobinOutput = new Output();
//         CPUScheduler(roundRobinInput, roundRobinUtility, roundRobinOutput);
//         setOutput(roundRobinInput, roundRobinOutput);
//         for (let i = 0; i < 4; i++) {
//             roundRobinChartData[i].push(roundRobinOutput.averageTimes[i]);
//         }
//         roundRobinChartData[4].push(roundRobinOutput.contextSwitches);
//     }
//     let roundRobinChartCanvas = document.createElement('canvas');
//     roundRobinChartCanvas.id = "round-robin-chart";
//     let roundRobinChartDiv = document.createElement('div');
//     roundRobinChartDiv.id = "round-robin-chart-div";
//     roundRobinChartDiv.appendChild(roundRobinChartCanvas);
//     outputDiv.appendChild(roundRobinChartDiv);

//     new Chart(document.getElementById('round-robin-chart'), {
//         type: 'line',
//         data: {
//             labels: timeQuantumArray,
//             datasets: [{
//                     label: "Completion Time",
//                     borderColor: '#3366CC',
//                     data: roundRobinChartData[0]
//                 },
//                 {
//                     label: "Turn Around Time",
//                     borderColor: '#DC3912',
//                     data: roundRobinChartData[1]
//                 },
//                 {
//                     label: "Waiting Time",
//                     borderColor: '#FF9900',
//                     data: roundRobinChartData[2]
//                 },
//                 {
//                     label: "Response Time",
//                     borderColor: '#109618',
//                     data: roundRobinChartData[3]
//                 },
//                 {
//                     label: "Context Switches",
//                     borderColor: '#990099',
//                     data: roundRobinChartData[4]
//                 },
//             ]
//         },
//         options: {
//             title: {
//                 display: true,
//                 text: ['Round Robin', 'Comparison of Completion, Turn Around, Waiting, Response Time and Context Switches', 'The Lower The Better']
//             },
//             scales: {
//                 yAxes: [{
//                     ticks: {
//                         beginAtZero: true
//                     }
//                 }],
//                 xAxes: [{
//                     scaleLabel: {
//                         display: true,
//                         labelString: 'Time Quantum'
//                     }
//                 }]
//             },
//             legend: {
//                 display: true,
//                 labels: {
//                     fontColor: 'black'
//                 }
//             }
//         }
//     });
// }

// function showAlgorithmChart(outputDiv) {
//     let algorithmArray = ["fcfs", "sjf", "srtf", "ljf", "lrtf", "rr", "hrrn", "pnp", "pp"];
//     let algorithmNameArray = ["FCFS", "SJF", "SRTF", "LJF", "LRTF", "RR", "HRRN", "PNP", "PP"];
//     let algorithmChartData = [
//         [],
//         [],
//         [],
//         []
//     ];
//     algorithmArray.forEach(currentAlgorithm => {
//         let chartInput = new Input();
//         let chartUtility = new Utility();
//         let chartOutput = new Output();
//         setInput(chartInput);
//         setAlgorithmNameType(chartInput, currentAlgorithm);
//         setUtility(chartInput, chartUtility);
//         CPUScheduler(chartInput, chartUtility, chartOutput);
//         setOutput(chartInput, chartOutput);
//         for (let i = 0; i < 4; i++) {
//             algorithmChartData[i].push(chartOutput.averageTimes[i]);
//         }
//     });
//     let algorithmChartCanvas = document.createElement('canvas');
//     algorithmChartCanvas.id = "algorithm-chart";
//     let algorithmChartDiv = document.createElement('div');
//     algorithmChartDiv.id = "algorithm-chart-div";
//     algorithmChartDiv.style.height = "40vh";
//     algorithmChartDiv.style.width = "80%";
//     algorithmChartDiv.appendChild(algorithmChartCanvas);
//     outputDiv.appendChild(algorithmChartDiv);
//     new Chart(document.getElementById('algorithm-chart'), {
//         type: 'bar',
//         data: {
//             labels: algorithmNameArray,
//             datasets: [{
//                     label: "Completion Time",
//                     backgroundColor: '#3366CC',
//                     data: algorithmChartData[0]
//                 },
//                 {
//                     label: "Turn Around Time",
//                     backgroundColor: '#DC3912',
//                     data: algorithmChartData[1]
//                 },
//                 {
//                     label: "Waiting Time",
//                     backgroundColor: '#FF9900',
//                     data: algorithmChartData[2]
//                 },
//                 {
//                     label: "Response Time",
//                     backgroundColor: '#109618',
//                     data: algorithmChartData[3]
//                 }
//             ]
//         },
//         options: {
//             title: {
//                 display: true,
//                 text: ['Algorithm', 'Comparison of Completion, Turn Around, Waiting and Response Time', 'The Lower The Better']
//             },
//             scales: {
//                 yAxes: [{
//                     ticks: {
//                         beginAtZero: true
//                     }
//                 }],
//                 xAxes: [{
//                     scaleLabel: {
//                         display: true,
//                         labelString: 'Algorithms'
//                     }
//                 }]
//             },
//             legend: {
//                 display: true,
//                 labels: {
//                     fontColor: 'black'
//                 }
//             }
//         }
//     });
// }

// function showOutput(input, output, outputDiv) {
//     showGanttChart(output, outputDiv);
//     outputDiv.insertAdjacentHTML("beforeend", "<hr>");
//     showTimelineChart(output, outputDiv);
//     outputDiv.insertAdjacentHTML("beforeend", "<hr>");
//     showFinalTable(input, output, outputDiv);
//     outputDiv.insertAdjacentHTML("beforeend", "<hr>");
//     showTimeLog(output, outputDiv);
//     outputDiv.insertAdjacentHTML("beforeend", "<hr>");
//     if (selectedAlgorithm.value == "rr") {
//         showRoundRobinChart(outputDiv);
//         outputDiv.insertAdjacentHTML("beforeend", "<hr>");
//     }
//     showAlgorithmChart(outputDiv);
// }

// function CPUScheduler(input, utility, output) {
//     function updateReadyQueue(currentTimeLog) {
//         //This nested helper function updates the ready queue at each time step.

//         let candidatesRemain = currentTimeLog.remain.filter((element) => input.arrivalTime[element] <= currentTimeLog.time);
//         //It selects processes from remain (not yet started) that have arrived by currentTimeLog.time.

//         if (candidatesRemain.length > 0) {
//             currentTimeLog.move.push(0);
//         }
//         //Logs move type 0 (remain → ready).

//         let candidatesBlock = currentTimeLog.block.filter((element) => utility.returnTime[element] <= currentTimeLog.time);
//         //Picks processes from block that are done with I/O and should go back to ready.

//         if (candidatesBlock.length > 0) {
//             currentTimeLog.move.push(5);
//         }
//         //Logs move type 5 (block → ready).

//         let candidates = candidatesRemain.concat(candidatesBlock);
//         candidates.sort((a, b) => utility.returnTime[a] - utility.returnTime[b]);
//         //Merges both groups and sorts by returnTime (indicating when process becomes ready).
//         //Processes from remain come before block, always — because concat adds candidatesRemain first.
//         //If two have same return time, and:
//         //both from remain: order as in remain
//         //both from block: order as in block
//         //one from each: remain always comes before block

//         candidates.forEach(element => {
//             moveElement(element, currentTimeLog.remain, currentTimeLog.ready);
//             moveElement(element, currentTimeLog.block, currentTimeLog.ready);
//         });
//         //Moves processes from remain or block → ready.

//         output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
//         currentTimeLog.move = [];
//         //Saves current state in output.timeLog, then clears move.
//     } 

//     function moveElement(value, from, to) { //if present in from and not in to then remove from 'from' and put it into to
//         let index = from.indexOf(value);
//         if (index != -1) {
//             from.splice(index, 1);
//         }
//         if (to.indexOf(value) == -1) {
//             to.push(value);
//         }
//     }
//     let currentTimeLog = new TimeLog();
//     currentTimeLog.remain = input.processId;
//     output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
//     currentTimeLog.move = [];
//     currentTimeLog.time++;
//     let lastFound = -1;////Keeps track of the previously running process (used for context switches).
//     while (utility.done.some((element) => element == false)) {//Loop until all processes are marked as done.
//         updateReadyQueue(currentTimeLog);

//         let found = -1;
//         if (currentTimeLog.running.length == 1) {//If something is already running, continue running it.
//             found = currentTimeLog.running[0];//process id of process that is currently running
//         } 
//         else if (currentTimeLog.ready.length > 0) {//If ready queue has processes:
//             if (input.algorithm == 'rr') {//Pick first ready process and assign time slice (quantum).
//                 found = currentTimeLog.ready[0];
//                 utility.remainingTimeRunning[found] = Math.min(utility.remainingProcessTime[found][utility.currentProcessIndex[found]], input.timeQuantum);
//             } else {
//                 let candidates = currentTimeLog.ready;
//                 candidates.sort((a, b) => a - b);//ascending order (sort by process id)
//                 candidates.sort((a, b) => {
//                     switch (input.algorithm) {
//                         case 'fcfs':
//                             return utility.returnTime[a] - utility.returnTime[b];//Intially returnTime is arrivalTime// FCFS: Select the process that arrived first (i.e., lowest returnTime).
//                         case 'sjf':
//                         case 'srtf':
//                             return utility.remainingBurstTime[a] - utility.remainingBurstTime[b];//SJF/SRTF: Choose the process with the shortest remaining burst time.
//                         case 'ljf':
//                         case 'lrtf':
//                             return utility.remainingBurstTime[b] - utility.remainingBurstTime[a];//LJF/LRTF: Choose the process with the longest remaining burst time.
//                         case 'pnp':
//                         case 'pp':
//                             return priorityPreference * (input.priority[a] - input.priority[b]);//Priority (Preemptive or Non-Preemptive): Pick the process with higher priority.
//                             //priorityPreference is likely -1 if lower number means higher priority.

//                             //ignore
//                         // case 'hrrn':
//                         //     function responseRatio(id) {
//                         //         let s = utility.remainingBurstTime[id];
//                         //         let w = currentTimeLog.time - input.arrivalTime[id] - s;
//                         //         return 1 + w / s;
//                         //     }
//                         //     return responseRatio(b) - responseRatio(a);
//                         //     //
//                     }
//                 });

//                 found = candidates[0];//After sorting, the best candidate is chosen as the first one in the list.

//                 //if found != lastFound and apan ne sort kiya hai based on priority and lastfound != found hai matlab jo nai process aayi hai vo upar hai to high priority hai lastfound se so context switch 
//                 if (input.algorithmType == "preemptive" && found >= 0 && lastFound >= 0 && found != lastFound) { //context switch
//                     output.schedule.push([-2, input.contextSwitch]);//[-2, X] is a marker in the schedule for context switch.
//                     for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {//Increment the current time during context switch, and update the queues.
//                         updateReadyQueue(currentTimeLog);
//                     }//this loop is for context switch like if context switch time is 5 sec so in this 5 sec cpu is idle and we increase current time by 5 sec and update the ready queue
                
//                     if (input.contextSwitch > 0) {
//                         output.contextSwitches++;
//                     }
//                 }
//             }
//             moveElement(found, currentTimeLog.ready, currentTimeLog.running);// remove from ready(if present agar phale se running mai hai to if vala case hoga to running mai phale se hoga or ready mai nahi) state and put it into running state if not in running
//             currentTimeLog.move.push(1);
//             output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
//             currentTimeLog.move = [];
//             if (utility.start[found] == false) {
//                 utility.start[found] = true;
//                 output.responseTime[found] = currentTimeLog.time - input.arrivalTime[found];
//             }
//         }
//         currentTimeLog.time++;
//         if (found != -1) {
//             output.schedule.push([found + 1, 1]);
//             utility.remainingProcessTime[found][utility.currentProcessIndex[found]]--;
//             utility.remainingBurstTime[found]--;

//             if (input.algorithm == 'rr') {
//                 utility.remainingTimeRunning[found]--;
//                 if (utility.remainingTimeRunning[found] == 0) {
//                     if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
//                         utility.currentProcessIndex[found]++;
//                         if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
//                             utility.done[found] = true;
//                             output.completionTime[found] = currentTimeLog.time;
//                             moveElement(found, currentTimeLog.running, currentTimeLog.terminate);
//                             currentTimeLog.move.push(2);
//                         } else {
//                             utility.returnTime[found] = currentTimeLog.time + input.processTime[found][utility.currentProcessIndex[found]];
//                             utility.currentProcessIndex[found]++;
//                             moveElement(found, currentTimeLog.running, currentTimeLog.block);
//                             currentTimeLog.move.push(4);
//                         }
//                         output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
//                         currentTimeLog.move = [];
//                         updateReadyQueue(currentTimeLog);
//                     } else {
//                         updateReadyQueue(currentTimeLog);
//                         moveElement(found, currentTimeLog.running, currentTimeLog.ready);
//                         currentTimeLog.move.push(3);
//                         output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
//                         currentTimeLog.move = [];
//                     }
//                     output.schedule.push([-2, input.contextSwitch]);
//                     for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {
//                         updateReadyQueue(currentTimeLog);
//                     }
//                     if (input.contextSwitch > 0) {
//                         output.contextSwitches++;
//                     }
//                 }
//             } else { //preemptive and non-preemptive
//                 if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
//                     utility.currentProcessIndex[found]++;
//                     if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
//                         utility.done[found] = true;
//                         output.completionTime[found] = currentTimeLog.time;
//                         moveElement(found, currentTimeLog.running, currentTimeLog.terminate);
//                         currentTimeLog.move.push(2);
//                     } else {
//                         utility.returnTime[found] = currentTimeLog.time + input.processTime[found][utility.currentProcessIndex[found]];
//                         utility.currentProcessIndex[found]++;
//                         moveElement(found, currentTimeLog.running, currentTimeLog.block);
//                         currentTimeLog.move.push(4);
//                     }
//                     output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
//                     currentTimeLog.move = [];
//                     if (currentTimeLog.running.length == 0) { //context switch
//                         output.schedule.push([-2, input.contextSwitch]);
//                         for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {
//                             updateReadyQueue(currentTimeLog);
//                         }
//                         if (input.contextSwitch > 0) {
//                             output.contextSwitches++;
//                         }
//                     }
//                     lastFound = -1;
//                 } else if (input.algorithmType == "preemptive") {
//                     moveElement(found, currentTimeLog.running, currentTimeLog.ready);
//                     currentTimeLog.move.push(3);
//                     output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
//                     currentTimeLog.move = [];
//                     lastFound = found;
//                 }
//             }
//         } else {
//             output.schedule.push([-1, 1]);
//             lastFound = -1;
//         }
//         output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
//     }
//     output.schedule.pop();
// }

// function calculateOutput() {
//     let outputDiv = document.getElementById("output");
//     outputDiv.innerHTML = "";
//     let mainInput = new Input();
//     let mainUtility = new Utility();
//     let mainOutput = new Output();
//     setInput(mainInput);
//     setUtility(mainInput, mainUtility);
//     CPUScheduler(mainInput, mainUtility, mainOutput);
//     setOutput(mainInput, mainOutput);
//     showOutput(mainInput, mainOutput, outputDiv);
// }

// document.getElementById("calculate").onclick = () => {
//     calculateOutput();
// };

