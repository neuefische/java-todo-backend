import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";


export type Todo = {
    id: string;
    description: string;
    status: "OPEN" | "IN_PROGRESS" | "DONE";
};

export default function Home(){

    const [todos, setTodos] = useState<Todo[]>([]);
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<"OPEN" | "IN_PROGRESS" | "DONE">("OPEN");


    useEffect(() => {
        console.log("loaded all todos")
        loadAllTodos()
    }, [])

    const loadAllTodos = () => {
        axios.get("/api/todo")
            .then((response) =>{
                setTodos(response.data)
            })
            .catch((error) => {
                console.error("Error loading todos", error)
            })
    }

   const createNewTodo = () => {
       const newTodo = { description, status };
       axios
           .post("/api/todo", newTodo)
           .then((response) => {
               setTodos((prevTodos) => [...prevTodos, response.data]);
               setDescription(""); // Reset the input field
           })
           .catch((error) => {
               console.error("Error creating todo", error);
           });
   }

    const deleteTodo = (id: string) => {
        axios
            .delete(`/api/todo/${id}`)
            .then(() => {
                setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
            })
            .catch((error) => {
                console.error("Error deleting todo", error);
            });
    }

    const updateStatus = (id: string, newStatus: "OPEN" | "IN_PROGRESS" | "DONE") => {
        const updatedTodo = todos.find((todo) => todo.id === id);
        if (!updatedTodo) return;

        const todoToUpdate = {
            ...updatedTodo,
            status: newStatus
        };

        axios
            .put(`/api/todo/${id}/update`, todoToUpdate)  // Make sure to match the correct URL
            .then((response) => {
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo.id === id ? { ...todo, status: newStatus } : todo
                    )
                );
            })
            .catch((error) => {
                console.error("Error updating todo", error);
            });
    };


    return(
        <>
            <h1>Home</h1>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <strong>{todo.description}</strong> - {todo.status}
                        <Link to={`/todo/${todo.id}`}>
                            <button>Details</button>
                        </Link>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                        <select
                            value={todo.status}
                            onChange={(e) => updateStatus(todo.id, e.target.value as "OPEN" | "IN_PROGRESS" | "DONE")}
                        >
                            <option value="OPEN">OPEN</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="DONE">DONE</option>
                        </select>
                    </li>
                ))}
            </ul>


            <div>
                <h2>Add New Todo</h2>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
                <select value={status} onChange={(e) => setStatus(e.target.value as "OPEN" | "IN_PROGRESS" | "DONE")}>
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                </select>
                <button onClick={createNewTodo}>Create Todo</button>
            </div>

        </>
    );
}

