import React, {useEffect, useState} from 'react'
import {db} from "../../firebase"
import {collection, getDocs} from 'firebase/firestore'
import {TaskCard} from "../TaskCard/TaskCard";
import {AddModal} from "../AddModal/AddModal";
import './Page.css'

/**
 * Комопнент является главной страницей, на которой рендерятся карточки задач.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function Page(props) {
    /**
     * Константа в которой хранится ссылка на коллекцию задач.
     * @type {CollectionReference<DocumentData>}
     */
    const tasksCollectionRef = collection(db, 'tasks')
    const [tasks, setTasks] = useState([])
    useEffect(() => {
        getData();
    }, [])

    /**
     * Метод получает документы с задачами из базы данных и устанавливает массив с данными в состояние.
     * @returns {Promise<void>}
     */
    async function getData() {
        const data = await getDocs(tasksCollectionRef)
        setTasks(data.docs.map((doc) => ({...doc.data(), taskId: doc.id})))
    }
    return (
        <main className={'wrapper'}>
            <AddModal/>
            <div className="tasks">
                {tasks.map(task => <TaskCard key={task.taskId} {...task}/>)}
            </div>
        </main>
    )
}