import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { Layout } from './components/common/Layout'
import { Questions } from './pages/Questions'
import { Calendar } from './pages/Calendar'
import { JournalEntry } from './pages/JournalEntry'
import { Reflections } from './pages/Reflections'


// Routing einstellungen
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
        <Routes>
            <Route path='/' element={<Layout/>}>
            <Route index element={<Calendar />} /> 
            <Route path='/reflections' element={<Reflections/>} />
            <Route path='/questions' element={<Questions/>} />
            <Route path="/journalEntry" element={<JournalEntry />} />
          </Route>
        </Routes>
      </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
