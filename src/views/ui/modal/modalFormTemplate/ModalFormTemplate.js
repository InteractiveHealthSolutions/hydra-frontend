import React, { useState, useEffect, useCallback, Children } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

export const ModalFormTemplate = ({
    openVoidModal,
    closeVoidModal,
    handleVoidSubmit,
    title,
    children,
    ...rest
}) => (
        <Modal
            show={openVoidModal}
            onHide={closeVoidModal}
            style={{ marginTop: '100px' }}
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleVoidSubmit}>
                <Modal.Body>
                    {children}
                </Modal.Body>
                <Modal.Footer>
                    <Button type='submit' variant='primary'>Save</Button>
                </Modal.Footer>
            </form>
        </Modal>
    )

