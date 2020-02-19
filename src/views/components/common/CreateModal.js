
import React, { useState, useCallback } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function CreateModal({ handleSubmit, selectTxt, addText, toAdd, handleChange }) {

    const [isModalOpen, closeModal] = useState(false);
    useCallback(
        (e) => {
            e.preventDefault();
        },
        [],
    );
    const handleClose = () => closeModal({isModalOpen:false});

    return (
        <>
            <Modal show={isModalOpen} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}
