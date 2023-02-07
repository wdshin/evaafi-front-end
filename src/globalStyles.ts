import { createGlobalStyle } from 'styled-components';

import RobotoRegular from './assets/fonts/Roboto/Roboto-Regular.ttf'
import RobotoMedium from './assets/fonts/Roboto/Roboto-Medium.ttf'
// import RobotoSemiBold from './assets/fonts/Roboto/Roboto-SemiBold.ttf'
import RobotoBold from './assets/fonts/Roboto/Roboto-Bold.ttf'

export default createGlobalStyle`
    @font-face {
        font-family: "Roboto", sans-serif;
        src: local('Roboto'), local('Roboto'), 
            url(${RobotoRegular}) format('ttf');
        font-weight: 400;
        font-style: normal;
    }

    @font-face {
        font-family: "Roboto", sans-serif;
        src: local('Roboto'), local('Roboto'), 
            url(${RobotoMedium}) format('ttf');
        font-weight: 500;
        font-style: normal;
    }

    @font-face {
        font-family: "Roboto", sans-serif;
        src: local('Roboto'), local('Roboto'), 
            url(${RobotoBold}) format('ttf');
        font-weight: 700;
        font-style: normal;
    }

    .root {
        z-index: -2000;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;

        font-family: "Roboto", sans-serif;
        font-size: 10px;

        @media only screen and (max-width: 1720px) {  
            font-size: calc((100vw / 1720) * 10);
        } 

        @media only screen and (max-width: 480px) {  
            font-size: calc(100vw / 400 * 10);
        }
    }
`;