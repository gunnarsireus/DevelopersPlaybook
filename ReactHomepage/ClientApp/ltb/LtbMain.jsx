import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { routeChangedSignal } from '../Frame';
import Input from '../common/Input';
import Radios from '../common/Radios';
import { format, addDays } from 'date-fns';
import Datepicker from '../common/Datepicker';
import { Row, Col, Button } from 'react-bootstrap';
import Select from '../common/Select';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Result from './Result';
import ltbCalculationPrincipal from '../../wwwroot/content/images/LtbCalculationPrincipal.jpg';
import * as apiClient from "../helpers/ApiHelpers";
import Chart from './Chart';

class LtbMain extends Component {
  constructor(props) {
    super(props);
    let firstYear = parseInt(format(new Date(), 'yyyy-MM-dd').substring(0, 4));
    this.state = {
      year1: (firstYear + 1).toString(),
      year2: (firstYear + 2).toString(),
      year3: (firstYear + 3).toString(),
      year4: (firstYear + 4).toString(),
      year5: (firstYear + 5).toString(),
      year6: (firstYear + 6).toString(),
      year7: (firstYear + 7).toString(),
      year8: (firstYear + 8).toString(),
      year9: (firstYear + 9).toString(),
      chartEnabled: false,
      total: "",
      safety: "",
      stock: "",
      failed: "",
      repaired: "",
      lost: "",
      infoText: "Select Life Time Buy and End Of Service dates, enter parameter values ​​and press 'Calculate'.",
      inputError: false,
      sampleData: [],
      showProgress: false,
      collapsed: true,
      servicedays: "3652",
      confidence: "60",
      repairLeadTime: "2",
      repairPossible: false,
      mtbfSelected: true,
      LTBDate: new Date(),
      EOSDate: addDays(new Date(), 3652),
      IB0: '9',
      IB1: '9',
      IB2: '9',
      IB3: '9',
      IB4: '9',
      IB5: '9',
      IB6: '9',
      IB7: '9',
      IB8: '9',
      IB9: '9',
      IB10: 'EoS',
      FR0: '1',
      FR1: '1',
      FR2: '1',
      FR3: '1',
      FR4: '1',
      FR5: '1',
      FR6: '1',
      FR7: '1',
      FR8: '1',
      FR9: '1',
      RS0: '1',
      RS1: '1',
      RS2: '1',
      RS3: '1',
      RS4: '1',
      RS5: '1',
      RS6: '1',
      RS7: '1',
      RS8: '1',
      RS9: '1',
      RL0: '100',
      RL1: '100',
      RL2: '100',
      RL3: '100',
      RL4: '100',
      RL5: '100',
      RL6: '100',
      RL7: '100',
      RL8: '100',
      RL9: '100',
      IB1ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB1Disabled: false,
      IB2ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB2Disabled: false,
      IB3ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB3Disabled: false,
      IB4ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB4Disabled: false,
      IB5ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB5Disabled: false,
      IB6ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB6Disabled: false,
      IB7ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB7Disabled: false,
      IB8ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB8Disabled: false,
      IB9ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB9Disabled: false,
      IB10Disabled: true,
      FR1Disabled: false,
      FR2Disabled: false,
      FR3Disabled: false,
      FR4Disabled: false,
      FR5Disabled: false,
      FR6Disabled: false,
      FR7Disabled: false,
      FR8Disabled: false,
      FR9Disabled: false,
      RS1Disabled: false,
      RS2Disabled: false,
      RS3Disabled: false,
      RS4Disabled: false,
      RS5Disabled: false,
      RS6Disabled: false,
      RS7Disabled: false,
      RS8Disabled: false,
      RS9Disabled: false,
      RL0Disabled: true,
      RL1Disabled: true,
      RL2Disabled: true,
      RL3Disabled: true,
      RL4Disabled: true,
      RL5Disabled: true,
      RL6Disabled: true,
      RL7Disabled: true,
      RL8Disabled: true,
      RL9Disabled: true
    };
    this.getResult = this.getResult.bind(this);
    this.ltbClear = this.ltbClear.bind(this);
    this.collapse = this.collapse.bind(this);
    this.setRepair = this.setRepair.bind(this);
    this.setNoRepair = this.setNoRepair.bind(this);
    this.setMtbf = this.setMtbf.bind(this);
    this.setNoMtbf = this.setNoMtbf.bind(this);
    this.checkIB = this.checkIB.bind(this);
    this.checkFR = this.checkFR.bind(this);
    this.checkRL = this.checkRL.bind(this);
    this.checkRS = this.checkRS.bind(this);
    this.checkRepairLeadTime = this.checkRepairLeadTime.bind(this);
    this.handleLTBChange = this.handleLTBChange.bind(this);
    this.handleEOSChange = this.handleEOSChange.bind(this);
    this.dropDownChanged = this.dropDownChanged.bind(this);
    this.siteHideProgress = this.siteHideProgress.bind(this);
    this.siteShowProgress = this.siteShowProgress.bind(this);
    this.setInputStateToDefault = this.setInputStateToDefault.bind(this);
    this.updateChartAndResult = this.updateChartAndResult.bind(this);
    this.updateYears = this.updateYears.bind(this);
  }

  async componentDidMount() {
    this.props.history.push('/ltb');
    setTimeout(() => { routeChangedSignal.dispatch('ltb'); }, 100);
    this.ltbClear();
  }

  updateYears(LtbDate) {
    const firstYear = parseInt(format(LtbDate, 'yyyy-MM-dd').substring(0, 4));
    this.setState({
      year1: (firstYear + 1).toString(),
      year2: (firstYear + 2).toString(),
      year3: (firstYear + 3).toString(),
      year4: (firstYear + 4).toString(),
      year5: (firstYear + 5).toString(),
      year6: (firstYear + 6).toString(),
      year7: (firstYear + 7).toString(),
      year8: (firstYear + 8).toString(),
      year9: (firstYear + 9).toString()
    });
  }

  dropDownChanged(val) {
    this.setState({
      confidence: val.newValue
    });
    this.ltbClear();
  }

  handleLTBChange(ltbDate) {
    this.setState({
      LTBDate: ltbDate
    });
    this.fetchDateChanged('api/ltb/datechanged', format(ltbDate, 'yyyy-MM-dd'), format(this.state.EOSDate, 'yyyy-MM-dd'));
    this.updateYears(ltbDate);
  }

  handleEOSChange(eosDate) {
    this.setState({
      EOSDate: eosDate
    });
    this.fetchDateChanged('api/ltb/datechanged', format(this.state.LTBDate, 'yyyy-MM-dd'), format(eosDate, 'yyyy-MM-dd'));
  }

