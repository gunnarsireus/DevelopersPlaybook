import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { routeChangedSignal } from '../Frame';
import CrossJoin from '../../wwwroot/Content/images/CrossJoin.png';
import InnerJoin from '../../wwwroot/Content/images/InnerJoin.png';
import LeftOuterJoin from '../../wwwroot/Content/images/LeftOuterJoin.png';
import GroupJoin from '../../wwwroot/Content/images/GroupJoin.png';
import { Row, Col, Carousel } from 'react-bootstrap';

class Sql extends Component {
  constructor(props) {
    super(props);

    // Use history.push to navigate programmatically
    props.history.push('/sql');
    setTimeout(() => { routeChangedSignal.dispatch('sql'); }, 100);
  }

  render() {
    const carouselInstance = (
      <Carousel interval={6000} controls indicators>
        <Carousel.Item>
          <img src={GroupJoin} alt="Group Join" className="img-responsive" />
          <Carousel.Caption>
            <p>
              Group Join med LINQ, Lambda LSQL
              <a className="btn btn-default" href="https://www.dotnetperls.com/groupjoin">
                Read more on Dot Net Pearls
              </a>
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={LeftOuterJoin} alt="Left Outer Join" className="img-responsive" />
          <Carousel.Caption>
            <p>
              Left Outer Join med LINQ, Lambda and SQL
              <a className="btn btn-default" href="https://msdn.microsoft.com/en-us/library/bb397895.aspx">
                Read more on MSDN
              </a>
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={InnerJoin} alt="Inner Join" className="img-responsive" />
          <Carousel.Caption>
            <p>
              Inner Join med LINQ, Lambda and SQL
              <a className="btn btn-default" href="https://msdn.microsoft.com/en-us/library/bb397895.aspx">
                Read more on MSDN
              </a>
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img src={CrossJoin} alt="Cross Join" className="img-responsive" />
          <Carousel.Caption>
            <p>
              Cross Join med LINQ, Lambda and SQL
              <a className="btn btn-default" href="https://www.dotnetperls.com/selectmany">
                Read more on Dot Net Pearls
              </a>
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );

    return (
      <div className="container">
        <Row>
          <Col className="row-height">
            <Col md={3} className="hidden-md hidden-sm hidden-xs col-md-height col-md-top custom-vertical-left-border custom-vertical-right-border grey-background">
              <Row>
                <Col md={12}>
                  <h4 />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h4>LINQ and SQL</h4>
                </Col>
              </Row>
            </Col>
            <Col md={9} className="col-md-height">
              <Row>
                {carouselInstance}
              </Row>
            </Col>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(Sql);
