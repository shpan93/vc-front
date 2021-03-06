import React from 'react';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import { push } from 'react-router-redux';

import TextField from '../TextField/TextField';
import TextArea from '../TextArea/TextArea';
import CheckBox from '../CheckBox/CheckBox';
import { updateUser, getUsers, createUser } from '../../actions';

class createCV extends React.Component {
  static propTypes = {
    currentTask: React.PropTypes.object,
    buttonText: React.PropTypes.string,
    editTask: React.PropTypes.func,
    getUsers: React.PropTypes.func,
    updateUser: React.PropTypes.func,
    createCv: React.PropTypes.func,
    createUser: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    const defaultValues = {
      address: 'Kiev, Kyiv city, Ukraine',
      title: '',
      username: '',
      cost: '',
      inHouse: true,
      experience: '',
      daysToDate: 1,
      originalDate: nextDay,
      skillsChange: false,
      skills: [],
      works: [],
      summary: [],
      image: '',
      fileName: '',
    };
    this.defaultState = {
      values: this.props.currentTask || defaultValues,
      touched: {
        title: false,
        cost: false,
        experience: false,
        username: false,
        /*image: false,*/
      },
      errorMessages: {
        title: 'Title is required',
        username: 'User name is required',
        cost: 'Cost is required',
        experience: 'Experience is required',
        image: 'Image is required',
        skillExp: 'skillExp is required',
      },
      validation: {
        title: (value) => {
          return value.length > 0;
        },
        username: (value) => {
          return value.length > 0;
        },
        cost: (value) => {
          return value.length > 0;
        },
        experience: (value) => {
          return value.length > 0;
        },
        image: (value) => {
          return value.length > 0;
         // return true;
        },
      },
      skillName: '',
      skillExp: '',
      isMain: false,

      workName: '',
      workDescription: '',

      managerName: '',
      cvSummary: '',
    };
    this.state = this.defaultState;
  }