  checkIB(event, cancelAlert) {
    const re = new RegExp("^([0]|[1-9][0-9]{0,4}|EoS)$");
    if (!re.test(event.target.value)) {
      if (!cancelAlert) { alert('Installed base must be within 0 and 99999!'); }
      return false;
    } else {
      switch (event.target.id) {
        case 'IB0':
          this.setState({
            IB0: event.target.value
          });
          break;
        case 'IB1':
          this.setState({
            IB1: event.target.value
          });
          break;
        case 'IB2':
          this.setState({
            IB2: event.target.value
          });
          break;
        case 'IB3':
          this.setState({
            IB3: event.target.value
          });
          break;
        case 'IB4':
          this.setState({
            IB4: event.target.value
          });
          break;
        case 'IB5':
          this.setState({
            IB5: event.target.value
          });
          break;
        case 'IB6':
          this.setState({
            IB6: event.target.value
          });
          break;
        case 'IB7':
          this.setState({
            IB7: event.target.value
          });
          break;
        case 'IB8':
          this.setState({
            IB8: event.target.value
          });
          break;
        case 'IB9':
          this.setState({
            IB9: event.target.value
          });
          break;
        default:
          break;

      }
      return true;
    }
  }

  checkFR(event, cancelAlert) {
    if (this.state.mtbfSelected) {
      const re = new RegExp("^([1-9]|[0-9][,][0-9]{0,1}[1-9]|[1,9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9]|100000)$");
      if (!re.test(event.target.value)) {
        if (!cancelAlert) { alert('MTBF must be between 0.01 and 100000!'); }
        return false;
      }
    } else {
      const re = new RegExp("^([0][,]|[1-9]|[1-9][0-9]|100|[0-9][,][0-9]{0,4}[1-9])$");
      if (!re.test(event.target.value)) {
        if (!cancelAlert) { alert('Failure Rate must be between 0,00001 and 100!'); }
        return false;
      }
    }
    switch (event.target.id) {
      case 'FR0':
        this.setState({
          FR0: event.target.value
        });
        break;
      case 'FR1':
        this.setState({
          FR1: event.target.value
        });
        break;
      case 'FR2':
        this.setState({
          FR2: event.target.value
        });
        break;
      case 'FR3':
        this.setState({
          FR3: event.target.value
        });
        break;
      case 'FR4':
        this.setState({
          FR4: event.target.value
        });
        break;
      case 'FR5':
        this.setState({
          FR5: event.target.value
        });
        break;
      case 'FR6':
        this.setState({
          FR6: event.target.value
        });
        break;
      case 'FR7':
        this.setState({
          FR7: event.target.value
        });
        break;
      case 'FR8':
        this.setState({
          FR8: event.target.value
        });
        break;
      case 'FR9':
        this.setState({
          FR9: event.target.value
        });
        break;
      default:
        break;
    }
    return true;
  }

  checkRS(event, cancelAlert) {
    const re = new RegExp("^([0]|[1-9][0-9]{0,4}|EoS)$");
    if (!re.test(event.target.value)) {
      if (!cancelAlert) { alert('Number of Regional stocks must be between 0 and 9999!'); }
      return false;
    } else {
      switch (event.target.id) {
        case 'RS0':
          this.setState({
            RS0: event.target.value
          });
          break;
        case 'RS1':
          this.setState({
            RS1: event.target.value
          });
          break;
        case 'RS2':
          this.setState({
            RS2: event.target.value
          });
          break;
        case 'RS3':
          this.setState({
            RS3: event.target.value
          });
          break;
        case 'RS4':
          this.setState({
            RS4: event.target.value
          });
          break;
        case 'RS5':
          this.setState({
            RS5: event.target.value
          });
          break;
        case 'RS6':
          this.setState({
            RS6: event.target.value
          });
          break;
        case 'RS7':
          this.setState({
            RS7: event.target.value
          });
          break;
        case 'RS8':
          this.setState({
            RS8: event.target.value
          });
          break;
        case 'RS9':
          this.setState({
            RS9: event.target.value
          });
          break;
        default:
          break;

      }
      return true;
    }
  }

  checkRL(event, cancelAlert) {
    const re = new RegExp("^([0]|[1-9]|[1-9][0-9]|100)$");
    if (!re.test(event.target.value)) {
      if (!cancelAlert) { alert('Repair loss must be between 0 and 100%!'); }
      return false;
    } else {
      switch (event.target.id) {
        case 'RL0':
          this.setState({
            RL0: event.target.value
          });
          break;
        case 'RL1':
          this.setState({
            RL1: event.target.value
          });
          break;
        case 'RL2':
          this.setState({
            RL2: event.target.value
          });
          break;
        case 'RL3':
          this.setState({
            RL3: event.target.value
          });
          break;
        case 'RL4':
          this.setState({
            RL4: event.target.value
          });
          break;
        case 'RL5':
          this.setState({
            RL5: event.target.value
          });
          break;
        case 'RL6':
          this.setState({
            RL6: event.target.value
          });
          break;
        case 'RL7':
          this.setState({
            RL7: event.target.value
          });
          break;
        case 'RL8':
          this.setState({
            RL8: event.target.value
          });
          break;
        case 'RL9':
          this.setState({
            RL9: event.target.value
          });
          break;
        default:
          break;

      }
      return true;
    }
  }

  checkRepairLeadTime(event, cancelAlert) {
    const num = parseInt(event.target.value);
    if (num === 'NaN') {
      if (!cancelAlert) { alert('Rep. lead time must be an integer greater than 1 and less than 366!'); }
      return false;
    }
    if (num >= 2 && num <= 365) {
      this.setState({ chartEnabled: false, repairLeadTime: num.toString() });
      return true;
    }

    if (!cancelAlert) { alert('2 <= Rep. lead time <=365!'); }
    return false;
  }

  siteShowProgress() {
    this.setState({ showProgress: true });
  }

  siteHideProgress() {
    this.setState({ showProgress: false });
  }

  getInput(LTBDate, EOSDate, repairPossible) {

    return {
      confidence: this.state.confidence,
      repairLeadTime: this.state.repairLeadTime,
      repairPossible: repairPossible === undefined ? this.state.repairPossible : repairPossible,
      mtbfSelected: this.state.mtbfSelected,
      LTBDate: LTBDate === undefined ? format(this.state.LTBDate, 'yyyy-MM-dd') : LTBDate,
      EOSDate: EOSDate === undefined ? format(this.state.EOSDate, 'yyyy-MM-dd') : EOSDate,
      IB0: this.state.IB0,
      IB1: this.state.IB1,
      IB2: this.state.IB2,
      IB3: this.state.IB3,
      IB4: this.state.IB4,
      IB5: this.state.IB5,
      IB6: this.state.IB6,
      IB7: this.state.IB7,
      IB8: this.state.IB8,
      IB9: this.state.IB9,
      IB10: this.state.IB10,
      FR0: this.state.FR0,
      FR1: this.state.FR1,
      FR2: this.state.FR2,
      FR3: this.state.FR3,
      FR4: this.state.FR4,
      FR5: this.state.FR5,
      FR6: this.state.FR6,
      FR7: this.state.FR7,
      FR8: this.state.FR8,
      FR9: this.state.FR9,
      RS0: this.state.RS0,
      RS1: this.state.RS1,
      RS2: this.state.RS2,
      RS3: this.state.RS3,
      RS4: this.state.RS4,
      RS5: this.state.RS5,
      RS6: this.state.RS6,
      RS7: this.state.RS7,
      RS8: this.state.RS8,
      RS9: this.state.RS9,
      RL0: this.state.RL0,
      RL1: this.state.RL1,
      RL2: this.state.RL2,
      RL3: this.state.RL3,
      RL4: this.state.RL4,
      RL5: this.state.RL5,
      RL6: this.state.RL6,
      RL7: this.state.RL7,
      RL8: this.state.RL8,
      RL9: this.state.RL9
    };
  }

