import React from 'react';
import PropTypes from 'prop-types';
import { Animate } from "react-simple-animate";
import { Link } from 'react-router-dom';

const AlbumFrame = ({ AlbumID, Caption, PhotoCount, ItemCount }) => {
  const animationProps = {
    startStyle: { opacity: 0 },
    endStyle: { opacity: 1 },
    durationSeconds: 1,
  };

  return (
    <td className="item">
      <table cellPadding="0" cellSpacing="0" className="album-frame">
        <tbody>
          <tr>
            <td className="topx----">
              <img alt="" src="/Content/images/album-l1.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td className="top-x---">
              <img alt="" src="/Content/images/album-mtl.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td className="top--x--" />
            <td className="top---x-">
              <img alt="" src="/Content/images/album-mtr.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td className="top----x">
              <img alt="" src="/Content/images/album-r1.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
          </tr>
          <tr>
            <td className="mtpx----">
              <img alt="" src="/Content/images/album-l2.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td colSpan="3" rowSpan="3">
              <Animate delaySeconds={ItemCount / 4} play {...animationProps}>
                <Link to={`/photos/${AlbumID}/${Caption}`}>
                  <img src={`/Handler/Index/AlbumID=${AlbumID}/Size=M`} className="photo_198" style={{ border: '4px solid white', maxHeight: '100%', maxWidth: '100%' }} alt={`Sample Photo from Album Number ${AlbumID}`} />
                </Link>
              </Animate>
            </td>
            <td className="mtp----x">
              <img alt="" src="/Content/images/album-r2.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
          </tr>
          <tr>
            <td className="midx----" />
            <td className="mid----x" />
          </tr>
          <tr>
            <td className="mbtx----">
              <img alt="" src="/Content/images/album-l3.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td className="mbt----x">
              <img alt="" src="/Content/images/album-r3.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
          </tr>
          <tr>
            <td className="botx----">
              <img alt="" src="/Content/images/album-l4.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td className="bot-x---" style={{ textAlign: 'left' }}>
              <img alt="" src="/Content/images/album-mbl.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
            <td className="bot--x--" />
            <td className="bot---x-" style={{ textAlign: 'right' }}>
              <img alt="" src="/Content/images/album-mbr.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />&nbsp;&nbsp;
            </td>
            <td className="bot----x">
              <img alt="" src="/Content/images/album-r4.gif" style={{ maxHeight: '100%', maxWidth: '100%', verticalAlign: 'top' }} />
            </td>
          </tr>
        </tbody>
      </table>
      <h4>
        <Link to={`/photos/${AlbumID}`}>{Caption}</Link>
      </h4>
      <div>{PhotoCount} images</div>
    </td>
  );
}

AlbumFrame.propTypes = {
  AlbumID: PropTypes.number.isRequired,
  Caption: PropTypes.string.isRequired,
  PhotoCount: PropTypes.number.isRequired,
  ItemCount: PropTypes.number.isRequired,
};

AlbumFrame.defaultProps = {
  AlbumID: 0,
  PhotoCount: 0,
  Caption: '',
};

export default AlbumFrame;
