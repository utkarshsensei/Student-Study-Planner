/* =========================================
   STUDENT STUDY PLANNER
   Main JavaScript File
========================================= */


/* =========================================
   DARK MODE
========================================= */

function loadDarkMode() {

    const darkMode =
        localStorage.getItem("darkMode");


    if (darkMode === "true") {

        document.body.classList.add("dark-mode");

    }

}


function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");


    const enabled =
        document.body.classList.contains("dark-mode");


    localStorage.setItem(
        "darkMode",
        enabled
    );

}


/* =========================================
   TASK DATA
========================================= */


/*
    Get tasks from localStorage.

    If there are no tasks stored,
    create two sample tasks.
*/

function getTasks() {

    const storedTasks =
        localStorage.getItem("tasks");


    if (storedTasks) {

        return JSON.parse(storedTasks);

    }


    const defaultTasks = [

        {
            name: "Complete DBMS Assignment",

            subject: "DBMS",

            deadline: "2026-08-16",

            priority: "High",

            completed: false
        },


        {
            name: "Revise Binary Trees",

            subject: "Data Structures",

            deadline: "2026-08-17",

            priority: "Medium",

            completed: false
        }

    ];


    localStorage.setItem(
        "tasks",
        JSON.stringify(defaultTasks)
    );


    return defaultTasks;

}


/* =========================================
   SAVE TASKS
========================================= */

function saveTasks(tasks) {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


/* =========================================
   DISPLAY TASKS
========================================= */

function displayTasks() {

    const taskList =
        document.getElementById("taskList");


    /*
        If we are not on tasks.html,
        stop here.
    */

    if (!taskList) {

        return;

    }


    const tasks = getTasks();


    taskList.innerHTML = "";


    if (tasks.length === 0) {

        taskList.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center text-muted py-4">

                    No tasks available.

                    <br>

                    Add a new task to get started!

                </td>

            </tr>

        `;

        return;

    }


    tasks.forEach(function (task, index) {


        /* Priority badge */

        let priorityClass;


        if (task.priority === "High") {

            priorityClass = "bg-danger";

        }

        else if (task.priority === "Medium") {

            priorityClass =
                "bg-warning text-dark";

        }

        else {

            priorityClass = "bg-success";

        }


        /* Status badge */

        let statusClass;

        let statusText;


        if (task.completed) {

            statusClass = "bg-success";

            statusText = "Completed";

        }

        else {

            statusClass =
                "bg-warning text-dark";

            statusText = "Pending";

        }


        /* Create row */

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${task.name}
            </td>


            <td>
                ${task.subject}
            </td>


            <td>
                ${task.deadline}
            </td>


            <td>

                <span
                    class="badge ${priorityClass}">

                    ${task.priority}

                </span>

            </td>


            <td>

                <span
                    class="badge ${statusClass}">

                    ${statusText}

                </span>

            </td>


            <td>


                ${
                    task.completed
                    ?

                    ""

                    :

                    `

                    <button
                        class="btn btn-sm btn-success"
                        onclick="completeTask(${index})">

                        ✓

                    </button>

                    `
                }


                <button
                    class="btn btn-sm btn-danger"
                    onclick="deleteTask(${index})">

                    🗑

                </button>


            </td>

        `;


        taskList.appendChild(row);

    });

}


/* =========================================
   ADD TASK
========================================= */

function setupTaskForm() {

    const taskForm =
        document.getElementById("taskForm");


    /*
        If task form doesn't exist,
        we're not on tasks.html.
    */

    if (!taskForm) {

        return;

    }


    taskForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* Get form values */

            const taskName =
                document.getElementById(
                    "taskName"
                ).value.trim();


            const taskSubject =
                document.getElementById(
                    "taskSubject"
                ).value;


            const taskDeadline =
                document.getElementById(
                    "taskDeadline"
                ).value;


            const taskPriority =
                document.getElementById(
                    "taskPriority"
                ).value;


            /* Create task */

            const newTask = {

                name: taskName,

                subject: taskSubject,

                deadline: taskDeadline,

                priority: taskPriority,

                completed: false

            };


            /* Get existing tasks */

            const tasks =
                getTasks();


            /* Add new task */

            tasks.push(newTask);


            /* Save */

            saveTasks(tasks);


            /* Refresh task table */

            displayTasks();


            /* Reset form */

            taskForm.reset();


            /* Close modal */

            const modalElement =
                document.getElementById(
                    "taskModal"
                );


            if (modalElement) {

                const modal =
                    bootstrap.Modal.getInstance(
                        modalElement
                    );


                if (modal) {

                    modal.hide();

                }

            }


            /*
                Update dashboard
                if currently visible.
            */

            updateDashboard();

        }
    );

}


