import React from 'react';
import LoadingComponent from './components/LodingComponent/LoadingComponent';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";

import AuthRoute from './components/AuthRoute/AuthRoute';
import routes from './routes';
import { useWallet } from './store/wallet';


export interface AppProps { }

const App: React.FunctionComponent<AppProps> = props => {
    const { isLoading } = useWallet();

    if (isLoading) {
        return <LoadingComponent />;
    }

    return (
        <Router>
            <Routes>
                {routes.map((route, index) => {
                    if (route.auth) {
                        return (
                            <Route
                                path={route.path}
                                key={index}
                                element={
                                    <>
                                        <AuthRoute>
                                            <route.component />
                                        </AuthRoute>
                                    </>
                                }
                            />
                        );
                    }

                    return (
                        <Route
                            path={route.path}
                            key={index}
                            element={<route.component />}
                        />
                    );
                })}
            </Routes>
        </Router>
    );
}


export default App;
