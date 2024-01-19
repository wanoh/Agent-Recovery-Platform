import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const ExpirationTimeModal = ({
  show,
  setShow,
  countDown,
  handleExtendExpirationTime,
}) => {
  const handleCancel = () => {
    setShow(!show)
    handleExtendExpirationTime()
  }
  return (
    <div className='vertically-centered-modal'>
      <Modal
        isOpen={show}
        // toggle={() => setShow(!show)}
        className='modal-dialog-centered'
      >
        <ModalHeader>Revive Assets</ModalHeader>
        <ModalBody>Page expires in {countDown}</ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={handleCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ExpirationTimeModal