/* =========================================
   COMPLETE TASK
========================================= */

function completeTask(index) {

    const tasks =
        getTasks();


    if (!tasks[index]) {

        return;

    }


    tasks[index].completed = true;


    saveTasks(tasks);


    displayTasks();


    updateDashboard();

}


/* Make function available to HTML */

window.completeTask =
    completeTask;


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(index) {

    const tasks =
        getTasks();


    if (!tasks[index]) {

        return;

    }


    tasks.splice(index, 1);


    saveTasks(tasks);


    displayTasks();


    updateDashboard();

}


/* Make function available to HTML */

window.deleteTask =
    deleteTask;


/* =========================================
   UPDATE DASHBOARD
========================================= */

function updateDashboard() {

    const tasks =
        getTasks();


    /* -------------------------
       Pending Tasks
    ------------------------- */

    const pendingTasks =
        tasks.filter(
            function (task) {

                return !task.completed;

            }
        ).length;


    const pendingElement =
        document.getElementById(
            "pendingTaskCount"
        );


    if (pendingElement) {

        pendingElement.innerText =
            pendingTasks;

    }


    /* -------------------------
       Completed Tasks
    ------------------------- */

    const completedTasks =
        tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    const completedElement =
        document.getElementById(
            "completedTaskCount"
        );


    if (completedElement) {

        completedElement.innerText =
            completedTasks;

    }


    /* -------------------------
       Overall Progress
    ------------------------- */

    const totalTasks =
        tasks.length;


    let progress = 0;


    if (totalTasks > 0) {

        progress =
            Math.round(
                (completedTasks / totalTasks)
                * 100
            );

    }


    const progressText =
        document.getElementById(
            "overallProgressText"
        );


    const progressBar =
        document.getElementById(
            "overallProgressBar"
        );


    if (progressText) {

        progressText.innerText =
            progress + "%";

    }


    if (progressBar) {

        progressBar.style.width =
            progress + "%";


        progressBar.innerText =
            progress + "%";

    }


    /* -------------------------
       Dashboard Task List
    ------------------------- */

    displayDashboardTasks();

}


/* =========================================
   DASHBOARD TASK LIST
========================================= */

function displayDashboardTasks() {

    const dashboardList =
        document.getElementById(
            "dashboardTaskList"
        );


    if (!dashboardList) {

        return;

    }


    const tasks =
        getTasks();


    dashboardList.innerHTML = "";


    if (tasks.length === 0) {

        dashboardList.innerHTML = `

            <p class="text-muted">

                No tasks available.

            </p>

        `;

        return;

    }


    /*
        Show maximum 5 tasks
        on dashboard.
    */

    const displayList =
        tasks.slice(0, 5);


    displayList.forEach(
        function (task) {


            let badgeClass;


            if (task.completed) {

                badgeClass = "bg-success";

            }

            else if (task.priority === "High") {

                badgeClass = "bg-danger";

            }

            else if (task.priority === "Medium") {

                badgeClass =
                    "bg-warning text-dark";

            }

            else {

                badgeClass = "bg-success";

            }


            const taskItem =
                document.createElement(
                    "div"
                );


            taskItem.className =
                "list-group-item d-flex justify-content-between align-items-center";


            taskItem.innerHTML = `

                <div>

                    <strong>
                        ${task.name}
                    </strong>

                    <br>

                    <small class="text-muted">

                        ${task.subject}

                        &nbsp; | &nbsp;

                        Due: ${task.deadline}

                    </small>

                </div>


                <span
                    class="badge ${badgeClass}">

                    ${
                        task.completed
                        ? "Completed"
                        : task.priority
                    }

                </span>

            `;


            dashboardList.appendChild(
                taskItem
            );

        }
    );

}


