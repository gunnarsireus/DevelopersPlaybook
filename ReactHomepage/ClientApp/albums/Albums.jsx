import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import AlbumFrame from './AlbumFrame';
import * as apiClient from "../helpers/ApiHelpers";
import { routeChangedSignal } from '../Frame';
import { useSessionUserContext } from '../user/SessionUserContext';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const history = useHistory();
  const { state: userState } = useSessionUserContext();

  useEffect(() => {
    setShowProgress(true);
    history.push('/albums');
    setTimeout(() => { routeChangedSignal.dispatch('albums'); }, 100);
    setShowProgress(false);
  }, []);

  useEffect(() => {
    getAlbumsWithPhotoCount('api/albums');
  }, [userState.isIdentified]);

  const noEmptyAlbumsExists = (albums) => {
    return albums.every(album => album.photoCount > 0);
  };

  const getAlbumsWithPhotoCount = async (url) => {
    setShowProgress(true);
    try {
      const response = await apiClient.getHelper(url);
      setAlbums([...response]);

      // Check if no empty albums exist after setting the state
      if (userState.isIdentified && noEmptyAlbumsExists(response)) {
        const album = { albumID: 0, photoCount: 0, caption: '', isPublic: true };
        setAlbums(prevAlbums => [...prevAlbums, album]);
      }
    } catch (error) {
        alert('Could not contact server ', error);
    } finally {
        setShowProgress(false);
    }
  };

  const handleDelete = async (albumId) => {
    setShowProgress(true);
    await apiClient.deleteHelper(`/api/albums/delete/${albumId}`);
    const updatedAlbums = albums.filter(album => album.albumID !== albumId)
    setAlbums(updatedAlbums);
    if (userState.isIdentified && noEmptyAlbumsExists(updatedAlbums)) {
      const album = { albumID: 0, photoCount: 0, caption: '', isPublic: true };
      setAlbums(prevAlbums => [...prevAlbums, album]);
    }
    setShowProgress(false);
  };

  const handleUpdate = async (albumId, newCaption) => {
    setShowProgress(true);
    await apiClient.putHelper(`/api/albums/Update/${albumId}`, newCaption);
    setAlbums(albums.map(album => album.albumID === albumId ? { ...album, caption: newCaption } : album));
    setShowProgress(false);
  };

  const handleAdd = async (caption) => {
    setShowProgress(true);
    const newAlbum = await apiClient.postHelper(`/api/albums/add`, caption );
    setAlbums([...albums.filter(album => album.albumID !== 0), newAlbum]);
    setShowProgress(false);
  };

  const rows = [];
  for (let i = 0; i < albums.length; i += 2) {
    rows.push(
      <tr key={albums[i].albumID}>
        <AlbumFrame
          AlbumID={albums[i].albumID}
          PhotoCount={albums[i].photoCount}
          Caption={albums[i].caption}
          IsPublic={albums[i].isPublic}
          ItemCount={i}
          userState={userState}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          handleAdd={handleAdd}
        />
        {albums[i + 1] && (
          <AlbumFrame
            AlbumID={albums[i + 1].albumID}
            PhotoCount={albums[i + 1].photoCount}
            Caption={albums[i + 1].caption}
            IsPublic={albums[i + 1].isPublic}
            ItemCount={i + 1}
            userState={userState}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            handleAdd={handleAdd}
          />
        )}
      </tr>
    );
  }

  return (
    <div className="container">
      <Row>
        <Col className="row-height">
          <Col md={3} className="hidden-md hidden-sm hidden-xs col-md-height col-md-top custom-vertical-left-border custom-vertical-right-border grey-background">
            <Row>
              <Col md={12}>
                <h4>Photo album</h4>
              </Col>
            </Row>
          </Col>
          <Col md={9} className="col-md-height">
            <Row>
              <FontAwesomeIcon
                icon={faSpinner}
                size="2x"
                spin
                style={{ opacity: showProgress ? '1' : '0' }}
              />
              <table className="album-frame" style={{ fontSize: '10px', fontFamily: 'verdana, arial, helvetica, sans-serif' }}>
                <tbody>
                  {rows}
                </tbody>
              </table>
            </Row>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Albums;
