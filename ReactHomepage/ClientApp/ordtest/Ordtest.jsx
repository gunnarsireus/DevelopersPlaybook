import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

function Ordtest() {
  const [sandboxOptions] = useState('allow-scripts allow-same-origin');
  const [urls, setUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch('/Content/linklist.txt');
        const text = await response.text();
        const urlArray = text.split('\n').filter(url => url);
        setUrls(urlArray);
        if (urlArray.length === 0) {
          console.error('No URLs found');
        }
      } catch (error) {
        console.error('Failed to load URL list', error);
      }
    };
    fetchUrls();
  }, []);

  const nextLink = () => {
    if (currentIndex < urls.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const currentUrl = urls[currentIndex];
  const currentYear = 2023 - currentIndex;

  return (
    <div className="container">
      <Row>
        <Col className="row-height">
          <Col md={2} className="hidden-md hidden-sm hidden-xs col-md-height col-md-top custom-vertical-left-border custom-vertical-right-border grey-background">
            <Row>
              <Col md={12}>
                <h4 />
              </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Col md={12}>
                <h4>{currentYear} &nbsp;&nbsp;
                  <button onClick={nextLink} style={{ borderRadius: '6px', border: 'none', backgroundColor: '#3B82F6', color: '#FFFFFF' }}>
                    Next
                  </button>
                </h4>
              </Col>
            </Row>
          </Col>
          <Col md={10} className="col-md-height">
            <Row>
              {currentUrl && (
                <iframe
                  src={currentUrl}
                  style={{
                    width: "100%",
                    height: "80vh",
                    border: "none",
                    textAlign: "center",
                  }}
                  sandbox={sandboxOptions}
                  title="content-frame"
                ></iframe>
              )}
            </Row>
          </Col>
        </Col>
      </Row>
    </div>
  );
}

export default Ordtest;
