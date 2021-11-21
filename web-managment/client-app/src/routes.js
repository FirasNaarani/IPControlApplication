import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import { createBrowserHistory } from 'history';
import  Login  from './components/login';
import Support from './components/support';
import  Managers  from './components/managers';
import  Commands  from './components/commands';
import  Agents  from './components/agents';
import  PublicLayout from "./layouts/public";
import  DashboardLayout from "./layouts/dashboard";
import ManagerForm from './components/managers/form';
import CommandForm from './components/commands/form'
import Dashboard from './components/dashboard';
export const history = createBrowserHistory();
function RouteWithLayout({layout, component, ...rest}){
    if (rest.isGuarded) {
      const token = localStorage.getItem("token");
      if (!token) {
        return (<Redirect  to="/login"/>);
      }
    }
    const componentRender = (props) => {
        props.title = rest.title;
        return React.createElement( layout, props, React.createElement(component, props))
    }
    return (
      <Route {...rest} render={componentRender}/>
    );
  }
const Routing = () => {
    return(
      <Router history={history}>
        <Switch>
            <Redirect exact from="/" to="/login" />
            <RouteWithLayout layout={PublicLayout} exact path="/login" component={Login} title="Login" />
            <RouteWithLayout layout={DashboardLayout} isGuarded="true" exact path="/support" component={Support} title=".:: Contact Us ::."/>
            <RouteWithLayout layout={DashboardLayout} isGuarded="true" exact path="/managers" component={Managers} title=".:: Managers ::."/>
            <RouteWithLayout layout={DashboardLayout} isGuarded="true" exact path="/managers/add" component={ManagerForm} title=".:: Add Manager ::."/>
            <RouteWithLayout layout={DashboardLayout} isGuarded="true" exact path="/managers/:id" component={ManagerForm} title=".:: Update Manager ::."/>
            <RouteWithLayout layout={DashboardLayout} isGuarded="true" exact path="/managers/password/:id" component={ManagerForm} title=".:: Update Manager Password ::."/>
            <RouteWithLayout layout={DashboardLayout} isGuarded="true" path="/agents" component={Agents} title=".:: Agents ::."/>
            <RouteWithLayout layout={DashboardLayout} isGuarded="true" exact path="/commands" component={Commands} title=".:: Commands ::."/>
            <RouteWithLayout layout={DashboardLayout} isGuarded="true" exact path="/commands/add" component={CommandForm} title=".:: Add Command ::."/>
            <RouteWithLayout layout={DashboardLayout} isGuarded="true" exact path="/commands/:id" component={CommandForm} title=".:: Update Command ::."/>
        </Switch>
      </Router>
    )
  }

export default Routing;