  updateChartAndResult(response, dateChanged) {
    let sData = [];
    let firstYear = parseInt(format(this.state.LTBDate, 'yyyy-MM-dd').substring(0, 4));

    for (let i = 0; i < response.stocksPerYear.length - 1; i++) {
      const sampleLine = { Year: "", Regionalstock: "", Stock: "", Safety: "" };
      sampleLine['Year'] = (firstYear + i).toString();
      sampleLine['Regionalstock'] = dateChanged ? "0" : response.regionalStocksPerYear[i];
      sampleLine['Stock'] = dateChanged ? "0" : response.stocksPerYear[i];
      sampleLine['Safety'] = dateChanged ? "0" : response.safetyPerYear[i];
      sData = [...sData, sampleLine];
    }
    this.setState({
      total: response.total,
      safety: response.safety,
      stock: response.stock,
      failed: response.failed,
      repaired: response.repaired,
      lost: response.lost,
      infoText: response.infoText,
      servicedays: response.serviceDays.toString(),
      sampleData: sData
    }, () => {
      this.setState({ chartEnabled: true })
      setTimeout(() => { this.setState({ chartEnabled: false }) }, 500);
    });
  }

  async fetchCalculate(url) {
    this.setState({
      chartEnabled: true,
      total: '',
      safety: '',
      stock: '',
      failed: '',
      repaired: '',
      lost: ''
    });

    await apiClient.postHelper(url, this.getInput()).then((response) => {
      if (response.inputError) {
        this.ltbClear();
        this.setState({
          infoText: response.infoText
        });
        alert(response.infoText);
      } else {
        this.updateChartAndResult(response);
        this.setState({
          infoText: response.infoText
        });
      }
      this.siteHideProgress();
    }).catch((response) => {
      alert('Ingen kontakt med server: ', response);
      this.siteHideProgress();
    });
  }

  async fetchDateChanged(url, LTBDate, EOSDate) {
    this.setState({ chartEnabled: true });
    await apiClient.postHelper(url, this.getInput(LTBDate, EOSDate)).then((response) => {
      if (response.InputError) {
        this.setState({
          infoText: response.infoText
        });
        alert(response.infoText);
      } else {
        this.updateChartAndResult(response, true);
        this.setState({
          mtbfSelected: response.MtbfSelected,
          repairPossible: response.RepairPossible,
          IB0: response.iB0,
          IB1: response.iB1,
          IB2: response.iB2,
          IB3: response.iB3,
          IB4: response.iB4,
          IB5: response.iB5,
          IB6: response.iB6,
          IB7: response.iB7,
          IB8: response.iB8,
          IB9: response.iB9,
          IB10: response.iB10,
          FR0: response.fR0,
          FR1: response.fR1,
          FR2: response.fR2,
          FR3: response.fR3,
          FR4: response.fR4,
          FR5: response.fR5,
          FR6: response.fR6,
          FR7: response.fR7,
          FR8: response.fR8,
          FR9: response.fR9,
          RS0: response.rS0,
          RS1: response.rS1,
          RS2: response.rS2,
          RS3: response.rS3,
          RS4: response.rS4,
          RS5: response.rS5,
          RS6: response.rS6,
          RS7: response.rS7,
          RS8: response.rS8,
          RS9: response.rS9,
          RL0: response.rL0,
          RL1: response.rL1,
          RL2: response.rL2,
          RL3: response.rL3,
          RL4: response.rL4,
          RL5: response.rL5,
          RL6: response.rL6,
          RL7: response.rL7,
          RL8: response.rL8,
          RL9: response.rL9,
          servicedays: response.serviceDays.toString(),
          IB1ForeColor: response.iB1ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB1Disabled: response.iB1Disabled,
          IB2ForeColor: response.iB2ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB2Disabled: response.IiB2Disabled,
          IB3ForeColor: response.iB3ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB3Disabled: response.iB3Disabled,
          IB4ForeColor: response.iB4ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB4Disabled: response.iB4Disabled,
          IB5ForeColor: response.iB5ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB5Disabled: response.iB5Disabled,
          IB6ForeColor: response.iB6ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB6Disabled: response.iB6Disabled,
          IB7ForeColor: response.iB7ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB7Disabled: response.iB7Disabled,
          IB8ForeColor: response.iB8ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB8Disabled: response.iB8Disabled,
          IB9ForeColor: response.iB9ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB9Disabled: response.iB9Disabled,
          IB10Disabled: true,
          FR1Disabled: response.fR1Disabled,
          FR2Disabled: response.fR2Disabled,
          FR3Disabled: response.fR3Disabled,
          FR4Disabled: response.fR4Disabled,
          FR5Disabled: response.fR5Disabled,
          FR6Disabled: response.fR6Disabled,
          FR7Disabled: response.fR7Disabled,
          FR8Disabled: response.fR8Disabled,
          FR9Disabled: response.fR9Disabled,
          RS1Disabled: response.rS1Disabled,
          RS2Disabled: response.rS2Disabled,
          RS3Disabled: response.rS3Disabled,
          RS4Disabled: response.rS4Disabled,
          RS5Disabled: response.rS5Disabled,
          RS6Disabled: response.rS6Disabled,
          RS7Disabled: response.rS7Disabled,
          RS8Disabled: response.rS8Disabled,
          RS9Disabled: response.rS9Disabled,
          RL0Disabled: response.rL0Disabled,
          RL1Disabled: response.rL1Disabled,
          RL2Disabled: response.rL2Disabled,
          RL3Disabled: response.rL3Disabled,
          RL4Disabled: response.rL4Disabled,
          RL5Disabled: response.rL5Disabled,
          RL6Disabled: response.rL6Disabled,
          RL7Disabled: response.rL7Disabled,
          RL8Disabled: response.rL8Disabled,
          RL9Disabled: response.rL9Disabled
        });
      }
    }).catch((response) => {
      alert('Ingen kontakt med server: ', response);
    });
  }

