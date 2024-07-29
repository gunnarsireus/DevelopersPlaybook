import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import MiniSignal from 'mini-signals';
import logo from "./../wwwroot/Content/images/Logo.png";
import hamburger from "./../wwwroot/Content/images/Hamburger.png";
import ReactSvgIcon from "./common/ReactSvgIcon";

export const routeChangedSignal = new MiniSignal();
export const userIsIdentifiedSignal = new MiniSignal();

const Frame = (props) => {
  const [dayNumber, setDayNumber] = useState(new Date().getDay() % 12);

  const getCss = (spriteType, dayNumber) => `transparent url('./Content/images/Bootstrap${spriteType}Composed.jpg') 0 ${-81 * dayNumber}px`;
  const [todaysHeaderCss, setTodaysHeaderCss] = useState(getCss('Header', dayNumber));
  const [todaysFooterCss, setTodaysFooterCss] = useState(getCss('Footer', dayNumber));

  const [userIsIdentified, setUserIsIdentified] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const elCollapseButton = useRef(null);
  const sidebarRef = useRef(null);
  const menuRefs = {
    homeLi: useRef(null),
    sqlLi: useRef(null),
    ltbLi: useRef(null),
    albumsLi: useRef(null),
    ordtestLi: useRef(null),
    userLi: useRef(null),
  };

  useEffect(() => {
    const routeChangedHandler = (route) => {
      Object.values(menuRefs).forEach(ref => {
        if (ref.current) ref.current.children[0].classList.remove("active");
      });

      const routeMapping = {
        home: menuRefs.homeLi,
        sql: menuRefs.sqlLi,
        ltb: menuRefs.ltbLi,
        albums: menuRefs.albumsLi,
        ordtest: menuRefs.ordtestLi,
        user: menuRefs.userLi
      };

      if (routeMapping[route] && routeMapping[route].current) {
        routeMapping[route].current.children[0].classList.add("active");
      }
    };

    const loginChangedHandler = (isIdentified) => {
      setUserIsIdentified(isIdentified);
    };

    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(false);
        document.getElementById('main-content').classList.remove('content-blur');
      }
    };

    // Store the bindings returned by add method
    const routeChangedBinding = routeChangedSignal.add(routeChangedHandler);
    const userIsIdentifiedBinding = userIsIdentifiedSignal.add(loginChangedHandler);

    if (elCollapseButton.current) {
      elCollapseButton.current.addEventListener('click', toggleSidebar);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      // Use the stored bindings to remove the listeners
      routeChangedBinding.detach();
      userIsIdentifiedBinding.detach();

      if (elCollapseButton.current) {
        elCollapseButton.current.removeEventListener('click', toggleSidebar);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [menuRefs]);

  const toggleSidebar = () => {
    setSidebarOpen(prevSidebarOpen => {
      const newState = !prevSidebarOpen;
      const mainContent = document.getElementById('main-content');
      if (newState) {
        mainContent.classList.add('content-blur');
      } else {
        mainContent.classList.remove('content-blur');
      }
      return newState;
    });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    document.getElementById('main-content').classList.remove('content-blur');
  };

  return (
    <div>
      <header className="navbar navbar-expand-lg navbar-light bg-light" style={{ background: todaysHeaderCss, height: '81px', margin: '0' }}>
        <div className="container">
          <a className="navbar-brand pb-5 mb-3" href="/">
            <ReactSvgIcon text={'SireusCore'} icon={logo} iconClass={'logo'} />
          </a>
          <button ref={elCollapseButton} className="navbar-toggler" type="button">
            <span className="navbar-toggler-icon"><img src={hamburger} alt="Hamburger Icon" /></span>
          </button>
          <div className="collapse navbar-collapse navbar-nav-container">
            <ul className="navbar-nav navbar-nav-main spriteTabs">
              <li ref={menuRefs.homeLi} className="nav-item">
                <NavLink exact to="/" className="nav-link no-underline" onClick={closeSidebar}>Home<span /></NavLink>
              </li>
              <li ref={menuRefs.ordtestLi} className="nav-item">
                <NavLink to="/ordtest" className="nav-link no-underline" onClick={closeSidebar}>Word&nbsp;test<span /></NavLink>
              </li>
              <li ref={menuRefs.albumsLi} className="nav-item">
                <NavLink to="/albums" className="nav-link no-underline" onClick={closeSidebar}>Album<span /></NavLink>
              </li>
              <li ref={menuRefs.ltbLi} className="nav-item">
                <NavLink to="/ltb" className="nav-link no-underline" onClick={closeSidebar}>LTB<span /></NavLink>
              </li>
              <li ref={menuRefs.sqlLi} className="nav-item">
                <NavLink to="/sql" className="nav-link no-underline" onClick={closeSidebar}>SQL<span /></NavLink>
              </li>
            </ul>
            <ul className="navbar-nav navbar-nav-right spriteTabs">
              <li className="nav-item">
                <a href="https://www.google.com/maps/place/Grimstahamnsv%C3%A4gen+4,+168+39+Bromma/@59.3345682,17.9231671,16z/data=!3m1!4b1!4m6!3m5!1s0x465f75e4cbc3d48d:0x855e7a82ffe092cf!8m2!3d59.3345655!4d17.925742!16s%2Fg%2F11csgw2_cv?entry=ttu" target="_blank" rel="noopener noreferrer" className="nav-link no-underline"><span></span>&nbsp;&nbsp;<i className="fas fa-map-marker-alt"></i><span></span></a>
              </li>
              <li className="nav-item">
                <NavLink to="/user" className="nav-link no-underline"><span></span>&nbsp;<i className="fas fa-user"></i><span /></NavLink>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
        <div className="sidebar-header">
          <a href="https://www.google.com/maps/place/Grimstahamnsv%C3%A4gen+4,+168+39+Bromma/@59.3345682,17.9231671,16z/data=!3m1!4b1!4m6!3m5!1s0x465f75e4cbc3d48d:0x855e7a82ffe092cf!8m2!3d59.3345655!4d17.925742!16s%2Fg%2F11csgw2_cv?entry=ttu" target="_blank" rel="noopener noreferrer" className="nav-link"><i className="fas fa-map-marker-alt"></i></a>
          <NavLink to="/user" className="nav-link" onClick={closeSidebar}><i className="fas fa-user"></i></NavLink>
        </div>
        <div className="nav-list">
          <ul className="navbar-nav">
            <li ref={menuRefs.homeLi} className="nav-item">
              <NavLink exact to="/" className="nav-link" onClick={closeSidebar}>Home</NavLink>
            </li>
            <li ref={menuRefs.ordtestLi} className="nav-item">
              <NavLink to="/ordtest" className="nav-link" onClick={closeSidebar}>Word test</NavLink>
            </li>
            <li ref={menuRefs.albumsLi} className="nav-item">
              <NavLink to="/albums" className="nav-link" onClick={closeSidebar}>Album</NavLink>
            </li>
            <li ref={menuRefs.ltbLi} className="nav-item">
              <NavLink to="/ltb" className="nav-link" onClick={closeSidebar}>LTB</NavLink>
            </li>
            <li ref={menuRefs.sqlLi} className="nav-item">
              <NavLink to="/sql" className="nav-link" onClick={closeSidebar}>SQL</NavLink>
            </li>
          </ul>
        </div>
      </div>

      <div id="main-content" className="content">
        {props.children}
      </div>

      <footer className="bg-light text-center text-lg-start" style={{ background: todaysFooterCss, height: '81px', margin: '0' }}>
        <div className="text-center p-3">
          © 2024 - Siréus Consulting AB
        </div>
      </footer>
    </div>
  );
};

export default Frame;
