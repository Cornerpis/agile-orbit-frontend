import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import AgileMaturityAssessment from "./pages/Billing";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import ProjectDetails from "./pages/project-details";
import BackLog from "./pages/backlog";
import SprintCreation from "./pages/sprint";
import CreateUsers from "./pages/users";
import { list } from "./pages/data";
// import "antd/dist/antd.css";
import { ConfigProvider } from "antd";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import KanbanBoard from "./pages/kansanboard";
import UserProjects from "./pages/user-projects.js";
import CreateAssessment from "./pages/create-assessment.js";

import ScoreCards from "./pages/score-card";
import AssessmentsList from "./pages/assessments-list.js";
import TakeAssessment from "./pages/take-assessment.js";

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
            <Route exact path="/assesment" component={AssessmentsList} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/project/:projectId" component={ProjectDetails} />
            <Route
              exact
              path="/kanbanboard/:projectId"
              component={KanbanBoard}
            />
            <Route exact path="/backlog" component={BackLog} />
            <Route exact path="/sprint" component={SprintCreation} />
            <Route exact path="/users" component={CreateUsers} />
            <Route exact path="/scorecard" component={ScoreCards} />
            <Route
              exact
              path="/create-assessment"
              component={CreateAssessment}
            />
            <Route exact path="/my-projects" component={UserProjects} />
            <Route
              exact
              path="/take-assessment/:id"
              component={TakeAssessment}
            />
          </Main>
          <Redirect from="*" to="/sign-in" />
        </Switch>
      </div>
    </ConfigProvider>
  );
}

export default App;
