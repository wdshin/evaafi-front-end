import { useTonWallet } from '@tonconnect/ui-react';
import React, { useContext, ReactNode, useEffect} from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import logging from '../../config/logging';
import { connector } from '../../connector';
// import { useTonWallet } from '../../hooks/useTonWallet';
import UserContext from '../../state/userState';

export interface IAuthRouteProps {
    children: ReactNode, 
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = ({children}) => {
    const navigate  = useNavigate();
    // const myWallet = useTonWallet();
    // console.log(connector, "connector")
    // const wallet = useTonWallet();
    // console.log(wallet, "my wallet")
    // if (!userState.connection){
    if (connector.wallet === null){
        logging.info('Unauthorized, redirecting.');
        // navigate('/');
        return <Navigate to="/" replace={true} />;
    } else {
        return <>{children}</>
    }
}

export default AuthRoute;