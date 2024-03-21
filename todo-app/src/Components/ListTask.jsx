import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { MdOutlineSubject } from 'react-icons/md';
import { LuMessageSquare } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoClose } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
export default function ListTask({ tasks, setTasks }) {
    const [todos, setTodos] = useState(tasks.filter((t) => t.status === 'todo'));
    const [inProgress, setInProgress] = useState(tasks.filter((t) => t.status === 'progress'));
    const [done, setDone] = useState(tasks.filter((t) => t.status === 'done'));
    const [review, setReview] = useState(tasks.filter((t) => t.status === 'review'));

    useEffect(() => {
        setTodos(tasks.filter((t) => t.status === 'todo'));
        setInProgress(tasks.filter((t) => t.status === 'progress'));
        setDone(tasks.filter((t) => t.status === 'done'));
        setReview(tasks.filter((t) => t.status === 'review'));
    }, [tasks]);

    const statuses = ['todo', 'progress','review', 'done' ];
    return (
        <div className="flex gap-16 ">
            {statuses.map((status, index) => (
                <Section key={index} status={status} tasks={tasks} setTasks={setTasks} todos={todos} inProgress={inProgress} done={done} review={review} />
            ))}
        </div>
    );
}

function Section({ status, tasks, setTasks, todos, inProgress, done, review }) {
    const text = status === 'todo' ? 'To Do' : status === 'progress' ? 'In Progress' : status === 'done' ? 'Done' : 'Review';
    const tasksToMap = status === 'todo' ? todos : status === 'progress' ? inProgress : status === 'done' ? done : review;
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'task',
        drop: (item) => {
            setTasks((prev) => {
                const list = prev.map((task) => {
                    if (task.id === item.id) {
                        return { ...task, status };
                    }
                    return task;
                });
                localStorage.setItem('tasks', JSON.stringify(list));
                return list;
            });
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    }));

    const [showPopup, setShowPopup] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');

    const getRandomColor = () => {
        const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleAddTask = () => {
        if (!newTaskName) return;

        const newTask = {
            id: tasks.length + 1,
            name: newTaskName,
            status: status,
            backgroundColor: getRandomColor()
        };

        setTasks([...tasks, newTask]);
        setNewTaskName('');
        setShowPopup(false);
    };

    return (
        <div>
            <div ref={drop} style={{backgroundColor:"lightgray",width:"300px",paddingTop:"20px",paddingBottom:"20px",borderRadius:"8px"}} >
                <Header text={text} count={tasksToMap.length} />
                {tasksToMap.map((task, index) => (
                    <Task key={index} task={task} tasks={tasks} setTasks={setTasks} />
                ))}
               <a className="ancher" onClick={() => setShowPopup(true)}> + Add a Card</a>
            </div>
            
            {showPopup && (
                 <div className="popup-overlay">
                 <div className="popup">
                   <span className="close" onClick={() => setShowPopup(false)}><IoClose /></span>
                   <h3>Add Task</h3>
                   <input type="text" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} placeholder="Task Name" />
                   <button onClick={handleAddTask}> Add Task</button>
                 </div>
               </div>
            )}
        </div>
    );
}

function Header({ text, count }) {
    return (
        <div className="header">
            <div className='text1'>{text}</div>
            <BsThreeDots className='icon4' />
        </div>
    );
}

function Task({ task, tasks, setTasks }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'task',
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return (
        <div ref={drag} style={{ borderRadius: '8px', backgroundColor: 'white', marginBottom: '8px', width:"250px", marginLeft:"9px" }} className={
            `relative items-center bg-white-300 p-4 mt-8 shadow-md rounded-lg cursor-grab ${isDragging ? 'opacity-50' : 'opacity-100'}`
        }>
            <div className="inner" style={{ backgroundColor: task.backgroundColor }}></div>
            <p className="textname">{task.name}</p>
            <div className="icondiv">
                <MdOutlineSubject className='one' />
                <LuMessageSquare className='two' />
            </div>
        </div>
    );
}

