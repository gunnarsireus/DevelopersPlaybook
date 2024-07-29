import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import TextInput from '../common/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { userIsIdentifiedSignal } from '../Frame';
import { useUserContext } from './UserContext';

const User = () => {
  const { state, dispatch, checkPasswordAsync, logOutAsync } = useUserContext();
  const userIsIdentified = state.isIdentified;
  const userStatus = state.status;
  const [showModal, setShowModal] = useState(true);
  const [password, setPassword] = useState('');

  const handleClose = () => {
    setShowModal(false);
    setPassword('');
    window.history.back();
  }

  const handlePasswordChanged = (value) => setPassword(value);

  const handleLogInOut = async (e) => {
    e.preventDefault();
    try {
      if (userIsIdentified) {
        const response = await logOutAsync();
        if (response === 'userLoggedOut' || response === 'userAlreadyLoggedOut') {
          dispatch({ type: 'SET_IS_IDENTIFIED', payload: false });
          setTimeout(() => { userIsIdentifiedSignal.dispatch(false); }, 100);
          window.history.back();
        }
      } else {
        const response = await checkPasswordAsync(password);
        if (response === 'PasswordOk') {
          dispatch({ type: 'SET_IS_IDENTIFIED', payload: true });
          setTimeout(() => { userIsIdentifiedSignal.dispatch(true); }, 100);
          window.history.back();
        }
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  return (
    <Modal.Dialog
      size='sm'
      show={showModal.toString()}
      aria-labelledby="example-modal-sizes-title-sm"
      centered
    >
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>
          {!userIsIdentified ?
            (<TextInput text={password} placeholder='Password' onTextChanged={handlePasswordChanged} preText={'log in'} type={'password'} />)
            :
            (<strong>Logging out</strong>)
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleLogInOut}>
          {userIsIdentified ? ('Log out') : ('Log in')}
        </Button>
        <Button style={{ border: 'none', background: 'none', color: 'black' }}>
          <FontAwesomeIcon icon={faSpinner} size={'2x'} spin style={userStatus === 'idle' ? { opacity: '0' } : { opacity: '1' }} />
        </Button>
      </Modal.Body>
    </Modal.Dialog>
  );
}

export default User;
