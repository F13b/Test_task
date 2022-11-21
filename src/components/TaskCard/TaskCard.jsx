import React from 'react';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import {db} from "../../firebase";
import dayjs from "dayjs";
import './TaskCard.css'
import {EditModal} from "../EditModal/EditModal";

/**
 * Компонент рендерит карточку задачи с информацие о задаче, а также кнопки для взаимодействия
 * с задачей - удалить, редактировать или отметить задачу как выполненную.
 * Если задача выполнена - карточка будет окрашена в зеленый цвет, если задача просрочена - карточка будет окрашена в красный
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function TaskCard(props) {
    /**
     * Метод удаляет запись по id, который принимает в себя метод
     * как только будет возвращен ответ, страница будет перезагружена
     * @param id
     * @returns {Promise<void>}
     */
    async function deleteTask(id) {
        await deleteDoc(doc(db, "tasks", id)).then(() => window.location.reload())
    }

    /**
     * Метод устанавливает параметр complete задачи в положение true, тогда задача будет считаться выполненной
     * а при выводе карточек задач, выполненные будут окращены в зеленый
     * после того как параметр будет изменен страница будет перезагружена
     * @param id
     * @returns {Promise<void>}
     */
    async function completeTask(id) {
        const taskRef = doc(db, "tasks", id);
        await updateDoc(taskRef, {
            complete: true
        })
        .then(() => window.location.reload())
    }

    /**
     * В константу записывается текущая дата в формате год-месяц-день
     * @type {string}
     */
    const now = dayjs(new Date()).format('YYYY-MM-DD')
    return (
        <div className={`card ${props.complete ? 'complete' : ''} ${props.deadline < now ? 'overdue' : ''}`}>
            <div className="card-header">
                <h5 className="task-title">{props.title}</h5>
            </div>
            <div className="card-body">
                <div className="container">
                    <p className="description-title">Описание: </p>
                    <p className="description">{props.description}</p>
                </div>
                <p className="deadline">Срок выполенения: {dayjs(props.deadline).format('DD.MM.YYYY')}</p>
                <div className="container">
                    <p className="file-title">Вложения</p>
                    <a href={props.file} className="task-file" download>Вложение</a>
                </div>
            </div>
            <div className="card-footer">
                <EditModal {...props}/>
                <button className="complete-btn" onClick={() => completeTask(props.title)}>Отметить как выполненное</button>
                <button className="delete-btn" onClick={() => deleteTask(props.taskId)}>Удалить</button>
            </div>

        </div>
    );
}