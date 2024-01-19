// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Reactstrap Imports
import { Modal, ModalHeader, ModalBody, Spinner } from 'reactstrap'

const SpinnerModal = ({ centeredModal }) => {
  return (
    <div className='demo-inline-spacing'>
      <div className='vertically-centered-modal'>
        <Modal isOpen={centeredModal} className='modal-dialog-centered'>
          <ModalHeader>Account SignIn</ModalHeader>
          <ModalBody>
            <Spinner className='me-25 text-center' color='success' size='sm' />
            <span className='ms-50'>Logging In...</span>
          </ModalBody>
        </Modal>
      </div>
    </div>
  )
}
export default SpinnerModal
