import React, {useState} from 'react';
import {doc, setDoc} from "firebase/firestore";
import {db, storage} from "../../firebase";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import './AddModal.css'
import dayjs from "dayjs";

/**
 * Компонент отвечает за рендеринг модального окна для добавления задач.
 * @param setOpenModal
 * @returns {JSX.Element}
 * @constructor
 */
export function AddModal({setOpenModal}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')
    const [file, setFile] = useState('')
    const [progress, setProgress] = useState([])
    const [modal, setModal] = useState(false)

    /**
     * Метод отвечает за отображение и скрытие модального окна.
     */
    function toggleModal() {
        setModal(!modal)
    }

    /**
     * Метод отвечает за отправку данных.
     * Создается ссылка на полный путь к файлу, метод uploadBytesResumable проводит загрузку файла
     * в случае появления ошибки она выводится в консоль.
     * При завершении загрузки файла, будет получена ссылка на файл.
     * Как только промис вернул ссылку, будет создан запрос на создание записи в firestore.
     * В качестве id записи будет использован заголовок задачи.
     * Как только запись будет добавлена страница будет перезагружена.
     * @returns {Promise<void>}
     */
    async function uploadData() {
        const fileRef = ref(storage, `files/${file.name}`)
        const uploadFile = uploadBytesResumable(fileRef, file)

        uploadFile.on('state_changed', (snapshot) => {
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setProgress(prog)
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadFile.snapshot.ref)
                    .then(url => {
                        setDoc(doc(db, "tasks", title), {
                            title: title,
                            description: description,
                            deadline: deadline,
                            file: url,
                            complete: false
                        })
                            .then(() => window.location.reload())
                    })
            })
    }

    /**
     * В константу записывается текущая дата в формате год-месяц-день
     * @type {string}
     */
    const now = dayjs(new Date()).format('YYYY-MM-DD')
    return (
        <>
            <button onClick={toggleModal} className={'open-modal'}>Создать задачу</button>

            {modal &&
                <div className="modal">
                    <div className="overlay"></div>
                    <div className="modal-content">
                        <div className="form">
                            <h1>Создать задачу</h1>
                            <div className="group">
                                <label htmlFor="title" className="input-label">Заголовок</label>
                                <input type="text" className="field" id={'title'} required placeholder={'Тестовый заголовок'} value={title} onChange={(e) => setTitle(e.target.value)}/>
                            </div>
                            <div className="group">
                                <label htmlFor="description" className="input-label">Описание</label>
                                <textarea className="textarea" id={'description'} required placeholder={'Тестовое описание'} onChange={(e) => setDescription(e.target.value)} value={description} rows={4}></textarea>
                            </div>
                            <div className="group">
                                <label htmlFor="deadline" className="input-label">Срок выполнения</label>
                                <input type="date" className="field" id={'deadline'} required value={deadline} onChange={(e) => setDeadline(e.target.value)} min={now}/>
                            </div>
                            <div className="group">
                                <label htmlFor="file" className="input-label">Добавить вложение</label>
                                <input type="file" className="field" id={'file'} onChange={(e) => setFile(e.target.files[0])}/>
                            </div>
                            <div className="btn-container">
                                <button onClick={uploadData}>Создать</button>
                                <button onClick={toggleModal}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}