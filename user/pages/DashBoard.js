﻿import React, { Component } from 'react';
import { deleteTask, updateTask, getUsers } from '../actions';
import { connect } from 'react-redux';
import CreateTask from '../components/Task/CreateTask';
import Task from '../components/Task/Task';

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dustbins: [],
    };
  }
  componentDidMount() {
    this.props.getUsers();
  }
  static propTypes = {
    deleteTask: React.PropTypes.func,
    updateTask: React.PropTypes.func,
    data: React.PropTypes.object,
  };
  deleteTask(taskId) {
    this.props.deleteTask(taskId);
  }
  renderDustbins() {
    if(this.props.data.data){
    return this.props.data.data.map((item, i) => {
      return (
        <Task
          item={item}
          key={i}
          isAdminPanel={true}
          // onDelete={this.deleteTask.bind(this, item.id)}
          onDelete={(e) => { this.deleteTask(item.id, e); }}
        />
      );
    });
    }
  }

  render() {
    return (
      <div className={'page start-page columns'}>
        <div className="dashboard-wr">
          <div className="builder-task">
            <CreateTask />
          </div>
          <div className="inside-wr">
            <div className="lists-wr">
              {this.renderDustbins()}
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
    deleteTask, updateTask, getUsers
  }
)(DashBoard);

export default ConnectedComponent;
