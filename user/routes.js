import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Root from './pages/Root';
import DashBoard from './pages/DashBoard';
import TaskPage from './pages/TaskPage';
import EditTask from './pages/EditTask';
import MainPage from './pages/MainPage';
import FilterPage from './pages/FilterPage';
import { getUsers } from './actions';

export default function getRoutes(store) {
  function isDataStored() {
    const state = store.getState();
    const data = state.data.data;
    if (data && data.length > 0) {
      return true;
    }

    return false;
  }

  function checkMainRoute(nextState, replace) {
    if (!isDataStored()) {
      store.dispatch(getUsers());
    }
  }


  let base = "/client";
  return (
    <Route name="Root" path="/" component={Root} onEnter={checkMainRoute}>
      <Route name="task" path="task/:taskId" component={TaskPage}>
        <Route name="EditTask" path="edit" component={EditTask} />
      </Route>
      <Route name="DashBoard" path="DashBoard" component={DashBoard} />
      <Route name="MainPage" path="MainPage" component={MainPage} />
      <Route name="FilterPage" path="FilterPage" component={FilterPage} />
      <IndexRoute name="MainPage" component={MainPage} />
    </Route>
  );
}