  createCv(values) {
    const dateObject = new Date();
    const date = dateFormat(dateObject, 'dddd, mmmm dS');
    const currentTime = new Date().getTime();

    return {
      inHouse: this.state.inHouse,
      ...values,
      date,
      id: currentTime,
    };
  }
  handleInputChange(target, e) {
    this.updateValue(target, e.target.value.toString());
  }
  updateValue(target, value) {
    if (target === 'skillName' || target === 'skillExp') {
      this.setState({
        ...this.state,
        [target]: value,
      });
    } else if (target === 'workName' || target === 'workDescription') {
      this.setState({
        ...this.state,
        [target]: value,
      });
    } else if (target === 'managerName' || target === 'cvSummary') {
      this.setState({
        ...this.state,
        [target]: value,
      });
    } else {
      this.setState({
        values: {
          ...this.state.values,
          [target]: value,
        },
      });
    }
  }
  handleCheckBoxInHouse(value) {
    this.setState({
      values: {
        ...this.state.values,
        inHouse: value,
      },
    });
  }
  handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('upload_form'));
    formData.append('tax_file', document.getElementById('file-input').files);
    // console.log('formData', formData);
    // const submitHandler = this.props.currentTask ? this.props.updateUser : this.props.createUser;
    let submitHandler;
    if (this.props.currentTask) {
      this.props.push('/admin');
      submitHandler = this.props.updateUser;
    } else {
      submitHandler = this.props.createUser;
    }
    const task = this.createCv(this.state.values);

    if (this.props.currentTask) {
      task.id = this.props.currentTask.id;
    }

    // submitHandler(formData);
    submitHandler(task);
    const skills = this.props.currentTask;
    const works = this.props.currentTask;
    const summary = this.props.currentTask;
    this.defaultState.values.skills = skills ? skills.skills : [];
    this.defaultState.values.works = works ? works.works : [];
    this.defaultState.values.summary = summary ? summary.summary : [];
    this.setState(this.defaultState);
  }
  isValidForm() {
    const validations = Object.keys(this.state.validation).filter(field => {
      return !this.state.validation[field](this.state.values[field]);
    });
    // console.log('validations', validations)
    return (validations.length === 0);
    // return ([].length === 0);
  }
  showError(target) {
    if (this.state.touched[target]) {
      if (!this.state.validation[target](this.state.values[target])) {
        return this.state.errorMessages[target];
      }
    }

    return null;
  }

  handleInputBlur(target) {
    this.setState({
      touched: {
        ...this.state.touched,
        [target]: true,
      },
    });
  }
  addSkill() {
    const skill = this.state.skillName;
    const experience = this.state.skillExp;
    const main = this.state.isMain;
    const newSkills = this.state.values.skills;
    newSkills.push({ skill, experience, main });
    this.setState({
      skillExp: '',
      skillName: '',
      values: {
        ...this.state.values,
        skills: newSkills,
        skillsChange: true,
      },
    });
  }
  deleteSkill(skillId) {
    const skills = this.state.values.skills;
    /* const newSkills = [];
    skills.map((item, i) => {
      i === skillId ? null : newSkills.push(item);
    })*/
    const newSkills = skills.filter((item, i) => {
      return i !== skillId;
    });
    this.setState({
      values: {
        ...this.state.values,
        skills: newSkills,
        skillsChange: true,
      },
    });
  }
  addWork() {
    const work = this.state.workName;
    const workDescription = this.state.workDescription;
    const newWorks = this.state.values.works;
    newWorks.push({ work, workDescription });
    this.setState({
      workName: '',
      workDescription: '',
      values: {
        ...this.state.values,
        works: newWorks,
        worksChange: true,
      },
    });
  }
  deleteWork(skillId) {
    const works = this.state.values.works;
    /* const newSkills = [];
     skills.map((item, i) => {
     i === skillId ? null : newSkills.push(item);
     })*/
    const newWorks = works.filter((item, i) => {
      return i !== skillId;
    });
    this.setState({
      values: {
        ...this.state.values,
        works: newWorks,
        worksChange: true,
      },
    });
  }
  addSummary() {
    const managerName = this.state.managerName;
    const cvSummary = this.state.cvSummary;
    const summaryArr = this.state.values.summary;
    summaryArr.push({ managerName, cvSummary });
    this.setState({
      managerName: '',
      cvSummary: '',
      values: {
        ...this.state.values,
        summary: summaryArr,
        summaryChange: true,
      },
    });
  }
  deleteSummary(skillId) {
    const cvSummary = this.state.values.summary;
    const summaryArr = cvSummary.filter((item, i) => {
      return i !== skillId;
    });
    this.setState({
      values: {
        ...this.state.values,
        summary: summaryArr,
        summaryChange: true,
      },
    });
  }
  onDropHandler(target, e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      this.setState({
        image: event.target.result,
        fileName: file.name,
        values: {
          ...this.state.values,
          image: event.target.result,
          fileName: file.name,
        },
      });
    };
    /* this.setState({
      image: file,
      fileName: file.name,
      values: {
        ...this.state.values,
        image: file,
        fileName: file.name,
      },
    });*/
    reader.readAsDataURL(file);
  }
  renderCreateSkill() {
    return (
      <div className="add-skill">
        <TextField
          classNameBox={'input-wr'}
          placeholder={'Enter skill'}
          value={this.state.skillName}
          fieldName="skillName"
          maxLength="25"
          onChange={::this.handleInputChange}
          onBlur={::this.handleInputBlur}
        />
        <TextField
          classNameBox={'input-wr'}
          placeholder={'Enter skill experience'}
          value={this.state.skillExp}
          fieldName="skillExp"
          maxLength="25"
          onChange={::this.handleInputChange}
          onBlur={::this.handleInputBlur}
        />
        <CheckBox
          classNameBox={'input-wr'}
          fieldName={"isMain"}
          value={this.state.isMain}
          id={'isMain'}
          label={'isMain'}
          name={'checkbox'}
          type={'checkbox'}
          defaultChecked={this.state.isMain}
          onChange={() => {
            this.setState({
              isMain: !this.state.isMain,
            });
          }}
          onBlur={::this.handleInputBlur}
          errorText={this.showError('isMain')}
        />

        <button
          type=""
          className="btn btn--fw addSkillButton"
          onClick={::this.addSkill}
          disabled={this.state.skillExp && this.state.skillName ? '' : 'disabled'}
        >
          {this.props.buttonText || 'Add skill'}
        </button>
      </div>
    );
  }
  renderCreateWork() {
    return (
      <div className="add-work-exp">
        <TextField
          classNameBox={'input-wr'}
          placeholder={'Enter work'}
          value={this.state.workName}
          fieldName="workName"
          maxLength="50"
          onChange={::this.handleInputChange}
          onBlur={::this.handleInputBlur}
        />
        <TextArea
          classNameBox={'input-wr'}
          placeholder={'Enter work description'}
          value={this.state.workDescription}
          fieldName="workDescription"
          onChange={::this.handleInputChange}
          onBlur={::this.handleInputBlur}
        />
        <button
          type=""
          className="btn btn--fw addSkillButton"
          onClick={::this.addWork}
          disabled={this.state.workName && this.state.workDescription ? '' : 'disabled'}
        >
          {this.props.buttonText || 'Add work'}
        </button>
      </div>
    );
  }
  renderCreateSummary() {
    return (
      <div className="add-summary">
        <TextField
          classNameBox={'input-wr'}
          placeholder={'Enter manager name'}
          value={this.state.managerName}
          fieldName="managerName"
          maxLength="50"
          onChange={::this.handleInputChange}
          onBlur={::this.handleInputBlur}
        />
        <TextArea
          classNameBox={'input-wr'}
          placeholder={'Enter summary'}
          value={this.state.cvSummary}
          fieldName="cvSummary"
          onChange={::this.handleInputChange}
          onBlur={::this.handleInputBlur}
        />
        <button
          type=""
          className="btn btn--fw addSkillButton"
          onClick={::this.addSummary}
          disabled={
            this.state.values.summary.length < 2 && this.state.managerName && this.state.cvSummary
            ? '' : 'disabled'}
        >
          {this.props.buttonText || 'Add summary'}
        </button>
      </div>
    );
  }
  render() {
    return (
      <div className="form-wr">
        <form id="upload_form" onSubmit={::this.handleFormSubmit} encType="multipart/form-data">
          <TextField
            classNameBox={'input-wr'}
            placeholder={'Enter name'}
            value={this.state.values.username}
            fieldName="username"
            maxLength="30"
            onChange={::this.handleInputChange}
            onBlur={::this.handleInputBlur}
            errorText={this.showError('username')}
          />
          <TextField
            classNameBox={'input-wr'}
            placeholder={'Enter title'}
            value={this.state.values.title}
            fieldName="title"
            maxLength="25"
            onChange={::this.handleInputChange}
            onBlur={::this.handleInputBlur}
            errorText={this.showError('title')}
          />
          <TextField
            classNameBox={'input-wr'}
            placeholder={'Enter cost'}
            value={this.state.values.cost}
            fieldName="cost"
            onChange={::this.handleInputChange}
            onBlur={::this.handleInputBlur}
            errorText={this.showError('cost')}
          />
          <TextField
            classNameBox={'input-wr'}
            placeholder={'Enter experience'}
            value={this.state.values.experience}
            fieldName="experience"
            onChange={::this.handleInputChange}
            onBlur={::this.handleInputBlur}
            errorText={this.showError('experience')}
          />
          <TextField
            id={'file-input'}
            classNameBox={'input-wr'}
            placeholder={'Enter image'}
            fileName={this.state.values.fileName}
            preVision={this.state.values.image}
            type={'file'}
            fieldName="image"
            onChange={::this.onDropHandler}
            onBlur={::this.handleInputBlur}
            errorText={this.showError('image')}
          />
          <CheckBox
            classNameBox={'input-wr'}
            fieldName={"inHouse"}
            id={'inHouse'}
            label={'inHouse'}
            defaultChecked={this.state.values.inHouse}
            name={'checkbox'}
            type={'checkbox'}
            onChange={() => {
              this.handleCheckBoxInHouse(!this.state.values.inHouse);
            }}
            onBlur={::this.handleInputBlur}
            errorText={this.showError('inHouse')}
          />
          <div className="have-skills">
            {this.state.values.skills.length > 0 && (<h4>Skills description</h4>)}
            {
              this.state.values.skills && (this.state.values.skills.map((item, i) => {
                // let skillId = {` ${item.skill} + ${i}`}
                return (
                  <ul className="skill-form" key={`${i}-skill`}>
                    <li><span>skill: </span><span>{item.skill}</span></li>
                    <li><span>experience: </span><span>{item.experience}</span></li>
                    <li><span>isMain: </span><span>{item.main ? 'main' : ''}</span></li>
                    <li
                      className="del-skill"
                      onClick={(e) => { this.deleteSkill(i, e); }}
                    >
                      <i className="fa fa-trash" aria-hidden="true" />
                    </li>
                  </ul>
                );
              })
              )
            }
          </div>
          <div className="have-work">
            {this.state.values.works.length > 0 && (<h4>Works description</h4>)}
            {
              this.state.values.works && (this.state.values.works.map((item, i) => {
                // let skillId = {` ${item.skill} + ${i}`}
                return (
                  <ul className="work-form" key={`${i}-work`}>
                    <li><span>work: </span><span>{item.work}</span></li>
                    <li><span>work description: </span><span>{item.workDescription}</span></li>
                    <li
                      className="del-skill"
                      onClick={(e) => { this.deleteWork(i, e); }}
                    >
                      <i className="fa fa-trash" aria-hidden="true" />
                    </li>
                  </ul>
                );
              })
              )
            }
          </div>
          <div className="have-summary">
            {this.state.values.summary.length > 0 && (<h4>Summary:</h4>)}
            {
              this.state.values.summary && (this.state.values.summary.map((item, i) => {
                return (
                  <ul className="summary-form" key={`${i}-summary`}>
                    <li><span>Name manager: </span><span>{item.managerName}</span></li>
                    <li><span>Summary: </span><span>{item.cvSummary}</span></li>
                    <li
                      className="del-skill"
                      onClick={(e) => { this.deleteSummary(i, e); }}
                    >
                      <i className="fa fa-trash" aria-hidden="true" />
                    </li>
                  </ul>
                );
              }))
            }
          </div>
          <button
            type="submit"
            className="btn btn--fw"
            disabled={!this.isValidForm()}
          >
            {this.props.buttonText || 'Add CV'}
          </button>
        </form>
        <div className="add-desc">
          {this.renderCreateSkill()}
          {this.renderCreateWork()}
          {this.renderCreateSummary()}
        </div>
      </div>
    );
  }
}

export default connect(null, { updateUser, getUsers, createUser, push })(createCV);
