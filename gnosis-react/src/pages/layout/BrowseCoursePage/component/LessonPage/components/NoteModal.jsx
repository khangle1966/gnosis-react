import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import style của quill
import 'bootstrap/dist/css/bootstrap.min.css';

import { useDispatch } from 'react-redux';
import { addNote } from '../../../../../../redux/action/noteActions';


const NoteModal = ({ show, handleClose, handleSave, initialNote, userId, lessonId, chapterId, courseId,durationlesson,Titlelesson }) => {
    const [note, setNote] = useState(initialNote || '');  // Ensure initialNote is not undefined
    const dispatch = useDispatch();

    const handleNoteChange = (value) => {
        setNote(value);
    };

    const saveNote = () => {
        // Prepare note data
        const noteData = {
            userUid: userId,
            lessonId: lessonId,
            chapterId: chapterId,
            courseId:courseId,
            notes: note,
            duration: durationlesson ,// You will need to replace this with actual duration if applicable
            lessonTitle : Titlelesson
        };

        dispatch(addNote(noteData));
        handleClose();  // Close modal after save
    };
    const formatTime = (time) => {
        const floorTime = Math.floor(time);
        const hours = Math.floor(floorTime / 3600);
        const minutes = Math.floor((floorTime % 3600) / 60);
        const seconds = Math.floor(floorTime % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Thêm ghi chú tại {formatTime(durationlesson)}</Modal.Title> {/* Consider making the time dynamic if needed */}
            </Modal.Header>
            <Modal.Body>
                <ReactQuill value={note} onChange={handleNoteChange} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy bỏ
                </Button>
                <Button variant="primary" onClick={saveNote}>
                    Lưu ghi chú
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NoteModal;
