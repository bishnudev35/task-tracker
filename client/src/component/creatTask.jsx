import React from "react";

function CreateTask() {
  const [task, setTask] = React.useState({ title: "", description: "" });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!task.title.trim()) newErrors.title = "Title is required";
    if (!task.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("https://task-tracker-uwol.onrender.com/api/v1/creatTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          longTermToken: `${localStorage.getItem("longTermToken")}`,
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const result = await response.json();
      console.log("Task created:", result);
      setIsSubmitted(true);
      setTask({ title: "", description: "" });
      setErrors({});
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="text-center mb-10 ">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Create a New Task
        </h2>
        <p className="text-gray-500 mt-2">Plan your day, stay productive</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#281f3531] p-8 rounded-2xl  space-y-6"
      >
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={task.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className={`text-white  w-full px-4 py-3 rounded-lg shadow-sm transition border focus:outline-none focus:ring-2
              ${errors.title
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
              }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Task Description
          </label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Describe your task..."
            rows="4"
            className={`text-white w-full px-4 py-3 rounded-lg shadow-sm transition border focus:outline-none focus:ring-2
              ${errors.description
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
              }`}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-200
            ${loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Creating...
            </div>
          ) : (
            "Create Task"
          )}
        </button>

        {/* Success Message */}
        {isSubmitted && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mt-4">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 10-1.4-1.4L9 10.6 7.7 9.3a1 1 0 10-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Task created successfully!</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateTask;
