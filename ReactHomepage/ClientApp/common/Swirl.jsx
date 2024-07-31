import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../../wwwroot/Scripts/jquery-ui';
import '../../wwwroot/Scripts/ui/jquery.ui.core';
import '../../wwwroot/Scripts/ui/jquery.ui.effect-swirl';
import '../../wwwroot/Content/jquery-ui.css';

const Swirl = (props) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    doSwirl();
    renderDialogContent();

    // Indicate that the component has mounted
    setHasMounted(true);

    // This useEffect replaces both componentDidMount and componentWillReceiveProps
    // Empty dependency array ensures it runs only once on mount
  }, []);

  useEffect(() => {
    if (hasMounted) {
      doSwirl();
      renderDialogContent(props);
    }
  }, [props]);

  const runAnimate = () => {
    $("#divWeather").css("visibility", "visible").hide().animate({ height: "show" }, 2000, 'easeOutBounce');
  }

  const ShowText = (selector, callback) => {
    $(selector).css("visibility", "visible").hide().fadeIn(1000, callback);
  }

  const doSwirl = () => {
    const node = ReactDOM.findDOMNode(this);
    const swirl = $("#divSwirl");
    const txt = $("#divText");
    const download = $("#divDownload");
    const contact = $("#divContact");
    const weather = $("#divWeather");

    swirl.css("visibility", "visible").hide();
    txt.css("visibility", "hidden").show();
    download.css("visibility", "hidden").show();
    contact.css("visibility", "hidden").show();
    weather.css("visibility", "hidden").show();

    swirl.toggle("swirl", { spins: 6 }, 1500, () => {
      ShowText("#divText", () => {
        ShowText("#divDownload", () => {
          ShowText("#divContact", runAnimate);
        });
      });
    });
  }

  const renderDialogContent = (props = {}) => {
    ReactDOM.render(<div>{props.children}</div>, ReactDOM.findDOMNode(this));
  }

  return <div />;
}

export default Swirl;
