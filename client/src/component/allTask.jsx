import React, { useState, useEffect } from "react";

function AllTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/v1/fetchAllTask", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
            longtermtoken: localStorage.getItem("longTermToken"),
          },
        });
        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleMenu = (taskId) => {
    setActiveMenu((prev) => (prev === taskId ? null : taskId));
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/updateTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
          longtermtoken: localStorage.getItem("longTermToken"),
        },
        body: JSON.stringify({ taskId, status: newStatus }),
      });

      if (response.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
        setActiveMenu(null);
     
      } else {
        console.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch("http://localhost:4000/api/v1/deleteTask", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
            longtermtoken: localStorage.getItem("longTermToken"),
          },
          body: JSON.stringify({ taskId }),
        });

        if (response.ok) {
          setTasks((prev) => prev.filter((task) => task.id !== taskId));
        } else {
          console.error("Failed to delete task");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };
  console.log(tasks)
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">All Tasks</h2>
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : tasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border relative rounded-lg shadow-md bg-white"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{task.title}</h3>
                  <div className="relative z-50" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleMenu(task.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    {activeMenu === task.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                        <div className="py-1">
                          <button
                            onClick={() => updateTaskStatus(task.id, "PENDING")}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Mark as Pending
                          </button>
                          <button
                            onClick={() => updateTaskStatus(task.id, "IN_PROGRESS")}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Mark as In Progress
                          </button>
                          <button
                            onClick={() => updateTaskStatus(task.id, "COMPLETED")}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Mark as Completed
                          </button>
                          <div className="border-t border-gray-100"></div>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete Task
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="my-2 text-gray-600">{task.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                  {task.time && (
                    <span className="text-xs text-gray-500">
                      {new Date(task.time).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No tasks available. Create your first task!</p>
        </div>
      )}
    </div>
  );
}

export default AllTask;
