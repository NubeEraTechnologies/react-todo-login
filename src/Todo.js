import React, { useEffect, useState } from "react";

function Todo() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/todos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Your Todos</h2>
      <ul>
        {todos.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
