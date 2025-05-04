import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import AgileMaturityAssessment from "./pages/Billing";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import ProjectDetails from "./pages/project-details";
import CreateAssessment from "./pages/create-assessment";
import BackLog from "./pages/backlog";
import SprintCreation from "./pages/sprint";
import CreateUsers from "./pages/users";
import { list } from "./pages/data";
// import "antd/dist/antd.css";
import { ConfigProvider } from "antd";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import KanbanBoard from "./pages/kansanboard";
import ScoreCards from "./pages/score-card";

function App() {
  return (
    <ConfigProvider>
      <div className="App">
        <Switch>
          <Route path="/" exact component={SignIn} />
          <Route path="/sign-up" exact component={SignUp} />
          <Route path="/sign-in" exact component={SignIn} />
          <Main>
            <Route exact path="/dashboard" component={Home} />
            <Route exact path="/project-management" component={Tables} />
            <Route
              exact
              path="/assesment"
              component={AgileMaturityAssessment}
            />
            <Route exact path="/profile" component={Profile} />
            <Route
              exact
              path="/project/:id"
              component={(props) => (
                <ProjectDetails {...props} projects={list} />
              )}
            />
            <Route exact path="/kansanboard" component={KanbanBoard} />
            <Route exact path="/backlog" component={BackLog} />
            <Route exact path="/sprint" component={SprintCreation} />
            <Route exact path="/users" component={CreateUsers} />
            <Route exact path="/scorecard" component={ScoreCards} />
            <Route
              exact
              path="/assessment/create"
              component={CreateAssessment}
            />
          </Main>
          <Redirect from="*" to="/sign-in" /> {/* Moved outside Main */}
        </Switch>
      </div>
    </ConfigProvider>
  );
}

export default App;
