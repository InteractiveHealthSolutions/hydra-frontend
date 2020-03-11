import React from 'react'
import Modal from 'react-bootstrap/Modal';

export const ModalTemplate = ({ modalSize, title, openModal, closeModal, children }) => (
    <Modal
        size={modalSize}
        show={openModal}
        onHide={closeModal}
        style={{ marginTop: '100%' }}
    >
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: 'auto' }} >
            {children}
        </Modal.Body>
    </Modal>
)

