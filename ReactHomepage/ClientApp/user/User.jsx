import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FormInput from '../common/FormInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { userIsIdentifiedSignal } from '../Frame';
import { useUserContext } from './UserContext';

const User = () => {
  const { state, dispatch, checkPasswordAsync, logOutAsync } = useUserContext();
  const { isIdentified, status } = state;
  const [showModal, setShowModal] = useState(true);
  const [password, setPassword] = useState('');

  const handleClose = () => {
    setShowModal(false);
    setPassword('');
    window.history.back();
  }

  const handlePasswordChanged = (value) => setPassword(value);

  const handleLogInOut = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    try {
      if (isIdentified) {
        const response = await logOutAsync();
        if (['userLoggedOut', 'userAlreadyLoggedOut'].includes(response)) {
          dispatch({ type: 'SET_IS_IDENTIFIED', payload: false });
          setTimeout(() => userIsIdentifiedSignal.dispatch(false), 100);
          window.history.back();
        }
      } else {
        const response = await checkPasswordAsync(password);
        if (response === 'PasswordOk') {
          dispatch({ type: 'SET_IS_IDENTIFIED', payload: true });
          setTimeout(() => userIsIdentifiedSignal.dispatch(true), 100);
          window.history.back();
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <Modal.Dialog
      size="sm"
      show={showModal}
      onHide={handleClose}
      aria-labelledby="example-modal-sizes-title-sm"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          {!isIdentified ? (
            <FormInput
              text={password}
              type="password"
              placeholder="Password"
              preText="log in"
              onTextChanged={handlePasswordChanged}
              onEnter={handleLogInOut}
            />
          ) : (
            <strong>Log out</strong>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleLogInOut}>
          {isIdentified ? 'Log out' : 'Log in'}
        </Button>
        <Button style={{ border: 'none', background: 'none', color: 'black' }}>
          <FontAwesomeIcon
            icon={faSpinner}
            size="2x"
            spin
            style={{ opacity: status === 'idle' ? '0' : '1' }}
          />
        </Button>
      </Modal.Body>
    </Modal.Dialog>
  );
}

export default User;
