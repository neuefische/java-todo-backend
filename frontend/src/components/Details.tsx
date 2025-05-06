import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Todo} from "./Home.tsx"



export default function Details() {
    const { id } = useParams<{ id: string }>(); // Hole die id aus der URL
    const [todo, setTodo] = useState<Todo | null>(null);

    useEffect(() => {
        if (id) {
            axios
                .get(`/api/todo/${id}`)
                .then((response) => {
                    setTodo(response.data);
                })
                .catch((error) => {
                    console.error("Error loading todo details", error);
                });
        }
    }, [id]);

    if (!todo) return <p>Loading...</p>;

    return (
        <div>
            <h1>Details</h1>
            <p><strong>Description:</strong> {todo.description}</p>
            <p><strong>Status:</strong> {todo.status}</p>
            <Link to={"/"}><button>Back</button></Link>
        </div>
    );
}