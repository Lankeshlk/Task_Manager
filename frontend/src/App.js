import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8800/tasks";

const Add = ({ fetchTasks }) => {
  const [task, settask] = useState({
    title: "",
    description: "",
    status: "pending",
    date: "",
  });
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue =
      type === "checkbox" ? (checked ? "completed" : "pending") : value;
    settask((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, task);
      settask({ title: "", description: "", status: "pending", date: "" });
      fetchTasks();
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="">
      <h2 className="text-xl text-blue-600 font-bold">Add New Task</h2>
      <div className="form">
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={task.title}
          onChange={handleChange}
          className="w-full text-2xl p-2 border rounded mb-2"
          required
        />
        <textarea
          rows={3}
          type="text"
          placeholder="Description"
          name="description"
          value={task.description}
          onChange={handleChange}
          className="w-full p-2 border text-xl rounded mb-2"
        />

        <input
          type="date"
          name="date"
          value={task.date}
          onChange={handleChange}
          className="w-full p-2 border text-lg rounded mb-2"
        />
        <button
          onClick={handleClick}
          className={`bg-[#0096FF] text-white px-4 py-2 rounded ${
            !task.title ? "cursor-not-allowed" : ""
          }`}
          disabled={!task.title}
        >
          Add Task
        </button>
        {error && <p className="text-red-500 mt-2">Something went wrong</p>}
      </div>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({
    id: "",
    title: "",
    description: "",
    status: "pending",
    date: "",
  });
  const [error, setError] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const openEditModal = (task) => {
    const formattedDate = task.date
      ? new Date(
          new Date(task.date).getTime() -
            new Date(task.date).getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0]
      : "";

    setUpdatedTask({
      ...task,
      date: formattedDate,
    });

    setModalVisible(true);
  };

  const closeEditModal = () => {
    setModalVisible(false);
    setUpdatedTask({
      id: "",
      title: "",
      description: "",
      status: "pending",
      date: "",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue =
      type === "checkbox" ? (checked ? "completed" : "pending") : value;
    setUpdatedTask((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/${updatedTask.id}`, updatedTask);
      fetchTasks();
      closeEditModal();
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="p-8 bg-gray-100  min-h-screen">
      <h1 className="text-3xl text-blue-600 font-bold text-center mb-8">
        Task Manager
      </h1>
      <div className="flex flex-row gap-8">
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl bg-transparent flex text-blue-600 font-semibold mb-4">
            Task List
          </h2>
          {tasks.map((task) => (
            <div
              className="task bg-blue-50 rounded-lg border-blue-200  mb-4"
              key={task.id}
            >
              <div className="task bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-md mb-4 flex items-center justify-between">
                <div>
                  <h3 className=" font-bold mb-2 text-2xl text-blue-700 underline">
                    {task.title}
                  </h3>
                  <p className="text-gray-700 text-xl mb-2">{task.description}</p>
                  <p
                    className={`text-lg ${
                      task.status === "completed"
                        ? "text-green-600"
                        : "text-blue-600"
                    } mb-2`}
                  >
                    Status: {task.status}
                  </p>
                  {task.date && !isNaN(new Date(task.date).getTime()) && (
                    <p className="mb-2 text-lg">
                      Date: {new Date(task.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 self-end">
                  <button
                    className="p-1 rounded-lg hover:shadow-lg text-white"
                    onClick={() => handleDelete(task.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="30"
                      height="30"
                      viewBox="0 0 80 80"
                    >
                      <path d="M 37 6 C 35.35503 6 34 7.3550302 34 9 L 34 10 L 24.472656 10 C 22.580979 10 20.84645 11.07202 20 12.763672 L 18.882812 15 L 15.5 15 C 13.578812 15 12 16.578812 12 18.5 C 12 20.421188 13.578812 22 15.5 22 L 16.080078 22 L 19.697266 65.416016 C 19.912759 67.998204 22.089668 70 24.681641 70 L 55.320312 70 C 57.91153 70 60.087241 67.998204 60.302734 65.416016 L 63.919922 22 L 64.5 22 C 66.421188 22 68 20.421188 68 18.5 C 68 16.578812 66.421188 15 64.5 15 L 61.117188 15 L 60 12.763672 C 59.15355 11.07202 57.419021 10 55.527344 10 L 46 10 L 46 9 C 46 7.3550302 44.64497 6 43 6 L 37 6 z M 37 8 L 43 8 C 43.56503 8 44 8.4349698 44 9 L 44 10 L 36 10 L 36 9 C 36 8.4349698 36.43497 8 37 8 z M 24.472656 12 L 34.832031 12 A 1.0001 1.0001 0 0 0 35.158203 12 L 44.832031 12 A 1.0001 1.0001 0 0 0 45.158203 12 L 55.527344 12 C 56.665666 12 57.701388 12.639855 58.210938 13.658203 L 59.882812 17 L 64.5 17 C 65.340812 17 66 17.659188 66 18.5 C 66 19.340812 65.340812 20 64.5 20 L 64.085938 20 L 15.914062 20 L 15.5 20 C 14.659188 20 14 19.340812 14 18.5 C 14 17.659188 14.659188 17 15.5 17 L 20.117188 17 L 21.789062 13.658203 C 22.298613 12.639855 23.334334 12 24.472656 12 z M 24 15 A 1 1 0 0 0 23 16 A 1 1 0 0 0 24 17 A 1 1 0 0 0 25 16 A 1 1 0 0 0 24 15 z M 28 15 A 1 1 0 0 0 27 16 A 1 1 0 0 0 28 17 A 1 1 0 0 0 29 16 A 1 1 0 0 0 28 15 z M 32 15 A 1 1 0 0 0 31 16 A 1 1 0 0 0 32 17 A 1 1 0 0 0 33 16 A 1 1 0 0 0 32 15 z M 36 15 A 1 1 0 0 0 35 16 A 1 1 0 0 0 36 17 A 1 1 0 0 0 37 16 A 1 1 0 0 0 36 15 z M 40 15 A 1 1 0 0 0 39 16 A 1 1 0 0 0 40 17 A 1 1 0 0 0 41 16 A 1 1 0 0 0 40 15 z M 44 15 A 1 1 0 0 0 43 16 A 1 1 0 0 0 44 17 A 1 1 0 0 0 45 16 A 1 1 0 0 0 44 15 z M 48 15 A 1 1 0 0 0 47 16 A 1 1 0 0 0 48 17 A 1 1 0 0 0 49 16 A 1 1 0 0 0 48 15 z M 52 15 A 1 1 0 0 0 51 16 A 1 1 0 0 0 52 17 A 1 1 0 0 0 53 16 A 1 1 0 0 0 52 15 z M 56 15 A 1 1 0 0 0 55 16 A 1 1 0 0 0 56 17 A 1 1 0 0 0 57 16 A 1 1 0 0 0 56 15 z M 18.085938 22 L 61.914062 22 L 58.308594 65.248047 C 58.178088 66.811858 56.889095 68 55.320312 68 L 24.681641 68 C 23.111613 68 21.821912 66.811858 21.691406 65.248047 L 18.085938 22 z M 54.769531 26.027344 L 54.082031 26.603516 L 54.001953 26.945312 L 53.996094 27.044922 L 54.353516 27.867188 L 55.226562 28.072266 L 55.912109 27.496094 L 55.992188 27.154297 L 55.998047 27.054688 L 55.640625 26.232422 L 54.769531 26.027344 z M 39.716797 26.041016 L 39.0625 26.652344 L 39 27 L 39 27.099609 L 39.402344 27.900391 L 40.283203 28.058594 L 40.9375 27.447266 L 41 27.099609 L 41 27 L 40.597656 26.199219 L 39.716797 26.041016 z M 24.666016 26.058594 L 24.044922 26.705078 L 24.001953 27.054688 L 24.007812 27.154297 L 24.451172 27.931641 L 25.339844 28.042969 L 25.960938 27.396484 L 26.003906 27.044922 L 25.998047 26.945312 L 25.554688 26.167969 L 24.666016 26.058594 z M 54.546875 30.121094 L 53.861328 30.697266 L 53.779297 31.041016 L 53.775391 31.140625 L 54.132812 31.960938 L 55.003906 32.166016 L 55.691406 31.591797 L 55.771484 31.248047 L 55.777344 31.148438 L 55.419922 30.326172 L 54.546875 30.121094 z M 39.716797 30.140625 L 39.0625 30.753906 L 39 31.099609 L 39 31.199219 L 39.402344 32.001953 L 40.283203 32.158203 L 40.9375 31.546875 L 41 31.199219 L 41 31.099609 L 40.597656 30.298828 L 39.716797 30.140625 z M 24.886719 30.152344 L 24.265625 30.798828 L 24.222656 31.148438 L 24.228516 31.248047 L 24.671875 32.025391 L 25.560547 32.136719 L 26.181641 31.490234 L 26.224609 31.140625 L 26.220703 31.041016 L 25.775391 30.261719 L 24.886719 30.152344 z M 54.326172 34.214844 L 53.638672 34.791016 L 53.558594 35.134766 L 53.552734 35.234375 L 53.910156 36.054688 L 54.783203 36.261719 L 55.470703 35.685547 L 55.550781 35.341797 L 55.556641 35.242188 L 55.199219 34.419922 L 54.326172 34.214844 z M 39.716797 34.240234 L 39.0625 34.853516 L 39 35.199219 L 39 35.300781 L 39.402344 36.101562 L 40.283203 36.259766 L 40.9375 35.646484 L 41 35.300781 L 41 35.199219 L 40.597656 34.398438 L 39.716797 34.240234 z M 25.107422 34.246094 L 24.488281 34.892578 L 24.443359 35.242188 L 24.449219 35.341797 L 24.892578 36.119141 L 25.783203 36.230469 L 26.402344 35.583984 L 26.447266 35.234375 L 26.441406 35.134766 L 25.996094 34.355469 L 25.107422 34.246094 z M 54.105469 38.308594 L 53.417969 38.884766 L 53.337891 39.228516 L 53.332031 39.328125 L 53.689453 40.150391 L 54.5625 40.355469 L 55.248047 39.779297 L 55.330078 39.435547 L 55.333984 39.335938 L 54.976562 38.513672 L 54.105469 38.308594 z M 25.328125 38.339844 L 24.708984 38.986328 L 24.666016 39.335938 L 24.669922 39.435547 L 25.115234 40.214844 L 26.003906 40.324219 L 26.625 39.677734 L 26.667969 39.328125 L 26.662109 39.228516 L 26.21875 38.449219 L 25.328125 38.339844 z M 39.716797 38.341797 L 39.0625 38.953125 L 39 39.300781 L 39 39.400391 L 39.402344 40.201172 L 40.283203 40.359375 L 40.9375 39.746094 L 41 39.400391 L 41 39.300781 L 40.597656 38.498047 L 39.716797 38.341797 z M 53.882812 42.402344 L 53.197266 42.978516 L 53.117188 43.322266 L 53.111328 43.421875 L 53.46875 44.244141 L 54.339844 44.449219 L 55.027344 43.873047 L 55.107422 43.529297 L 55.113281 43.429688 L 54.755859 42.609375 L 53.882812 42.402344 z M 25.550781 42.433594 L 24.929688 43.080078 L 24.886719 43.429688 L 24.892578 43.529297 L 25.335938 44.308594 L 26.224609 44.417969 L 26.845703 43.771484 L 26.888672 43.421875 L 26.882812 43.322266 L 26.439453 42.542969 L 25.550781 42.433594 z M 39.716797 42.441406 L 39.0625 43.052734 L 39 43.400391 L 39 43.5 L 39.402344 44.300781 L 40.283203 44.458984 L 40.9375 43.847656 L 41 43.5 L 41 43.400391 L 40.597656 42.599609 L 39.716797 42.441406 z M 53.662109 46.498047 L 52.976562 47.072266 L 52.894531 47.416016 L 52.888672 47.515625 L 53.248047 48.337891 L 54.119141 48.542969 L 54.806641 47.966797 L 54.886719 47.623047 L 54.892578 47.523438 L 54.535156 46.703125 L 53.662109 46.498047 z M 25.771484 46.527344 L 25.150391 47.173828 L 25.107422 47.523438 L 25.113281 47.623047 L 25.556641 48.402344 L 26.447266 48.511719 L 27.066406 47.865234 L 27.111328 47.515625 L 27.105469 47.416016 L 26.660156 46.638672 L 25.771484 46.527344 z M 39.716797 46.541016 L 39.0625 47.152344 L 39 47.5 L 39 47.599609 L 39.402344 48.400391 L 40.283203 48.558594 L 40.9375 47.947266 L 41 47.599609 L 41 47.5 L 40.597656 46.699219 L 39.716797 46.541016 z M 53.441406 50.591797 L 52.753906 51.167969 L 52.673828 51.509766 L 52.667969 51.609375 L 53.025391 52.431641 L 53.898438 52.636719 L 54.583984 52.060547 L 54.666016 51.71875 L 54.669922 51.617188 L 54.3125 50.796875 L 53.441406 50.591797 z M 25.992188 50.621094 L 25.373047 51.267578 L 25.330078 51.617188 L 25.333984 51.71875 L 25.779297 52.496094 L 26.667969 52.605469 L 27.289062 51.958984 L 27.332031 51.609375 L 27.326172 51.509766 L 26.882812 50.732422 L 25.992188 50.621094 z M 39.716797 50.640625 L 39.0625 51.253906 L 39 51.599609 L 39 51.699219 L 39.402344 52.501953 L 40.283203 52.658203 L 40.9375 52.046875 L 41 51.699219 L 41 51.599609 L 40.597656 50.798828 L 39.716797 50.640625 z M 53.21875 54.685547 L 52.533203 55.261719 L 52.453125 55.603516 L 52.447266 55.703125 L 52.804688 56.525391 L 53.677734 56.730469 L 54.363281 56.154297 L 54.443359 55.8125 L 54.449219 55.712891 L 54.091797 54.890625 L 53.21875 54.685547 z M 26.214844 54.716797 L 25.59375 55.363281 L 25.550781 55.712891 L 25.556641 55.8125 L 26 56.589844 L 26.888672 56.701172 L 27.509766 56.054688 L 27.552734 55.703125 L 27.546875 55.603516 L 27.103516 54.826172 L 26.214844 54.716797 z M 39.716797 54.740234 L 39.0625 55.353516 L 39 55.699219 L 39 55.800781 L 39.402344 56.601562 L 40.283203 56.759766 L 40.9375 56.146484 L 41 55.800781 L 41 55.699219 L 40.597656 54.898438 L 39.716797 54.740234 z M 52.998047 58.779297 L 52.3125 59.355469 L 52.230469 59.697266 L 52.226562 59.798828 L 52.583984 60.619141 L 53.455078 60.824219 L 54.142578 60.25 L 54.222656 59.90625 L 54.228516 59.806641 L 53.871094 58.984375 L 52.998047 58.779297 z M 26.435547 58.810547 L 25.814453 59.457031 L 25.771484 59.806641 L 25.777344 59.90625 L 26.220703 60.683594 L 27.111328 60.794922 L 27.730469 60.148438 L 27.773438 59.798828 L 27.769531 59.697266 L 27.324219 58.919922 L 26.435547 58.810547 z M 39.716797 58.841797 L 39.0625 59.453125 L 39 59.800781 L 39 59.900391 L 39.402344 60.701172 L 40.283203 60.859375 L 40.9375 60.246094 L 41 59.900391 L 41 59.800781 L 40.597656 58.998047 L 39.716797 58.841797 z M 52.777344 62.873047 L 52.089844 63.449219 L 52.009766 63.792969 L 52.003906 63.892578 L 52.361328 64.712891 L 53.234375 64.919922 L 53.919922 64.34375 L 54.001953 64 L 54.007812 63.900391 L 53.648438 63.078125 L 52.777344 62.873047 z M 26.65625 62.904297 L 26.037109 63.550781 L 25.992188 63.900391 L 25.998047 64 L 26.443359 64.777344 L 27.332031 64.888672 L 27.953125 64.242188 L 27.996094 63.892578 L 27.990234 63.792969 L 27.546875 63.013672 L 26.65625 62.904297 z M 39.716797 62.941406 L 39.0625 63.552734 L 39 63.900391 L 39 64 L 39.402344 64.800781 L 40.283203 64.958984 L 40.9375 64.347656 L 41 64 L 41 63.900391 L 40.597656 63.099609 L 39.716797 62.941406 z"></path>
                    </svg>
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-[#0096FF] hover:shadow-lg text-white"
                    onClick={() => openEditModal(task)}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg h-fit">
          <Add fetchTasks={fetchTasks} />
        </div>
      </div>

      {modalVisible && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="modal bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl text-blue-600 font-semibold mb-4">Edit Task</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={updatedTask.title}
                onChange={handleChange}
                className="w-full p-2 text-gray-700 border rounded mb-2"
              />
              <textarea
                rows={3}
                placeholder="Description"
                name="description"
                value={updatedTask.description}
                onChange={handleChange}
                className="w-full text-gray-700 p-2 border rounded mb-2"
              />
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  name="status"
                  checked={updatedTask.status === "completed"}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700">
                  Status:{" "}
                  {updatedTask.status === "completed" ? "Completed" : "Pending"}
                </span>
              </label>
              <input
                type="date"
                name="date"
                value={updatedTask.date}
                onChange={handleChange}
                className="w-full p-2 border text-gray-700 rounded mb-2"
              />
              <button
                type="submit"
                className="bg-[#0096FF] text-white px-4 py-2 rounded"
              >
                Update Task
              </button>
              {error && (
                <p className="text-red-500 mt-2">Something went wrong!</p>
              )}
            </form>
            <button
              className="mt-2 bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={closeEditModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
