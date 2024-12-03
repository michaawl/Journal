import { ToDoForm } from "../components/forms/ToDoForm";
import React, { useEffect, useState } from 'react';
import ITask from '../interfaces/ITask';
import axios from 'axios';
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 

export const Work: React.FC = () => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
    const handleAddTask = (description: string) => {
      if (description.trim() && selectedDate) {
        const newTask = {
          id: tasks.length + 1, 
          description: description.trim(),
          date: selectedDate.toLocaleDateString(), 
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setSelectedDate(new Date()); 
      }
    };
  
    return (
      <div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.description} ( {task.date} )
          </li>
        ))}
      </ul>
      <div style={{ marginBottom: "1rem" }}>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/mm/yyyy"
        />
      </div>
      <ToDoForm onAddTask={handleAddTask} />
    </div>
    );
  };
