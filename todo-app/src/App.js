import { useState, useEffect } from 'react';

import ListTask from './Components/ListTask';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import "./App.css";
function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem('tasks')) || []);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      
      <div className='container' style={{width:"95vw"}}>
       
        <ListTask tasks={tasks} setTasks={setTasks} />
      </div>
      
    </DndProvider>
  );
}

export default App;
