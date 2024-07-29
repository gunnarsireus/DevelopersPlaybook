import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import AlbumFrame from './AlbumFrame';
import * as apiClient from "../helpers/ApiHelpers";
import { routeChangedSignal } from '../Frame';
import { useUserContext } from '../user/UserContext';

const Albums = (props) => {
  const [albums, setAlbums] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const history = useHistory();
  const { state: userState } = useUserContext();

  useEffect(() => {
    history.push('/albums');
    setTimeout(() => { routeChangedSignal.dispatch('albums'); }, 100);
    getAlbumsWithPhotoCount('/albums');
  }, []);

  const getAlbumsWithPhotoCount = async (url) => {
    setShowProgress(true);
    try {
      const response = await apiClient.getHelper(url);
      setAlbums([...response]);
    } catch (error) {
      alert('Kan ej kontakta server ', error);
    } finally {
      setShowProgress(false);
    }
  };

  const rows = [];
  for (let i = 0; i < albums.length; i += 2) {
    rows.push(
      <tr key={albums[i].albumID}>
        <AlbumFrame AlbumID={albums[i].albumID} PhotoCount={albums[i].photoCount} Caption={albums[i].caption} IsPublic={albums[i].isPublic} ItemCount={i} />
        {albums[i + 1] && (
          <AlbumFrame AlbumID={albums[i + 1].albumID} PhotoCount={albums[i + 1].photoCount} Caption={albums[i + 1].caption} IsPublic={albums[i + 1].isPublic} ItemCount={i + 1} />
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
