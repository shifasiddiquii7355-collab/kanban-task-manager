import { useState, useEffect } from "react";
import Column from "./Component/Column";
import TaskCard from "./Component/TaskCard";
import "./App.css";
import { DndContext } from "@dnd-kit/core";

function App() {
  const [task, setTask] = useState("");

  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || [],
  );
  const [inProgress, setInProgress] = useState(
    JSON.parse(localStorage.getItem("progressTasks")) || [],
  );
  const [done, setDone] = useState(
    JSON.parse(localStorage.getItem("doneTasks")) || [],
  );
  const [darkMode, setDarkMode] = useState(true);
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("progressTasks", JSON.stringify(inProgress));
    localStorage.setItem("doneTasks", JSON.stringify(done));
  }, [tasks, inProgress, done]);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const destination = over.id;

    let movedTask = null;

    // Remove from To Do
    const updatedTasks = tasks.filter((task) => {
      if (task.id === taskId) {
        movedTask = task;
        return false;
      }
      return true;
    });

    // Remove from In Progress
    const updatedProgress = inProgress.filter((task) => {
      if (task.id === taskId) {
        movedTask = task;
        return false;
      }
      return true;
    });

    // Remove from Done
    const updatedDone = done.filter((task) => {
      if (task.id === taskId) {
        movedTask = task;
        return false;
      }
      return true;
    });

    if (!movedTask) return;

    // Drop into correct column
    if (destination === "To do Task") {
      setTasks([...updatedTasks, movedTask]);
      setInProgress(updatedProgress);
      setDone(updatedDone);
    } else if (destination === "In Progress") {
      setTasks(updatedTasks);
      setInProgress([...updatedProgress, movedTask]);
      setDone(updatedDone);
    } else if (destination === "Completed") {
      setTasks(updatedTasks);
      setInProgress(updatedProgress);
      setDone([...updatedDone, movedTask]);
    }
  }

  function taskDone(doneTask) {
    const completedTask = inProgress[doneTask];
    const updatedTask = inProgress.filter((_, index) => index !== doneTask);
    setInProgress(updatedTask);
    setDone([...done, completedTask]);
  }

  function addTask() {
    if (task.trim() === "") return;
    const newTask = {
      id: Date.now().toString(),
      title: task,
      priority,
      dueDate,
    };
    setTasks([...tasks, newTask]);
    setTask("");
    setPriority("Medium");
    setDueDate("");
  }

  function editTask(index) {
    const updatedTask = window.prompt("edit your task", tasks[index].title);
    if (updatedTask === null || updatedTask.trim() === "") return;
    const updatedTasks = [...tasks];
    updatedTasks[index].title = updatedTask;
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const updatedTask = tasks.filter((t) => t.id !== id);
    setTasks(updatedTask);
  }
  function deleteProgress(DValue) {
    const updatedProgress = inProgress.filter((_, index) => index !== DValue);
    setInProgress(updatedProgress);
  }

  function shiftToProgress(index) {
    const moveTask = tasks[index];
    const updatedTask = tasks.filter((_, i) => i !== index);
    setTasks(updatedTask);
    setInProgress([...inProgress, moveTask]);
  }
  function deleteDone(index) {
    const updateDone = done.filter((_, i) => i !== index);
    setDone(updateDone);
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={darkMode ? "App dark" : "App light"}>
        <h1>Task Manager</h1>
        <div className="searchSection">
          <input
            type="text"
            placeholder="Search your task here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></input>
        </div>
        <div className="inputSection">
          <input
            type="text"
            placeholder="Enter Taks...."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <select
            className="cursor"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <input
            className="cursor"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          ></input>

          <button onClick={addTask}>Add</button>
        </div>

        <div className="board">
          <Column title="To do Task">
            {tasks
              .filter((t) =>
                t.title.toLowerCase().includes(search.toLowerCase()),
              )
              .map((t, index) => {
                return (
                  <TaskCard key={t.id} task={t}>
                    <button
                      className="progressBtn"
                      onClick={() => shiftToProgress(index)}
                    >
                      In Progress
                    </button>
                    <button className="editBtn" onClick={() => editTask(index)}>
                      ✏️
                    </button>
                    <button className="delBtn" onClick={() => deleteTask(t.id)}>
                      ❌
                    </button>
                  </TaskCard>
                );
              })}
          </Column>

          <Column title="In Progress">
            {inProgress.map((t, index) => {
              return (
                <TaskCard key={t.id} task={t}>
                  <button
                    className="delBtn"
                    onClick={() => deleteProgress(index)}
                  >
                    ❌
                  </button>
                  <button className="doneBtn" onClick={() => taskDone(index)}>
                    Done
                  </button>
                </TaskCard>
              );
            })}
          </Column>

          <Column title="Completed">
            {done.map((t, index) => {
              return (
                <TaskCard key={t.id} task={t}>
                  <button className="delBtn" onClick={() => deleteDone(index)}>
                    ❌
                  </button>
                </TaskCard>
              );
            })}
          </Column>
        </div>
        <div className="themeSection">
          <button className="themeBtn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </DndContext>
  );
}

export default App;
