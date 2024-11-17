import { ToDoForm } from "../components/forms/ToDoForm";
import React, { useEffect, useState } from 'react';
import ITask from '../interfaces/ITask';
import axios from 'axios';

export const Work: React.FC = () => {
    const [tasks, setTasks] = useState<ITask[]>([]);
  
    const handleAddTask = (description: string) => {
      if (description.trim()) {
        const newTask = {
          id: tasks.length + 1, // Use a unique ID
          description: description.trim(),
        };
        setTasks((prevTasks) => [...prevTasks, newTask]); // Add to task list
      }
    };
  
    return (
      <div>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.description}</li>
          ))}
        </ul>
        <ToDoForm onAddTask={handleAddTask} />
      </div>
    );
  };