  async fetchRepairPossibleChanged(url, repairPossible) {
    this.setState({ chartEnabled: true });
    await apiClient.postHelper(url, this.getInput(this.state.LTBDate, this.state.EOSDate, repairPossible)).then((response) => {
      if (response.InputError) {
        this.setState({
          infoText: response.infoText
        });
        alert(response.infoText);
      } else {
        this.updateChartAndResult(response, true);
        this.setState({
          mtbfSelected: response.mtbfSelected,
          repairPossible: response.repairPossible,
          IB0: response.iB0,
          IB1: response.iB1,
          IB2: response.iB2,
          IB3: response.iB3,
          IB4: response.iB4,
          IB5: response.iB5,
          IB6: response.iB6,
          IB7: response.iB7,
          IB8: response.iB8,
          IB9: response.iB9,
          IB10: response.iB10,
          FR0: response.fR0,
          FR1: response.fR1,
          FR2: response.fR2,
          FR3: response.fR3,
          FR4: response.fR4,
          FR5: response.fR5,
          FR6: response.fR6,
          FR7: response.fR7,
          FR8: response.fR8,
          FR9: response.fR9,
          RS0: response.rS0,
          RS1: response.rS1,
          RS2: response.rS2,
          RS3: response.rS3,
          RS4: response.rS4,
          RS5: response.rS5,
          RS6: response.rS6,
          RS7: response.rS7,
          RS8: response.rS8,
          RS9: response.rS9,
          RL0: response.rL0,
          RL1: response.rL1,
          RL2: response.rL2,
          RL3: response.rL3,
          RL4: response.rL4,
          RL5: response.rL5,
          RL6: response.rL6,
          RL7: response.rL7,
          RL8: response.rL8,
          RL9: response.rL9,
          servicedays: response.serviceDays.toString(),
          IB1ForeColor: response.iB1ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB1Disabled: response.iB1Disabled,
          IB2ForeColor: response.iB2ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB2Disabled: response.iB2Disabled,
          IB3ForeColor: response.iB3ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB3Disabled: response.iB3Disabled,
          IB4ForeColor: response.iB4ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB4Disabled: response.iB4Disabled,
          IB5ForeColor: response.iB5ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB5Disabled: response.iB5Disabled,
          IB6ForeColor: response.iB6ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB6Disabled: response.iB6Disabled,
          IB7ForeColor: response.iB7ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB7Disabled: response.iB7Disabled,
          IB8ForeColor: response.iB8ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB8Disabled: response.iB8Disabled,
          IB9ForeColor: response.iB9ForeColor + ' col-xs-3 col-md-3 col-sm-3 BorderInset',
          IB9Disabled: response.iB9Disabled,
          IB10Disabled: true,
          FR1Disabled: response.fR1Disabled,
          FR2Disabled: response.fR2Disabled,
          FR3Disabled: response.fR3Disabled,
          FR4Disabled: response.fR4Disabled,
          FR5Disabled: response.fR5Disabled,
          FR6Disabled: response.fR6Disabled,
          FR7Disabled: response.fR7Disabled,
          FR8Disabled: response.fR8Disabled,
          FR9Disabled: response.fR9Disabled,
          RS1Disabled: response.rS1Disabled,
          RS2Disabled: response.rS2Disabled,
          RS3Disabled: response.rS3Disabled,
          RS4Disabled: response.rS4Disabled,
          RS5Disabled: response.rS5Disabled,
          RS6Disabled: response.rS6Disabled,
          RS7Disabled: response.rS7Disabled,
          RS8Disabled: response.rS8Disabled,
          RS9Disabled: response.rS9Disabled,
          RL0Disabled: response.rL0Disabled,
          RL1Disabled: response.rL1Disabled,
          RL2Disabled: response.rL2Disabled,
          RL3Disabled: response.rL3Disabled,
          RL4Disabled: response.rL4Disabled,
          RL5Disabled: response.rL5Disabled,
          RL6Disabled: response.rL6Disabled,
          RL7Disabled: response.rL7Disabled,
          RL8Disabled: response.rL8Disabled,
          RL9Disabled: response.rL9Disabled
        });
      }
    }).catch((response) => {
      alert('Ingen kontakt med server: ', response);
    });
  }

  async getResult() {
    this.siteShowProgress();
    await this.fetchCalculate('api/ltb/calculate');
  }

  setInputStateToDefault() {
    this.setState({
      LTBDate: new Date(),
      EOSDate: addDays(new Date(), 3652),
      IB0: '9',
      IB1: '9',
      IB2: '9',
      IB3: '9',
      IB4: '9',
      IB5: '9',
      IB6: '9',
      IB7: '9',
      IB8: '9',
      IB9: '9',
      IB10: 'EoS',
      FR0: '1',
      FR1: '1',
      FR2: '1',
      FR3: '1',
      FR4: '1',
      FR5: '1',
      FR6: '1',
      FR7: '1',
      FR8: '1',
      FR9: '1',
      RS0: '1',
      RS1: '1',
      RS2: '1',
      RS3: '1',
      RS4: '1',
      RS5: '1',
      RS6: '1',
      RS7: '1',
      RS8: '1',
      RS9: '1',
      RL0: '100',
      RL1: '100',
      RL2: '100',
      RL3: '100',
      RL4: '100',
      RL5: '100',
      RL6: '100',
      RL7: '100',
      RL8: '100',
      RL9: '100',
      IB1ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB1Disabled: false,
      IB2ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB2Disabled: false,
      IB3ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB3Disabled: false,
      IB4ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB4Disabled: false,
      IB5ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB5Disabled: false,
      IB6ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB6Disabled: false,
      IB7ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB7Disabled: false,
      IB8ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB8Disabled: false,
      IB9ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
      IB9Disabled: false,
      IB10Disabled: true,
      FR1Disabled: false,
      FR2Disabled: false,
      FR3Disabled: false,
      FR4Disabled: false,
      FR5Disabled: false,
      FR6Disabled: false,
      FR7Disabled: false,
      FR8Disabled: false,
      FR9Disabled: false,
      RS1Disabled: false,
      RS2Disabled: false,
      RS3Disabled: false,
      RS4Disabled: false,
      RS5Disabled: false,
      RS6Disabled: false,
      RS7Disabled: false,
      RS8Disabled: false,
      RS9Disabled: false,
      RL0Disabled: true,
      RL1Disabled: true,
      RL2Disabled: true,
      RL3Disabled: true,
      RL4Disabled: true,
      RL5Disabled: true,
      RL6Disabled: true,
      RL7Disabled: true,
      RL8Disabled: true,
      RL9Disabled: true
    });
    this.updateYears(new Date());
  }

