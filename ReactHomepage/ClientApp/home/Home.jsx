import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { routeChangedSignal } from '../Frame';
import PhotoFrame from '../photos/PhotoFrame';
import WidgetFrame from './WidgetFrame';
import epostJpg from '../../wwwroot/Content/images/mail.png';
import { Animate, AnimateKeyframes } from "react-simple-animate";

const Home = () => {
  const [isClient, setIsClient] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [rand] = useState(Math.floor(Math.random() * 10000));
  const [play, setPlay] = useState(false);

  useEffect(() => {
    // Check if running on the client-side
    setIsClient(typeof window !== 'undefined');

    // Dynamically load the weather widget script
    if (isClient) {
      setPlay(true);
      if (!widgetLoaded) {
        const script = document.createElement('script');
        script.src = "https://www.klart.se/widget/widget_loader/420cee0ee12535cd2a922993c70ebd2e";
        script.async = true;
        script.onload = () => setWidgetLoaded(true);
        document.body.appendChild(script);
      }
    }

    setTimeout(() => { routeChangedSignal.dispatch('home'); }, 100);
  }, [isClient, widgetLoaded]);

  const props = {
    startStyle: { opacity: 0 },
    endStyle: { opacity: 1 }
  };

  const getScript = (source, callback) => {
    const script = document.createElement('script');
    const prior = document.getElementsByTagName('script')[0];
    script.async = true;
    script.onload = script.onreadystatechange = (_, isAbort) => {
      if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
        script.onload = script.onreadystatechange = null;
        if (!isAbort && callback) callback();
      }
    };
    script.src = source;
    prior.parentNode.insertBefore(script, prior);
  };

  const weatherWidget = isClient ? (
    <WidgetFrame fn={() => getScript("https://www.klart.se/widget/widget_loader/420cee0ee12535cd2a922993c70ebd2e", () => { })}>
      <div className="row">
        <div id="c_420cee0ee12535cd2a922993c70ebd2e" className="center-block widget" />
      </div>
    </WidgetFrame>
  ) : (
    <WidgetFrame fn={null}>
      <div className="row">
        <div id="c_420cee0ee12535cd2a922993c70ebd2e" className="center-block widget" />
      </div>
    </WidgetFrame>
  );

  const animatedImage = isClient ? (
    <Animate play={play} durationSeconds={3} {...props}>
      <AnimateKeyframes
        play={play}
        iterationCount={10}
        durationSeconds={0.2}
        keyframes={[
          "transform: rotate(0)",
          "transform: rotate(360deg)"
        ]}
      >
        <AnimateKeyframes
          play={play}
          iterationCount="1"
          direction="alternate"
          durationSeconds={2}
          keyframes={[
            'transform: scaleX(0.05) scaleY(0.05)',
            'transform: scaleX(0.1) scaleY(0.1)',
            'transform: scaleX(0.15) scaleY(0.15)',
            'transform: scaleX(0.2) scaleY(0.2)',
            'transform: scaleX(0.25) scaleY(0.25)',
            'transform: scaleX(0.3) scaleY(0.3)',
            'transform: scaleX(0.35) scaleY(0.35)',
            'transform: scaleX(0.4) scaleY(0.4)',
            'transform: scaleX(0.45) scaleY(0.45)',
            'transform: scaleX(0.5) scaleY(0.5)',
            'transform: scaleX(0.55) scaleY(0.55)',
            'transform: scaleX(0.6) scaleY(0.6)',
            'transform: scaleX(0.65) scaleY(0.65)',
            'transform: scaleX(0.7) scaleY(0.7)',
            'transform: scaleX(0.75) scaleY(0.75)',
            'transform: scaleX(0.8) scaleY(0.8)',
            'transform: scaleX(0.85) scaleY(0.85)',
            'transform: scaleX(0.9) scaleY(0.9)',
            'transform: scaleX(1) scaleY(1)'
          ]}
        >
          <PhotoFrame>
            <Link to={`/details/0/0/-?${rand}`}>
              <img onLoad={() => setPlay(true)} src={`/Handler/Index/PhotoID=0/Size=M?${rand}`} alt="" style={{ border: "4px solid white", maxHeight: "100%", maxWidth: "100%", verticalAlign: "middle" }} />
            </Link>
          </PhotoFrame>
        </AnimateKeyframes>
      </AnimateKeyframes>
    </Animate>
  ) : (
    <PhotoFrame hidden>
      <Link to="/">
        <img src={''} alt="" style={{ border: "4px solid white", maxHeight: "100%", maxWidth: "100%", verticalAlign: "middle" }} />
      </Link>
    </PhotoFrame>
  );

  return (
    <div className="container">
      <div className="row">
        <div className="row-height">
          <div className=" col-md-3 hidden-md hidden-sm hidden-xs col-md-height col-md-top custom-vertical-left-border custom-vertical-right-border grey-background">
            <div className="row">
              <div className="col-md-12">
                <h4 />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="panel panel-primary center-block">
                  <div className="panel-heading text-center">
                    <h3 className="panel-title">Today's photo</h3>
                  </div>
                  <div className="panel-body">
                    <div className="row text-center">
                      <div className="col-md-12" id="divSwirl">
                        {animatedImage}
                      </div>
                    </div>
                    <div className="row text-center">
                      <hr />
                      <div id="divText" style={{ minHeight: '60px' }}>Photos</div>
                      <div id="divDownload" style={{ minHeight: '50px' }}>
                        <p>
                          <a href="/Handler/Download/0/M">
                            <img src="./Content/images/button-download.gif" alt="download photo" />
                          </a>
                        </p>
                        <hr />
                        <p>
                          See <Link to="/albums">more photos</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="divContact" style={{ minHeight: '90px' }}>
                  <Animate play={play} durationSeconds={3} {...props} delaySeconds={1}>
                    <h4>Contact information</h4>
                    <p>
                      &nbsp;&nbsp;<span className="glyphicon glyphicon-phone-alt" style={{ color: "gray" }} />&nbsp;010-123 456
                    </p>
                    <p>
                      <img src={epostJpg} alt="epost" className="img-responsive" />
                    </p>
                  </Animate>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="panel panel-primary">
                      <div className="panel-heading">
                        <h3 className="panel-title text-center">Today's weather</h3>
                      </div>
                      <div className="panel-body panel-height_small">
                        <div id="divWeather" style={{ verticalAlign: "textTop" }}>
                          <Animate play={play} durationSeconds={3} delaySeconds={2.1} {...props}>
                            {weatherWidget}
                          </Animate>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-9 col-md-height">
            <div className="row">
              <div className="col-md-12">
                <h4 />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h3 className="panel-title">Panel 1</h3>
                  </div>
                  <div className="panel-body">
                    Welcome to React Homapge
                    <div>
                      <center>Don't hesitate to contact me at 010-123 456</center>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h3 className="panel-title">Panel 2</h3>
                  </div>
                  <div className="panel-body">
                    Some text...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
