import React, { ReactNode, useEffect, useReducer, useState } from 'react';
import LoadingComponent from './components/LodingComponent/LoadingComponent';
import {
    BrowserRouter as Router,
    Route,
    Routes
  } from "react-router-dom";
import logging from './config/logging';
import { connector } from './connector';
import AuthRoute from './components/AuthRoute/AuthRoute';
import routes from './routes';
import { initialUserState, UserContextProvider, userReducer } from './state/userState';


export interface  AppProps { }
export interface  RestoreConnectionProps {
    children: ReactNode
}

const App: React.FunctionComponent<AppProps> = props => {
    const [loading, setLoading] = useState<boolean>(true);
    const [userState, userDispatch] = useReducer(userReducer, initialUserState);

    useEffect(() => {
        const checkConnection = async () => {
            setLoading(true);
            await connector.restoreConnection();
            setLoading(false)
        }
        checkConnection()
        // eslint-disable-next-line
	}, []);
 
    if (!connector.wallet && loading === true){
        return <LoadingComponent/>;
    }

    const userContextValues = {
        userState,
        userDispatch
    };

    return (
        <UserContextProvider value={userContextValues}>
            <Router>
                <Routes>
                    {routes.map((route, index) => {
                        if (route.auth){
                            return (
                                <Route
                                path={route.path}
                                key={index}
                                element={
                                    <>
                                            <AuthRoute>
                                                <route.component/>
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
                                            element={<route.component/>} 
                                        />
                                    );
                                })}
                </Routes>
            </Router>
        </UserContextProvider>
    );
}


export default App;