  async ltbClear() {
    this.setState({
      LTBDate: new Date(),
      EOSDate: addDays(new Date(), 3652)
    });
    this.updateYears(new Date());
    this.fetchDateChanged('api/ltb/datechanged', format(new Date(), 'yyyy-MM-dd'), format(addDays(new Date(), 3652), 'yyyy-MM-dd'));
  }

  collapse() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  async setRepair() {
    this.setState({
      chartEnabled: false,
      repairPossible: true,
      repairLeadTime: "40"
    });
    await this.fetchRepairPossibleChanged('api/ltb/datechanged', true);
  }

  async setNoRepair() {
    this.setState({
      chartEnabled: false,
      repairPossible: false,
      repairLeadTime: "2"
    });
    await this.fetchRepairPossibleChanged('ap/ltb/datechanged', false);
  }

  setMtbf() {
    this.setState({
      chartEnabled: false,
      mtbfSelected: true
    });
  }

  setNoMtbf() {
    this.setState({
      chartEnabled: false,
      mtbfSelected: false
    });
  }

  render() {
    const instructiontext = this.state.collapsed ? null :
      (<Col md={12} key={'textShown'}>
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h3 className="panel-title">Dimensioning of LTB stocks</h3>
          </div>
          <Row>
            <Col md={12}>
              <h4 />
            </Col>
          </Row>
          <Row>
            <Col md={9} sm={9} xs={9} />
            <Col md={3} sm={3} xs={3}>
              <Row>
                <Col md={9} sm={9} xs={9}>
                  <Button className="btn btn-info pull-right" onClick={(e) => { e.preventDefault(); this.collapse(); }}>Hide text</Button>
                </Col>
                <Col md={3} sm={3} xs={3} />
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <h4 />
            </Col>
          </Row>
          <div>
            <p>
              The size of a spare parts inventory after "End of Production" should be kept to a minimum to save costs, but not too low to be able to provide spare parts throughout the Service Period. As long as the production of spare parts is ongoing, the warehouse is replenished with parts from the factory. If it is possible to repair defective parts, repaired parts can also be reused as spare parts. When production has ceased, it is no longer possible to order spare parts from the factory. There is then a need to secure spare parts for the remaining warranty period or Service Period. The Service Period begins with "Life Time Buy", LTB, and lasts until "End of Service", EOS. LTB is the last day for ordering spare parts from the factory. Sizing of spare parts inventory is based on the Poisson distribution. The Poisson distribution is described in <a href="http://en.wikipedia.org/wiki/Poisson_distribution">Poisson Distribution</a>.
            </p>
          </div>
          <br />
          <h4 className="AlignLeft">
            <strong>The algorithm</strong>
          </h4>
          <div>
            <p className="first">
              With this  <strong><em>unique</em></strong>  algorithm, the installed base IB, the failure rate FR, the number of regional stocks and repair losses can vary arbitrarily during the Service Period. The repair loss is the proportion of units sent for repair where the repair fails. If spare parts are not repaired, the repair loss = 100%. The algorithm is based on dynamic programming where the calculation starts at EOS, i.e. the last day of the Service Period where the required stock level is known and equal to the number of regional stocks. This is because each regional warehouse must always have at least one spare part in stock in order to meet the requirement of a maximum two-hour delivery time from the regional warehouse to the customer. From EOS, the algorithm counts backwards up to LTB to get the inventory level sought. The repair lead time LD, measured in days, is the waiting time from when the part is sent to the workshop until it is returned. The turnover inventory is the inventory level required during the "Repair Lead Time" and is calculated as follows::
            </p>
            <p>
              <strong>Turnover inventory=IB*FR*LD/365 + Safety margin. </strong>The first part of the equation,<strong> IB*FR*LD/365</strong>, is the average consumption during the Repair Lead Time. The Poisson distribution is used to calculate the margin of safety for the confidence levels 60% - 99,5%.<br /><br /><strong>Failure Rate</strong> relates to <strong>Mean Time Between Failure, MTBF</strong>, as follows: <strong>FR = 1/MTBF.</strong>
              <br />
              <br />
              <strong>Implementation (in principle)</strong>
            </p>
            <p>
              <img src={ltbCalculationPrincipal} alt="Ltb algoritm" />
            </p>
          </div>
          <h4 className="AlignLeft">
            <strong>Parameters</strong>
          </h4>
          <div>
            <p className="first" style={{ fontSize: 'small' }}>
              <strong>Parameters applicable for the entire Service Period</strong>
            </p>
          </div>
          <ul>
            <li><strong>Life Time Buy:</strong> Last day for ordering spare parts from the factory.</li>
            <li><strong>End of Service:</strong> The last day of the Service Period.</li>
            <li> <strong>Confidence level:</strong> Example: 95% confidence level means that the probability that the warehouse will be empty before the EoS is 5%</li>
            <li><strong>Repair lead time:</strong> Time in days from the moment a spare part is sent for repair until it is returned.</li>
          </ul>
          <div>
            <p className="style8">
              <strong>Parameters for each year during the Service Period</strong>
            </p>
          </div>
          <ul>
            <li><strong>Installed Base: </strong> Installed base in network per year.</li>
            <li><strong>Number of regional stocks:</strong> The number of regional warehouses in the service network. Each regional warehouse must always have at least one spare part to meet the requirement of a maximum 2-hour delivery time from a regional warehouse to the customer. Therefore, the number of regional stocks constitutes a minimum stock level at EoS.</li>
            <li><strong>Failure Rate: </strong> Average number of errors per year. <strong>FR= 1/MTBF.</strong></li>
            <li><strong>Repair losses: </strong> The proportion of parts sent for repair where the repair fails.</li>
          </ul>
        </div>
      </Col>);

    let setRepairList = [{ radioNumber: 0, radioText: "Ja", onClick: this.setRepair }, { radioNumber: 1, radioText: "Nej", onClick: this.setNoRepair }];
    let setMtbfList = [
      { radioNumber: 0, radioText: "MTBF", onClick: this.setMtbf },
      { radioNumber: 1, radioText: "FR", onClick: this.setNoMtbf }
    ];
    return (<div className="container">
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
                <h4>Dimensioning of LTB stocks</h4>
              </Col>
            </Row>
          </Col>
          <Col md={9} className="col-md-height">
            <Row>
              <Col md={12}>
                <h4 />
              </Col>
            </Row>
            <Row>
              <TransitionGroup>
                <CSSTransition key={'instructiontext'} classNames="example" timeout={{ enter: 500, exit: 500 }}>
                  {instructiontext || <br />}
                </CSSTransition>
              </TransitionGroup>
              <Col md={12} sm={12}>
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h3 className="panel-title">Perform calcaulation</h3>
                  </div>
                  <Row>
                    <Col md={1} sm={1} xs={1} />
                    <Col md={4} sm={4} xs={4}>
                      <Row>
                        <Col md={4} sm={4} className="text-left">
                          <Button className="btn btn-info pull-left" onClick={this.getResult} >Calculate</Button>
                        </Col>
                        <Col className="col-md-8 col-sm-8 text-left" />
                      </Row>
                    </Col>
                    <Col md={4} sm={4} xs={4}>
                      <Row>
                        <Col className="col-md-12 col-sm-12 text-left">
                          <Button className="btn btn-info pull-left" value="Sudda" onClick={this.ltbClear} >Erase</Button>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={3} sm={3} xs={3}>
                      <Row>
                        <Col className="col-md-9 col-sm-9">
                          <Button className="btn btn-info pull-right" onClick={(e) => { e.preventDefault(); this.collapse(); }}>{this.state.collapsed ? 'Show text' : 'Hide text'}</Button>
                        </Col>
                        <Col md={3} sm={3} />
                      </Row>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Result showProgress={this.state.showProgress}
                    total={this.state.total}
                    safety={this.state.safety}
                    stock={this.state.stock}
                    failed={this.state.failed}
                    repaired={this.state.repaired}
                    lost={this.state.lost}
                    infoText={this.state.infoText}
                    servicedays={this.state.servicedays}
                  />
                  <div>
                    <div className="panel panel-primary">
                      <div className="panel-heading">
                        <h3 className="panel-title">Length&nbsp;of&nbsp;Service&nbsp;Period</h3>
                      </div>
                      <Row>
                        <Col md={3} sm={3} xs={3}>
                          <Row>
                            <Col md={4} sm={4} xs={4} />
                            <Col md={8} sm={8} xs={8} className="text-danger BorderOutset">Life&nbsp;Time&nbsp;Buy:</Col>
                          </Row>
                        </Col>
                        <Col md={2} sm={2} xs={2}>
                          <Row>
                            <Datepicker onDateChanged={this.handleLTBChange} startDate={this.state.LTBDate} className={'col-xs-8 col-md-8 col-sm-8  text-danger input-sm BorderInset'} />
                          </Row>
                        </Col>
                        <Col md={3} sm={3} xs={3}>
                          <Row>
                            <Col md={4} sm={4} xs={4} />
                            <Col md={8} sm={8} xs={8} className="text-danger BorderOutset">End&nbsp;Of&nbsp;Service:</Col>
                          </Row>
                        </Col>
                        <Col md={4} sm={4} xs={4}>
                          <Row>
                            <Datepicker onDateChanged={this.handleEOSChange} startDate={this.state.EOSDate} className={'col-xs-8 col-md-8 col-sm-8  text-danger input-sm BorderInset'} />
                          </Row>
                        </Col>
                      </Row>
                    </div>
                    <div className="panel panel-primary">
                      <div className="panel-heading">
                        <h3 className="panel-title">Input data for the entire Service Period</h3>
                      </div>
                      <Row>
                        <Col md={6} sm={6} xs={6}>
                          <Row>
                            <Col md={12} sm={12}>
                              <p>&nbsp;</p>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6} sm={6} xs={6}>
                              <Row>
                                <Col md={2} sm={2} xs={2} />
                                <Col md={10} sm={10} xs={10} className="text-success BorderOutset">Confidence level:</Col>
                              </Row>
                            </Col>
                            <Col md={6} sm={6} xs={6}>
                              <Row>
                                <Col md={8} sm={8} xs={8} className="text-success BorderInset">
                                  <Select className={''}
                                    id={'ConfidenceLevels'}
                                    value={this.state.confidence}
                                    options={this.props.options}
                                    onChange={this.dropDownChanged}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6} sm={6} xs={6}>
                              <Row>
                                <Col md={2} sm={2} xs={2} />
                                <Col md={10} sm={10} xs={10} className="text-success BorderOutset">Rep.&nbsp;lead&nbsp;time&nbsp;[2-365]:</Col>
                              </Row>
                            </Col>
                            <Col md={6} sm={6} xs={6}>
                              <Row>
                                <div className="col-xs-8 col-md-8 col-sm-8 text-success text-center BorderInset" ref={(el) => {
                                  if (el) {
                                    el.style.setProperty('padding-left', '20px', 'important');
                                  }
                                }}>
                                  <Input checkError={this.checkRepairLeadTime} className="col-xs-9 col-md-9 col-sm-9" maxLength={3} type="text" value={this.state.repairLeadTime.toString()} disabled={!this.state.repairPossible} />
                                </div>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6} sm={6} xs={6}>
                              <Row>
                                <Col md={2} sm={2} xs={2} />
                                <Col md={10} sm={10} xs={10} className="text-success BorderOutset">Repair&nbsp;possible?</Col>
                              </Row>
                            </Col>
                            <Col md={6} sm={6} xs={6}>
                              <Row>
                                <Col md={8} sm={8} xs={8} className="text-success BorderInset pl-5">
                                  <Radios getRadios={setRepairList} radioChecked={this.state.repairPossible ? 0 : 1} name={'repairRadio'} className="ml-5"/>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6} sm={6} xs={6}>
                              <Row>
                                <Col md={2} sm={2} xs={2} />
                                <Col md={10} sm={10} xs={10} className="text-success BorderOutset">MTBF&nbsp;or&nbsp;Failure&nbsp;Rate?</Col>
                              </Row>
                            </Col>
                            <Col md={6} sm={6} xs={6}>
                              <Row>
                                <Col md={8} sm={8} xs={8} className="text-success BorderInset pl-5">
                                  <Radios getRadios={setMtbfList} radioChecked={this.state.mtbfSelected ? 0 : 1} name={'mtbfRadio'} className="ml-5"/>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        <Col md={6} sm={6} xs={6} className="text-left">
                          <Chart sampleData={this.state.sampleData} update={this.state.chartEnabled} />
                        </Col>
                      </Row>
                    </div>
                    <div className="panel panel-primary">
                      <div className="panel-heading">
                        <h3 className="panel-title">Input data for each year during the Service Period</h3>
                      </div>
                      <Row>
                        <Col md={3} className="hidden-sm hidden-xs" />
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Col className="col-xs-3 col-md-3 col-sm-3 BorderOutset red40">LTB</Col>
                            <Col className="col-xs-3 col-md-3 col-sm-3 BorderOutset">{this.state.year1}</Col>
                            <Col className="col-xs-3 col-md-3 col-sm-3 BorderOutset">{this.state.year2}</Col>
                            <Col className="col-xs-3 col-md-3 col-sm-3 BorderOutset">{this.state.year3}</Col>
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Col className="col-xs-3 col-md-3 col-sm-3 BorderOutset">{this.state.year4}</Col>
                            <Col className="col-xs-3 col-md-3 col-sm-3 BorderOutset">{this.state.year5}</Col>
                            <Col className="col-xs-3 col-md-3 col-sm-3 BorderOutset">{this.state.year6}</Col>
                            <Col className="col-xs-3 col-md-3 col-sm-3 BorderOutset">{this.state.year7}</Col>
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Col className="col-xs-3 col-md-3 col-sm-3 BorderOutset">{this.state.year8}</Col>
                            <Col className="col-xs-3 col-md-3 col-sm-3 BorderOutset">{this.state.year9}</Col>
                            <Col className="col-md-6" />
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="hidden-sm hidden-xs col-md-3">
                          <Row>
                            <Col md={2} sm={2} xs={2} />
                            <Col className="col-xs-10 col-md-10 col-sm-10 BorderOutset">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Installed&nbsp;Base&nbsp;[0&nbsp;-&nbsp;99999]:</Col>
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Input checkError={this.checkIB} className="col-xs-3 col-md-3 col-sm-3 BorderInset black40" type={'text'} value={this.state.IB0} maxLength={5} id={'IB0'} tabIndex={1} placeholder={'IB0'} />
                            <Input checkError={this.checkIB} className={this.state.IB1ForeColor} type={'text'} value={this.state.IB1} maxLength={5} id={'IB1'} disabled={this.state.IB1Disabled} tabIndex={2} />
                            <Input checkError={this.checkIB} className={this.state.IB2ForeColor} type={'text'} value={this.state.IB2} maxLength={5} id={'IB2'} disabled={this.state.IB2Disabled} tabIndex={3} />
                            <Input checkError={this.checkIB} className={this.state.IB3ForeColor} type={'text'} value={this.state.IB3} maxLength={5} id={'IB3'} disabled={this.state.IB3Disabled} tabIndex={4} />
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Input checkError={this.checkIB} className={this.state.IB4ForeColor} type={'text'} value={this.state.IB4} maxLength={5} id={'IB4'} disabled={this.state.IB4Disabled} tabIndex={5} />
                            <Input checkError={this.checkIB} className={this.state.IB5ForeColor} type={'text'} value={this.state.IB5} maxLength={5} id={'IB5'} disabled={this.state.IB5Disabled} tabIndex={6} />
                            <Input checkError={this.checkIB} className={this.state.IB6ForeColor} type={'text'} value={this.state.IB6} maxLength={5} id={'IB6'} disabled={this.state.IB6Disabled} tabIndex={7} />
                            <Input checkError={this.checkIB} className={this.state.IB7ForeColor} type={'text'} value={this.state.IB7} maxLength={5} id={'IB7'} disabled={this.state.IB7Disabled} tabIndex={8} />
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Input checkError={this.checkIB} className={this.state.IB8ForeColor} type={'text'} value={this.state.IB8} maxLength={5} id={'IB8'} disabled={this.state.IB8Disabled} tabIndex={9} />
                            <Input checkError={this.checkIB} className={this.state.IB9ForeColor} type={'text'} value={this.state.IB9} maxLength={5} id={'IB9'} disabled={this.state.IB9Disabled} tabIndex={10} />
                            <Input className="col-xs-3 col-md-3 col-sm-3 BorderInset red40" type={'text'} value={this.state.IB10} maxLength={5} id={'IB10'} disabled={true} />
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="hidden-sm hidden-xs col-md-3">
                          <Row>
                            <Col md={2} sm={2} xs={2} />
                            <div id="divFR" className={this.state.mtbfSelected ? 'hidden' : 'col-xs-10 col-md-10 col-sm-10 BorderOutset'}>Failure&nbsp;Rate&nbsp;[0,00001&nbsp;-&nbsp;100]:</div>
                            <div id="divMTBF" className={!this.state.mtbfSelected ? 'hidden' : 'col-xs-10 col-md-10 col-sm-10 BorderOutset'}>&nbsp;MTBF&nbsp;[0,01&nbsp;-&nbsp;100000]:</div>
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Input checkError={this.checkFR} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.FR0} maxLength={7} id={'FR0'} tabIndex={11} placeholder={'MTBF0'} />
                            <Input checkError={this.checkFR} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.FR1} maxLength={7} id={'FR1'} disabled={this.state.FR1Disabled} tabIndex={12} />
                            <Input checkError={this.checkFR} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.FR2} maxLength={7} id={'FR2'} disabled={this.state.FR2Disabled} tabIndex={13} />
                            <Input checkError={this.checkFR} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.FR3} maxLength={7} id={'FR3'} disabled={this.state.FR3Disabled} tabIndex={14} />
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Input checkError={this.checkFR} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.FR4} maxLength={7} id={'FR4'} disabled={this.state.FR4Disabled} tabIndex={15} />
                            <Input checkError={this.checkFR} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.FR5} maxLength={7} id={'FR5'} disabled={this.state.FR5Disabled} tabIndex={16} />
                            <Input checkError={this.checkFR} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.FR6} maxLength={7} id={'FR6'} disabled={this.state.FR6Disabled} tabIndex={17} />
                            <Input checkError={this.checkFR} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.FR7} maxLength={7} id={'FR7'} disabled={this.state.FR7Disabled} tabIndex={18} />
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Input checkError={this.checkFR} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.FR8} maxLength={7} id={'FR8'} disabled={this.state.FR8Disabled} tabIndex={19} />
                            <Input checkError={this.checkFR} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.FR9} maxLength={7} id={'FR9'} disabled={this.state.FR9Disabled} tabIndex={20} />
                            <Col md={3} sm={3} xs={3} />
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={3} className="hidden-sm hidden-xs">
                          <Row>
                            <Col md={2} sm={2} xs={2} />
                            <Col className="col-xs-10 col-md-10 col-sm-10 BorderOutset text-nowrap">Regional&nbsp;Stocks&nbsp;[0&nbsp;-&nbsp;9999]:</Col>
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Input checkError={this.checkRS} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RS0} maxLength={4} id={'RS0'} tabIndex={20} placeholder={'RS0'} />
                            <Input checkError={this.checkRS} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RS1} maxLength={4} id={'RS1'} disabled={this.state.RS1Disabled} tabIndex={21} />
                            <Input checkError={this.checkRS} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RS2} maxLength={4} id={'RS2'} disabled={this.state.RS2Disabled} tabIndex={22} />
                            <Input checkError={this.checkRS} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RS3} maxLength={4} id={'RS3'} disabled={this.state.RS3Disabled} tabIndex={23} />
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Input checkError={this.checkRS} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RS4} maxLength={4} id={'RS4'} disabled={this.state.RS4Disabled} tabIndex={24} />
                            <Input checkError={this.checkRS} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RS5} maxLength={4} id={'RS5'} disabled={this.state.RS5Disabled} tabIndex={25} />
                            <Input checkError={this.checkRS} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RS6} maxLength={4} id={'RS6'} disabled={this.state.RS6Disabled} tabIndex={26} />
                            <Input checkError={this.checkRS} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RS7} maxLength={4} id={'RS7'} disabled={this.state.RS7Disabled} tabIndex={27} />
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Input checkError={this.checkRS} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RS8} maxLength={4} id={'RS8'} disabled={this.state.RS8Disabled} tabIndex={28} />
                            <Input checkError={this.checkRS} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RS9} maxLength={4} id={'RS9'} disabled={this.state.RS9Disabled} tabIndex={29} />
                            <Col md={3} sm={3} xs={3} />
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={3} className="hidden-sm hidden-xs">
                          <Row>
                            <Col md={2} sm={2} xs={2} />
                            <Col className="col-xs-10 col-md-10 col-sm-10 BorderOutset">Repair losses [0 - 100%]:</Col>
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Input checkError={this.checkRL} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RL0} maxLength={4} id={'RL0'} disabled={this.state.RL0Disabled} tabIndex={29} />
                            <Input checkError={this.checkRL} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RL1} maxLength={4} id={'RL1'} disabled={this.state.RL1Disabled} tabIndex={30} />
                            <Input checkError={this.checkRL} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RL2} maxLength={4} id={'RL2'} disabled={this.state.RL2Disabled} tabIndex={31} />
                            <Input checkError={this.checkRL} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RL3} maxLength={4} id={'RL3'} disabled={this.state.RL3Disabled} tabIndex={32} />
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Input checkError={this.checkRL} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RL4} maxLength={4} id={'RL4'} disabled={this.state.RL4Disabled} tabIndex={33} />
                            <Input checkError={this.checkRL} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RL5} maxLength={4} id={'RL5'} disabled={this.state.RL5Disabled} tabIndex={34} />
                            <Input checkError={this.checkRL} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RL6} maxLength={4} id={'RL6'} disabled={this.state.RL6Disabled} tabIndex={35} />
                            <Input checkError={this.checkRL} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RL7} maxLength={4} id={'RL7'} disabled={this.state.RL7Disabled} tabIndex={36} />
                          </Row>
                        </Col>
                        <Col md={3} sm={4} xs={4}>
                          <Row>
                            <Input checkError={this.checkRL} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RL8} maxLength={4} id={'RL8'} disabled={this.state.RL8Disabled} tabIndex={37} />
                            <Input checkError={this.checkRL} className="col-xs-3 col-md-3 col-sm-3 BorderInset" type={'text'} value={this.state.RL9} maxLength={4} id={'RL9'} disabled={this.state.RL9Disabled} tabIndex={38} />
                            <Col md={3} sm={3} xs={3} />
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Col>
      </Row>
    </div>);
  }
}


