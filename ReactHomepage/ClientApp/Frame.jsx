import React, { Component, createRef } from 'react';
import { NavLink } from 'react-router-dom';
import logo from "./../wwwroot/Content/images/info.png";
import hamburger from "./../wwwroot/Content/images/Hamburger.png";
import ReactSvgIcon from "./common/ReactSvgIcon";
import MiniSignal from 'mini-signals';

export const routeChangedSignal = new MiniSignal();
export const userIsIdentifiedSignal = new MiniSignal();

export default class Frame extends Component {
  constructor(props) {
    super(props);

    let d = new Date();
    let dayNumber = d.getDay() % 12;

    let todaysHeaderCss = this.getCss("Header", dayNumber);
    let todaysFooterCss = this.getCss("Footer", dayNumber);

    this.state = {
      dayNumber: dayNumber,
      todaysHeaderCss: todaysHeaderCss,
      todaysFooterCss: todaysFooterCss,
      userIsIdentified: false,
      sidebarOpen: false
    };

    this.elCollapseButton = createRef();
    this.sidebarRef = createRef();
    this.homeLi = createRef();
    this.albumsLi = createRef();
    this.userLi = createRef();

    this.binding = null;
    this.loginBinding = null;

  }
 

  getCss(spriteType, dayNumber) {
    return `transparent url('./Content/images/Bootstrap${spriteType}Composed.jpg') 0 ${-81 * dayNumber}px`;
  }

  componentDidMount() {
    this.binding = routeChangedSignal.add(this.routeChanged);
    this.loginBinding = userIsIdentifiedSignal.add(this.loginChanged);

    if (this.elCollapseButton.current) {
      let collapseButton = this.elCollapseButton.current;
      collapseButton.addEventListener('click', this.toggleSidebar);
    }

    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    if (this.binding) this.binding.detach();
    if (this.loginBinding) this.loginBinding.detach();

    window.removeEventListener('resize', this.handleResize);
  }

  loginChanged = (isIdentified) => {
    this.setState({ userIsIdentified: isIdentified });
  };

  routeChanged = (route) => {
    const refs = [this.homeLi, this.sqlLi, this.ltbLi, this.albumsLi, this.ordtestLi, this.userLi];
    refs.forEach(ref => {
      if (ref.current) ref.current.children[0].classList.remove("active");
    });

    const routeMapping = {
      home: this.homeLi,
      sql: this.sqlLi,
      ltb: this.ltbLi,
      albums: this.albumsLi,
      ordtest: this.ordtestLi,
      user: this.userLi
    };

    if (routeMapping[route] && routeMapping[route].current) {
      routeMapping[route].current.children[0].classList.add("active");
    }
  };

  toggleSidebar = () => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen }, () => {
      if (this.state.sidebarOpen) {
        document.getElementById('main-content').classList.add('content-blur');
      } else {
        document.getElementById('main-content').classList.remove('content-blur');
      }
    });
  };

  closeSidebar = () => {
    this.setState({ sidebarOpen: false });
    document.getElementById('main-content').classList.remove('content-blur');
  };

  handleResize = () => {
    if (window.innerWidth >= 992) {
      this.setState({ sidebarOpen: false });
      document.getElementById('main-content').classList.remove('content-blur');
    }
  };

  render() {
    return (
      <div>
        <header className="navbar navbar-expand-lg navbar-light bg-light" style={{ background: this.state.todaysHeaderCss, height: '81px', margin: '0' }}>
          <div className="container">
            <a className="navbar-brand pb-5 mb-3" href="/">
              <ReactSvgIcon text={'ReactHomepage'} icon={logo} iconClass={'logo'} />
            </a>
            <button ref={this.elCollapseButton} className="navbar-toggler" type="button">
              <span className="navbar-toggler-icon"><img src={hamburger} alt="Hamburger Icon" /></span>
            </button>
            <div className="collapse navbar-collapse navbar-nav-container">
              <ul className="navbar-nav navbar-nav-main spriteTabs">
                <li ref={this.homeLi} className="nav-item">
                  <NavLink exact to="/" className="nav-link no-underline" onClick={this.closeSidebar}>Home<span /></NavLink>
                </li>
                <li ref={this.albumsLi} className="nav-item">
                  <NavLink to="/albums" className="nav-link no-underline" onClick={this.closeSidebar}>Album<span /></NavLink>
                </li>
              </ul>
              <ul className="navbar-nav navbar-nav-right spriteTabs">
                {/*<li className="nav-item">*/}
                {/*  <a href="mailto:xxx@reacthomepage.com" className="nav-link no-underline"><span></span>&nbsp;&nbsp;<i className="fas fa-envelope"></i><span></span></a>*/}
                {/*</li>*/}
                <li className="nav-item">
                  <a href="https://www.google.com/maps/place/Statue+of+Liberty/@40.688969,-113.0657959,4z/data=!4m10!1m2!2m1!1sstaue+of+liberty!3m6!1s0x89c25090129c363d:0x40c6a5770d25022b!8m2!3d40.6892494!4d-74.0445004!15sChFzdGF0dWUgb2YgbGliZXJ0eVoTIhFzdGF0dWUgb2YgbGliZXJ0eZIBE2hpc3RvcmljYWxfbGFuZG1hcmvgAQA!16zL20vMDcycDg?entry=ttu" target="_blank" rel="noopener noreferrer" className="nav-link no-underline"><span></span>&nbsp;&nbsp;<i className="fas fa-map-marker-alt"></i><span></span></a>
                </li>
                <li className="nav-item">
                  <NavLink to="/user" className="nav-link no-underline"><span></span>&nbsp;<i className="fas fa-user"></i><span></span></NavLink>
                </li>
              </ul>
            </div>
          </div>
        </header>

        <div className={`sidebar ${this.state.sidebarOpen ? 'open' : ''}`} ref={this.sidebarRef}>
          <div className="sidebar-header">
{/*            <a href="mailto:xxx@reacthomepage.com" className="nav-link"><i className="fas fa-envelope"></i></a>*/}
            <a href="https://www.google.com/maps/place/Statue+of+Liberty/@40.688969,-113.0657959,4z/data=!4m10!1m2!2m1!1sstaue+of+liberty!3m6!1s0x89c25090129c363d:0x40c6a5770d25022b!8m2!3d40.6892494!4d-74.0445004!15sChFzdGF0dWUgb2YgbGliZXJ0eVoTIhFzdGF0dWUgb2YgbGliZXJ0eZIBE2hpc3RvcmljYWxfbGFuZG1hcmvgAQA!16zL20vMDcycDg?entry=ttu" target="_blank" rel="noopener noreferrer" className="nav-link no-underline"><span></span>&nbsp;&nbsp;<i className="fas fa-map-marker-alt"></i><span></span></a>
            <NavLink to="/user" className="nav-link" onClick={this.closeSidebar}><i className="fas fa-user"></i></NavLink>
          </div>
          <div className="nav-list">
            <ul className="navbar-nav">
              <li ref={this.homeLi} className="nav-item">
                <NavLink exact to="/" className="nav-link" onClick={this.closeSidebar}>Home</NavLink>
              </li>
              <li ref={this.albumsLi} className="nav-item">
                <NavLink to="/albums" className="nav-link" onClick={this.closeSidebar}>Album</NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div id="main-content" className={`content`}>
          {this.props.children}
        </div>

        <footer className="bg-light text-center text-lg-start" style={{ background: this.state.todaysFooterCss, height: '81px', margin: '0' }}>
          <div className="text-center p-3">
            © 2024 - React Homepage Ltd.
          </div>
        </footer>
      </div>
    );
  }
}
