import React from 'react'
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmation = ({ showModal, confirmModal, hideModal, message }) => {
  const handleClose = () => hideModal();
  const aa = String.fromCharCode(228);

  return (
    <Modal show={showModal}
      onHide={handleClose}
      centered
      style={{ opacity: 1, paddingTop: '200px' }}
      size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{'Bekr' + aa + 'fta borttagning'}</Modal.Title>
      </Modal.Header>
      <Modal.Body><div className="alert alert-danger">{message}</div></Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={handleClose}>
          Cancel
          </Button>
        <Button variant="danger" onClick={() => { confirmModal() }}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteConfirmation;

