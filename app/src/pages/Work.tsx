import React from "react"
import { ToDoForm } from "../components/forms/ToDoForm";

export const Work:React.FC = () => {

    const electron = (window as any).electron;

    return (
        <div>
            This is work page content <br/> 
            Home Directory: {electron.homeDir()} <br/>
            OS Version: {electron.osVersion()} <br/>
            Arch: {electron.arch()} <br/>

            <ToDoForm />
        </div>
    );
};

