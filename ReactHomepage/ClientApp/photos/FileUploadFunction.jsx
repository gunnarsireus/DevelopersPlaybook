import React, { useState } from "react";
import DragAndDrop from './DragAndDrop';
import * as apiClient from "../helpers/ApiHelpers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useSessionUserContext } from '../user/SessionUserContext';

const FileUploadFunction = (props) => {
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [status, setStatus] = useState('idle');
  const { state: userState } = useSessionUserContext();

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_DROP_DEPTH':
        return { ...state, dropDepth: action.dropDepth }
      case 'SET_IN_DROP_ZONE':
        return { ...state, inDropZone: action.inDropZone };
      case 'ADD_FILE_TO_LIST':
        return { ...state, fileList: state.fileList.concat(action.files) };
      default:
        return state;
    }
  };

  const [data, dispatch] = React.useReducer(
    reducer, { dropDepth: 0, inDropZone: false, fileList: [] }
  );

  const handleFileDropped = files => {
    if (files.length) {
      setImage({
        preview: URL.createObjectURL(files[0]),
        raw: files[0]
      });
    }
  };

  const handleChange = e => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };

  const handleUpload = async e => {
    e.preventDefault();
    setStatus('loading');
    const formData = new FormData();
    formData.append("Image", image.raw);
    formData.append("AlbumId", props.albumId);
    formData.append("Caption", props.caption);

    await apiClient.postImageHelper('api/photos/add/', formData, userState.token).then((response) => {
      props.onPhotoAdded(response);
      setImage({
        preview: "",
        raw: ""
      });
      setStatus('idle');
    }).catch((response) => {
      setStatus('idle');
      alert('Ingen kontakt med server: ', response);
    });
  };

  const handleCancel = e => {
    e.preventDefault();
    setImage({
      preview: "",
      raw: ""
    });
  };

  return (
    <div>
      <label htmlFor="upload-button">
        {image.preview ? (
          <img src={image.preview} alt="dummy" />
        ) : (
          <div>
            <DragAndDrop data={data} dispatch={dispatch} onFileDropped={handleFileDropped} />
            <br />
            <strong className="text-center">eller ladda upp!</strong>
          </div>
        )}
      </label>
      <input
        type="file"
        id="upload-button"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      {image.preview ? (
        <div>
          <br />
          {props.caption ? (
            <div>
              <button onClick={handleUpload}>
                <FontAwesomeIcon icon={faSave} size={'2x'} />
              </button>
              <FontAwesomeIcon icon={faSpinner} size={'2x'} spin style={(status === 'loading') ? { opacity: '1' } : { opacity: '0' }} />
              <button onClick={handleCancel}>
                <FontAwesomeIcon icon={faTimes} size={'2x'} />
              </button>
            </div>
          ) : (
            <div>
              <button onClick={handleCancel}>
                <FontAwesomeIcon icon={faTimes} size={'2x'} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <br />
      )}
    </div>
  );
};

export default FileUploadFunction;
