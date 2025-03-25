
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
import { list } from "./pages/data"; // Import the list array
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import KanbanBoard from "./pages/kansanboard";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/sign-up" exact component={SignUp} />
        <Route path="/sign-in" exact component={SignIn} />
        <Main>
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/tables" component={Tables} />
          <Route exact path="/assesment" component={AgileMaturityAssessment} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/project/:id" component={(props) => <ProjectDetails {...props} projects={list} />} />
          {/* <Route exact path="/project/:id"
          element={<ProjectDetails projects={list} />} /> */}
           <Route exact path="/kansanboard" component={KanbanBoard} />
           <Route exact path="/backlog" component={BackLog} />
           <Route exact path="/sprint" component={SprintCreation} />
          <Redirect from="*" to="/dashboard" />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
