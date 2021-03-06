﻿import React, { Component } from 'react';
import { getUsers } from '../actions';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
// import { push } from 'react-router-redux';
import { Link } from 'react-router';
import InputRange from 'react-input-range';
import Select from 'react-select';

import RadioButton from '../components/RadioButton/RadioButton';
import PreViewCv from '../components/CV/PreViewCv';


class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dustbins: [],
      valueCost: { min: 1000, max: 3000 },
      groupExperienceYear: 1,
      filterData: [],
      filterDataTitle: [],
      filterDataSkills: [],
      isUseFiler: false,
      value: '',
      suggestions: [],
      multi: true,
      sidebar: false,
      multiValue: [],
      multiValueTitle: [],
      multiValueSkills: [],
      isShowSkillsFilter: false,
    };
  }

  static propTypes = {
    getUsers: React.PropTypes.func,
    push: React.PropTypes.func,
    data: React.PropTypes.object,
  };
  filterDataTitle() {
    const { data } = this.props.data;
    const { isShowSkillsFilter, multiValueSkills, multiValueTitle } = this.state;
    const multiValue = isShowSkillsFilter ? multiValueSkills : multiValueTitle;
    /* const dataFilterTitle = data.filter((item) => {
      return value ? value === item.title : item;
    });*/
    const dataFilterTitleOrSkill = [];
    data.map(dataCV => {
      const title = dataCV.title;
      let found = false;
      if (dataCV.skills) {
        dataCV.skills.map(skill => {
          if (skill.main) {
            // mainSkills.push(skill.skill)
            multiValue.map(item => {
              if (item.value === skill.skill) {
                found = true;
                dataFilterTitleOrSkill.push(dataCV);
              }
              return null;
            });
          }
          return null;
        });
      } else if (!found) {
        multiValue.map(item => {
          if (item.value === title) {
            found = true;
            dataFilterTitleOrSkill.push(dataCV);
          }
          return null;
        });
      }
      return null;
    });

    this.setState({ isUseFiler: true });
    this.filterDataCost(dataFilterTitleOrSkill);
  }
  filterDataCost(dataFilterTitle) {
    const { valueCost } = this.state;
    const dataFilterCost = dataFilterTitle.filter((item) => {
      const cost = parseInt(item.cost, 10);
      return cost > valueCost.min && cost < valueCost.max;
    });

    this.setState({ isUseFiler: true });
    this.filterDataExperience(dataFilterCost);
  }
  filterDataExperience(dataFilterCost) {
    const group = this.state.groupExperienceYear;
    const dataFilterExperience = dataFilterCost.filter((item) => {
      const exp = parseInt(item.experience, 10);
      return exp >= (group * 3 - 3) && exp <= group * 3;
    });
    this.setState({ filterData: dataFilterExperience, clearFilter: false });
  }
  filterClear() {
    this.setState({
      clearFilter: true,
      filterData: [],
      isUseFiler: false,
      value: '',
      multiValue: [],
      valueCost: { min: 1000, max: 3000 },
      sideBar: true,
    });
  }
  goToAdmin() {
    this.props.push('/DashBoard');
  }
  goToMainFilter() {
    this.props.push('/FilterPage');
  }
  handleOnChange(valueSelect) {
    const { multi } = this.state;
    if (multi) {
      this.setState({ multiValue: valueSelect });
    } else {
      // this.setState({ valueSelect });
    }
  }
  handleOnChangeTitle(valueSelect) {
    const { multi } = this.state;
    if (multi) {
      this.setState({ multiValueTitle: valueSelect });
      this.filterDataJustTitle(valueSelect);
    } else {
      // this.setState({ valueSelect });
    }
  }
  filterDataJustTitle(valueSelect) {
    const { data } = this.props.data;
    const dataFilterTitle = [];
    data.map(dataCV => {
      const title = dataCV.title;
      valueSelect.map(item => {
        if (item.value === title) {
          // found = true;
          dataFilterTitle.push(dataCV);
        }
        return null;
      });
      return null;
    });
    this.setState({ filterDataTitle: dataFilterTitle });
   // this.filterDataCost(dataFilterTitleOrSkill);
  }

  handleOnChangeSkills(valueSelect) {
    const { multi } = this.state;
    if (multi) {
      this.setState({ multiValueSkills: valueSelect });
      this.filterDataJustSkills(valueSelect);
    } else {
      // this.setState({ valueSelect });
    }
  }
  filterDataJustSkills(valueSelect) {
    const { data } = this.props.data;
    const dataFilterSkills = [];
    data.map(dataCV => {
      let found = false;
      if (dataCV.skills) {
        dataCV.skills.map(skill => {
          if (skill.main) {
            // mainSkills.push(skill.skill)
            valueSelect.map(item => {
              if (item.value === skill.skill) {
                found = true;
                dataFilterSkills.push(dataCV);
              }
              return null;
            });
          }
          return null;
        });
      }
      return null;
    });
    this.setState({ filterDataSkills: dataFilterSkills });
    // this.filterDataCost(dataFilterTitleOrSkill);
  }
  renderDustbins() {
    const { isShowSkillsFilter, filterDataSkills,
      filterData, multiValueTitle, filterDataTitle, isUseFiler, sidebar } = this.state;

    const { data, application } = this.props.data;
    if (this.props.data.data) {
      let dataSel;
      if (!sidebar && !isShowSkillsFilter) {
        dataSel = filterDataTitle;
      } else if (!sidebar && isShowSkillsFilter) {
        dataSel = filterDataSkills;
      } else if (sidebar) {
        dataSel = filterDataSkills;
      }
    }
    if (this.props.data.data) {
      let dataSel;
      if (!sidebar && !isShowSkillsFilter) {
        dataSel = filterDataTitle.length === 0 ? data : filterDataTitle;
      } else if (!sidebar && isShowSkillsFilter) {
        dataSel = filterDataSkills.length === 0 ? data : filterDataSkills;
      } else if (sidebar) {
        if (filterData.length > 0) {
          dataSel = filterData;
        } else if (!isShowSkillsFilter) {
          dataSel = filterDataTitle;
        } else if (isShowSkillsFilter) {
          dataSel = filterDataSkills;
        } else {
          dataSel = data;
        }
      }
      return dataSel.map((item, i) => {
        return (
          <Link key={`task-${i}`} to={`/task/${item.id}`}>
            <PreViewCv
              item={item}
              key={i}
              isAdminPanel={application}
              onClick={::this.goToMainFilter}

              /* onDelete={this.deleteTask.bind(this, item.id)}*/
            />
          </Link>
        );
      });
    }
    return null;
  }
  renderSearchTitle() {
    const { optionsTitle } = this.props.data;

    const { isShowSkillsFilter, multi, multiValueTitle } = this.state;
    return (
      <div className="search-wr-inside">
        <Select
          multi={multi}
          options={optionsTitle}
          onChange={::this.handleOnChangeTitle}
          value={multiValueTitle}
          disabled={isShowSkillsFilter}
          placeholder={"Select Titles..."}
        />
        <div
          className="filter-btn"
          onClick={() => {
            return this.setState({
              isShowSkillsFilter: !this.state.isShowSkillsFilter,
            });
          }}
        >
          <span>Skills filter</span>
        </div>
        <div className="search-btn">
          <span><i className="fa fa-search" aria-hidden="true" /></span>
        </div>
      </div>
    );
  }
  renderSearchSkills() {
    const { options } = this.props.data;
    const { multiValueSkills, multi } = this.state;
    return (
      <div className="search-wr-inside">
        <Select
          multi={multi}
          options={options}
          // onChange={::this.handleOnChange}
          onChange={::this.handleOnChangeSkills}
          value={multiValueSkills}
          placeholder={"Select Skills..."}
        />
        <div className="search-btn">
          <span><i className="fa fa-search" aria-hidden="true" /></span>
        </div>
      </div>
    );
  }
  render() {
    const { filterData, isUseFiler } = this.state;
    return (
      <div className={'page filter-page columns'}>
        <div className="dashboard-wr filter-page">
          <div className="header-wr">
            <div className="header">
              <div className="header-fiq">
                <span>? FIQ</span>
              </div>
              <div className="header-title">
                <h4
                  onClick={() => { return this.setState({ sidebar: !this.state.sidebar }); }}
                >Header</h4>
              </div>
              <div className="header-contact">
                <span>contact us <i className="fa fa-envelope-o" aria-hidden="true" /></span>
              </div>
            </div>

            <div className="search-wr">
              {
                this.state.sidebar && this.state.isShowSkillsFilter ? null : this.renderSearchTitle()
              }
              
              {
                this.state.isShowSkillsFilter && (
                  this.renderSearchSkills()
                )
              }
            </div>
          </div>
          <div className="inside-wr">
            <div className={`left-filter ${this.state.sidebar ? '' : 'hidden'}`}>
              <div className="range-filter">
                <h4>Monthly budget</h4>
                <InputRange
                  maxValue={5000}
                  minValue={500}
                  value={this.state.valueCost}
                  onChange={valueCost => { return this.setState({ valueCost }); }}
                />
                <div className="filter-cost">
                  <span>from: {`$${this.state.valueCost.min}`}</span>
                  <span>to: {`$${this.state.valueCost.max}`}</span>
                </div>
              </div>
              <div className="experience-year">
                <h4>Years experience</h4>
                <RadioButton
                  fieldName={"experience"}
                  value={this.state.isMain}
                  id={'radio-1'}
                  label={'1-3'}
                  name={'radio-group'}
                  type={'radio'}
                  defaultChecked={'checked'}
                  onChange={() => {
                    this.setState({
                      groupExperienceYear: 1,
                    });
                  }}
                  /* errorText={this.showError('isMain')}*/
                />
                <RadioButton
                  fieldName={"experience"}
                  value={this.state.isMain}
                  id={'radio-2'}
                  label={'4-6'}
                  name={'radio-group'}
                  type={'radio'}
                  onChange={() => {
                    this.setState({
                      groupExperienceYear: 2,
                    });
                  }}
                  /* errorText={this.showError('isMain')}*/
                />
                <RadioButton
                  fieldName={"experience"}
                  value={this.state.isMain}
                  id={'radio-3'}
                  label={'6-9'}
                  name={'radio-group'}
                  type={'radio'}
                  onChange={() => {
                    this.setState({
                      groupExperienceYear: 3,
                    });
                  }}
                />
                <RadioButton
                  fieldName={"experience"}
                  value={this.state.isMain}
                  id={'radio-4'}
                  label={'больше 9'}
                  name={'radio-group'}
                  type={'radio'}
                  onChange={() => {
                    this.setState({
                      groupExperienceYear: 4,
                    });
                  }}
                  /* errorText={this.showError('isMain')}*/
                />
              </div>
              <div className="bottom-control">
                <div className="clear" onClick={::this.filterClear}>
                  <span>
                    <i className="fa fa-times-circle-o" aria-hidden="true" />
                    clear filter
                  </span>
                </div>
                <div className="total-filter" onClick={::this.filterDataTitle}>
                  <span>show-result</span>
                </div>
              </div>
            </div>
            <div className="lists-wr">
              {this.renderDustbins()}
              {
                !(filterData.length > 0) && isUseFiler && (
                  <p>change filter, please</p>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const ConnectedComponent = connect(
  (state) => {
    return { data: state.data };
  },
  {
    push, getUsers,
  }
)(MainPage);

export default ConnectedComponent;