LtbMain.defaultProps = {
  year1: '',
  year2: '',
  year3: '',
  year4: '',
  year5: '',
  year6: '',
  year7: '',
  year8: '',
  year9: '',
  sampleData: [
    { Year: 'År0', Regionalstock: 0, Stock: 0, Safety: 0 },
    { Year: 'År1', Regionalstock: 0, Stock: 0, Safety: 0 },
    { Year: 'År2', Regionalstock: 0, Stock: 0, Safety: 0 },
    { Year: 'År3', Regionalstock: 0, Stock: 0, Safety: 0 },
    { Year: 'År4', Regionalstock: 0, Stock: 0, Safety: 0 },
    { Year: 'År5', Regionalstock: 0, Stock: 0, Safety: 0 },
    { Year: 'År6', Regionalstock: 0, Stock: 0, Safety: 0 },
    { Year: 'År7', Regionalstock: 0, Stock: 0, Safety: 0 },
    { Year: 'År8', Regionalstock: 0, Stock: 0, Safety: 0 },
    { Year: 'År9', Regionalstock: 0, Stock: 0, Safety: 0 }
  ],
  showProgress: false,
  chartEnabled: false,
  collapsed: true,
  total: '',
  safety: '',
  stock: '',
  failed: '',
  repaired: '',
  lost: '',
  infoText: "Select Life Time Buy and End Of Service dates, enter parameter values ​​and press 'Calculate'",
  servicedays: '3652',
  confidence: '60',
  repairLeadTime: '40',
  repairPossible: false,
  mtbfSelected: true,
  LTBDate: new Date(),
  EOSDate: new addDays(new Date(), 3652),
  IB0: '9',
  IB1: '9',
  IB2: '9',
  IB3: '9',
  IB4: '9',
  IB5: '9',
  IB6: '9',
  IB7: '9',
  IB8: '9',
  IB9: '9',
  IB10: 'EoS',
  FR0: '1',
  FR1: '1',
  FR2: '1',
  FR3: '1',
  FR4: '1',
  FR5: '1',
  FR6: '1',
  FR7: '1',
  FR8: '1',
  FR9: '1',
  RS0: '1',
  RS1: '1',
  RS2: '1',
  RS3: '1',
  RS4: '1',
  RS5: '1',
  RS6: '1',
  RS7: '1',
  RS8: '1',
  RS9: '1',
  RL0: '100',
  RL1: '100',
  RL2: '100',
  RL3: '100',
  RL4: '100',
  RL5: '100',
  RL6: '100',
  RL7: '100',
  RL8: '100',
  RL9: '100',
  IB1ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
  IB1Disabled: false,
  IB2ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
  IB2Disabled: false,
  IB3ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
  IB3Disabled: false,
  IB4ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
  IB4Disabled: false,
  IB5ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
  IB5Disabled: false,
  IB6ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
  IB6Disabled: false,
  IB7ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
  IB7Disabled: false,
  IB8ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
  IB8Disabled: false,
  IB9ForeColor: 'col-xs-3 col-md-3 col-sm-3 BorderInset black40',
  IB9Disabled: false,
  IB10Disabled: true,
  FR1Disabled: false,
  FR2Disabled: false,
  FR3Disabled: false,
  FR4Disabled: false,
  FR5Disabled: false,
  FR6Disabled: false,
  FR7Disabled: false,
  FR8Disabled: false,
  FR9Disabled: false,
  RS1Disabled: false,
  RS2Disabled: false,
  RS3Disabled: false,
  RS4Disabled: false,
  RS5Disabled: false,
  RS6Disabled: false,
  RS7Disabled: false,
  RS8Disabled: false,
  RS9Disabled: false,
  RL0Disabled: true,
  RL1Disabled: true,
  RL2Disabled: true,
  RL3Disabled: true,
  RL4Disabled: true,
  RL5Disabled: true,
  RL6Disabled: true,
  RL7Disabled: true,
  RL8Disabled: true,
  RL9Disabled: true,
  options: [{ value: '60', label: '60%' },
  { value: '70', label: '70%' },
  { value: '80', label: '80%' },
  { value: '90', label: '90%' },
  { value: '95', label: '95%' },
  { value: '995', label: '99,5%' }
  ]
};
export default withRouter(LtbMain);
