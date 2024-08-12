import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col} from 'react-bootstrap';
import progress from '../../wwwroot/content/images/progress.gif';

export default class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showProgress: this.props.showProgress,
            total: this.props.total,
            safety: this.props.safety,
            stock: this.props.stock,
            failed: this.props.failed,
            repaired: this.props.repaired,
            lost: this.props.lost,
            infoText:this.props.infoText,
            servicedays: this.props.servicedays
        };
    }

    componentDidMount() {
        this.setState({
            showProgress: this.props.showProgress,
            total: this.props.total,
            safety: this.props.safety,
            stock: this.props.stock,
            failed: this.props.failed,
            repaired: this.props.repaired,
            lost: this.props.lost,
            infoText:this.props.infoText,
            servicedays: this.props.servicedays
        });
}

    componentWillReceiveProps(newProps) {
        this.setState({
            showProgress: newProps.showProgress,
            total: newProps.total,
            safety: newProps.safety,
            stock: newProps.stock,
            failed: newProps.failed,
            repaired: newProps.repaired,
            lost: newProps.lost,
            infoText:newProps.infoText,
            servicedays: newProps.servicedays
        });
}


    render() {
        return (<div className="panel panel-primary">
            <div className="panel-heading">
                <h3 className="panel-title">Result</h3>
            </div>
            <Row>
                <Col xs={2} sm={2} md={2} />
                <Col xs={9} sm={9} md={9}>
                    <Row>
                        <div className={!this.state.showProgress ? 'col-xs-10 col-sm-10 col-md-10 text-success  BorderInset' : 'hidden'}>{this.state.infoText}</div>
                        <div className={this.state.showProgress ? 'col-xs-10 col-sm-10 col-md-10 text-success  BorderInset' : 'hidden'}>Calculation started...         <div style={{ display: "inline" }} ><img height={20} width={20} src={progress} /></div></div>
                    </Row>
                </Col>
                <div className="col-xs-1 col-sm-1 col-md-1" />
            </Row>
            <Row>
                <Col xs={1} sm={1} md={1} />
                <Col xs={3} sm={3} md={3}>
                    <Row>
                    <Col xs={12} sm={12} md={12} className="text-success BorderOutset">Total&nbsp;stock&nbsp;(inc.&nbsp;margin):</Col>
                    </Row>
                </Col>
                <Col xs={2} sm={2} md={2}>
                    <Row>
                        <Col xs={8} sm={8} md={8} className="text-success BorderInset">{this.state.total}</Col>
                    </Row>
                </Col>
                <Col xs={3} sm={3} md={3}>
                    <Row>
                    <Col xs={12} sm={12} md={12} className="text-success BorderOutset">Safety&nbsp;smargin:</Col>
                    </Row>
                </Col>
                <Col xs={2} sm={2} md={2}>
                    <Row>
                        <Col xs={8} sm={8} md={8} className="text-success BorderInset">{this.state.safety}</Col>
                    </Row>
                </Col>
                <Col xs={1} sm={1} md={1} />
            </Row>
            <Row>
                <Col xs={1} sm={1} md={1} />
                <Col xs={3} sm={3} md={3}>
                    <Row>
                        <Col xs={12} sm={12} md={12} className="text-success BorderOutset">Stock&nbsp;(no&nbsp;margin):</Col>
                    </Row>
                </Col>
                <Col xs={2} sm={2} md={2}>
                    <Row>
                        <Col xs={8} sm={8} md={8} className="text-success BorderInset">{this.state.stock}</Col>
                    </Row>
                </Col>
                <Col xs={3} sm={3} md={3}>
                    <Row>
                        <Col xs={12} sm={12} md={12} className="text-success  BorderOutset">Failed:</Col>
                    </Row>
                </Col>
                <Col xs={2} sm={2} md={2}>
                    <Row>
                        <Col xs={8} sm={8} md={8} className="text-success  BorderInset">{this.state.failed}</Col>
                    </Row>
                </Col>
                <Col xs={1} sm={1} md={1} />
            </Row>
            <Row>
                <Col xs={1} sm={1} md={1} />
                <Col xs={3} sm={3} md={3}>
                    <Row>
                      <Col xs={12} sm={12} md={12} className="text-success  BorderOutset">Successful&nbsp;repairs:</Col>
                    </Row>
                </Col>
                <Col className="col-xs-2 col-sm-2 col-md-2 ">
                    <Row>
                        <Col xs={8} sm={8} md={8} className="text-success  BorderInset">{this.state.repaired}</Col>
                    </Row>
                </Col>
                <Col xs={3} sm={3} md={3}>
                    <Row>
                <Col xs={12} sm={12} md={12} className="text-success  BorderOutset">Service&nbsp;days:</Col>
                    </Row>
                </Col>
                <Col xs={2} sm={2} md={2}>
                    <Row>
                        <Col xs={8} sm={8} md={8} className="text-success  BorderInset">{this.state.servicedays}</Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col xs={1} sm={1} md={1} />
                <Col xs={5} sm={5} md={5}>
                    <Row>
                        <Col xs={12} sm={12} md={12} className="text-success  BorderOutset">Failed&nbsp;repairs:</Col>
                    </Row>
                </Col>
                <Col xs={2} sm={2} md={2}>
                    <Row>
                        <Col xs={8} sm={8} md={8} className="text-success  BorderInset">{this.state.lost}</Col>
                    </Row>
                </Col>
            </Row>
        </div>);                
    }
}

Result.propTypes =
    {
        total: PropTypes.string,     /*Totallager*/
        safety: PropTypes.string,	 /*Säkerhetsmarginal*/
        stock: PropTypes.string,    /*Lager (ingen marginal)*/
        failed: PropTypes.string,    /*Falerade*/
        repaired: PropTypes.string,  /*Lyckade reparationer*/
        lost: PropTypes.string,
        infoText: PropTypes.string,
        servicedays: PropTypes.string  /*Servicedagar*/
    };
