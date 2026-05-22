import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      setError("Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }),
    });
    const task = await res.json();
    setTasks([task, ...tasks]);
    setNewTask("");
  };

  const toggleTask = async (id, done) => {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !done }),
    });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const completed = tasks.filter((t) => t.done).length;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📋 DevOps Task Manager</h1>
        <p style={styles.subtitle}>TP DevOps — React + Node.js + PostgreSQL</p>

        <div style={styles.stats}>
          <span>Total: <strong>{tasks.length}</strong></span>
          <span>✅ Done: <strong>{completed}</strong></span>
          <span>⏳ Remaining: <strong>{tasks.length - completed}</strong></span>
        </div>

        <form onSubmit={addTask} style={styles.form}>
          <input
            style={styles.input}
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
          />
          <button type="submit" style={styles.button}>Add</button>
        </form>

        {error && <p style={styles.error}>⚠️ {error}</p>}
        {loading ? (
          <p style={styles.loading}>Loading tasks...</p>
        ) : (
          <ul style={styles.list}>
            {tasks.length === 0 && (
              <li style={styles.empty}>No tasks yet. Add one above!</li>
            )}
            {tasks.map((task) => (
              <li key={task.id} style={styles.item}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id, task.done)}
                  style={styles.checkbox}
                />
                <span style={{ ...styles.taskText, textDecoration: task.done ? "line-through" : "none", opacity: task.done ? 0.5 : 1 }}>
                  {task.title}
                </span>
                <button onClick={() => deleteTask(task.id)} style={styles.deleteBtn}>🗑</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" },
  card: { background: "white", borderRadius: 12, padding: 32, width: "100%", maxWidth: 520, boxShadow: "0 4px 24px rgba(0,0,0,0.1)" },
  title: { margin: 0, fontSize: 24, color: "#1a202c" },
  subtitle: { color: "#718096", fontSize: 13, marginBottom: 20 },
  stats: { display: "flex", gap: 16, background: "#f7fafc", padding: "10px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14, color: "#4a5568" },
  form: { display: "flex", gap: 8, marginBottom: 20 },
  input: { flex: 1, padding: "10px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none" },
  button: { padding: "10px 20px", background: "#4299e1", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 },
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: { display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: "1px solid #f0f0f0" },
  checkbox: { width: 18, height: 18, cursor: "pointer" },
  taskText: { flex: 1, fontSize: 14, color: "#2d3748" },
  deleteBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: 0.5 },
  error: { color: "#e53e3e", background: "#fff5f5", padding: 10, borderRadius: 6, fontSize: 13 },
  loading: { color: "#718096", textAlign: "center", padding: 20 },
  empty: { color: "#a0aec0", textAlign: "center", padding: 20, listStyle: "none" },
};
