import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles for ReactQuill
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styles from "./NoteViewer.module.scss"
import { deleteNote, editNote } from '../../../../../../redux/action/noteActions';
const NoteViewer = ({ show, handleClose, notes, onTimeClick, navigate, playerRef, courseId, setTimeToSeek }) => {
    const dispatch = useDispatch();

    const [editMode, setEditMode] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    const handleDelete = (noteId) => {
        dispatch(deleteNote(noteId));
    };
    const handleEdit = (note) => {
        setEditingNote({ ...note, notes: note.notes });
        setEditMode(true);
    };

    const handleSave = () => {
        dispatch(editNote(editingNote._id, { notes: editingNote.notes }));
        setEditMode(false);
        setEditingNote(null);
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditingNote(null);
    };
    const handleTimeClick = (note) => {
        const currentUrl = `/course/${note.courseId}/lesson/${note.lessonId}`;
        if (window.location.pathname === currentUrl) {
            // If already on the correct lesson page, seek directly
            playerRef.current.seekTo(note.duration);
        } else {
            // Otherwise, navigate and set time to seek
            navigate(currentUrl);
            setTimeToSeek(note.duration); // This will trigger the seek once the player is ready
        }
    };



    const handleNoteChange = (value) => {
        setEditingNote(prev => ({ ...prev, notes: value }));
    };

    const formatTime = (time) => {
        const floorTime = Math.floor(time);
        const hours = Math.floor(floorTime / 3600);
        const minutes = Math.floor((floorTime % 3600) / 60);
        const seconds = Math.floor(floorTime % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Modal className={styles.NoteViewer} show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Ghi chú của tôi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {notes.length > 0 ? (
                    <ul className={styles.ul}>
                        {notes.map((note, index) => (
                            <li className={styles.liItem} key={index}>
                                {editMode && editingNote._id === note._id ? (
                                    <div className={styles.editMode}>

                                        <strong className={styles.time}>Thời gian: {formatTime(note.duration)}</strong>
                                        <ReactQuill theme="snow" value={editingNote.notes} onChange={handleNoteChange} />

                                        <Button className={`${styles.button} btn-primary`} onClick={handleSave}>Save</Button>
                                        <Button className={`${styles.button} btn-secondary`} onClick={handleCancel}>Cancel</Button>
                                    </div>
                                ) : (
                                    <p>
                                        <div className={styles.detail}>
                                            <div className={styles.detaillesson}>
                                                <strong onClick={() => handleTimeClick(note)}>{formatTime(note.duration)} - {note.lessonTitle} - {note.courseTitle} </strong>

                                            </div>
                                            <div className={styles.icon}>
                                                <FontAwesomeIcon icon={faPencilAlt} onClick={() => handleEdit(note)} />
                                                <FontAwesomeIcon icon={faTrashAlt} onClick={() => handleDelete(note._id)} />
                                            </div>
                                        </div>

                                        <span dangerouslySetInnerHTML={{ __html: note.notes }} />

                                    </p>

                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Không có ghi chú nào.</p>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default NoteViewer;
