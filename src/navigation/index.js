import { Route, BrowserRouter as Router } from "react-router-dom";
import Signin from '../screens/authentication/signin'

function Navigator() {
    return (
        <Router>
            <Route exact path="/" component={Signin} />
        </Router>
    );
}

export default Navigator;