/* =========================================
   SUBJECT DETAILS MODAL
========================================= */

function showSubject(
    name,
    progress,
    taskCount,
    exam
) {


    const subjectName =
        document.getElementById(
            "modalSubjectName"
        );


    if (!subjectName) {

        return;

    }


    const modalProgress =
        document.getElementById(
            "modalProgress"
        );


    const modalTasks =
        document.getElementById(
            "modalTasks"
        );


    const modalExam =
        document.getElementById(
            "modalExam"
        );


    const progressBar =
        document.getElementById(
            "modalProgressBar"
        );


    subjectName.innerText =
        name;


    modalProgress.innerText =
        progress;


    modalTasks.innerText =
        taskCount;


    modalExam.innerText =
        exam;


    progressBar.style.width =
        progress;


    progressBar.innerText =
        progress;


    const modalElement =
        document.getElementById(
            "subjectModal"
        );


    const modal =
        new bootstrap.Modal(
            modalElement
        );


    modal.show();

}


/* Make available to HTML */

window.showSubject =
    showSubject;


/* =========================================
   EXAM COUNTDOWN
========================================= */

function startCountdown(
    examDate,
    prefix
) {


    function updateCountdown() {


        const now =
            new Date().getTime();


        const examTime =
            new Date(
                examDate
            ).getTime();


        const distance =
            examTime - now;


        const daysElement =
            document.getElementById(
                prefix + "-days"
            );


        /*
            If this countdown isn't
            present on current page,
            stop.
        */

        if (!daysElement) {

            return;

        }


        if (distance <= 0) {

            document.getElementById(
                prefix + "-days"
            ).innerText = "00";


            document.getElementById(
                prefix + "-hours"
            ).innerText = "00";


            document.getElementById(
                prefix + "-minutes"
            ).innerText = "00";


            document.getElementById(
                prefix + "-seconds"
            ).innerText = "00";


            return;

        }


        const days =
            Math.floor(
                distance /
                (1000 * 60 * 60 * 24)
            );


        const hours =
            Math.floor(
                (distance %
                    (1000 * 60 * 60 * 24))
                /
                (1000 * 60 * 60)
            );


        const minutes =
            Math.floor(
                (distance %
                    (1000 * 60 * 60))
                /
                (1000 * 60)
            );


        const seconds =
            Math.floor(
                (distance %
                    (1000 * 60))
                /
                1000
            );


        document.getElementById(
            prefix + "-days"
        ).innerText =
            String(days).padStart(
                2,
                "0"
            );


        document.getElementById(
            prefix + "-hours"
        ).innerText =
            String(hours).padStart(
                2,
                "0"
            );


        document.getElementById(
            prefix + "-minutes"
        ).innerText =
            String(minutes).padStart(
                2,
                "0"
            );


        document.getElementById(
            prefix + "-seconds"
        ).innerText =
            String(seconds).padStart(
                2,
                "0"
            );

    }


    updateCountdown();


    setInterval(
        updateCountdown,
        1000
    );

}


/* =========================================
   DASHBOARD EXAM DAYS
========================================= */

function updateExamDays() {


    const element =
        document.getElementById(
            "dashboardExamDays"
        );


    if (!element) {

        return;

    }


    const examDate =
        new Date(
            "August 25, 2026 10:00:00"
        );


    const now =
        new Date();


    const difference =
        examDate - now;


    if (difference <= 0) {

        element.innerText =
            "Today";

        return;

    }


    const days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    element.innerText =
        days;

}


/* =========================================
   INITIALIZE APPLICATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* Dark mode */

        loadDarkMode();


        /* Task form */

        setupTaskForm();


        /* Display tasks */

        displayTasks();


        /* Dashboard */

        updateDashboard();


        /* Exam countdown */

        startCountdown(
            "August 25, 2026 10:00:00",
            "dsa"
        );


        startCountdown(
            "August 28, 2026 14:00:00",
            "dbms"
        );


        /* Dashboard exam */

        updateExamDays();

    }
);