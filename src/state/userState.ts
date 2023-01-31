import { createContext } from 'react';
// import IUser, { DEFAULT_FIRE_TOKEN, DEFAULT_USER } from '../interfaces/user';

export interface IUserState {
    nft: any;
}

export interface IUserActions {
    type: 'buyNFT' | 'createSale';
    payload: {
        nft: any;
    };
}

export const initialUserState: IUserState = {
    nft: null
}

export const userReducer = (state: IUserState, action: IUserActions) => {
    let nft = action.payload;
    switch (action.type) {
        case 'buyNFT':
            return { ...state, nft};
        case 'createSale':
            return { ...state, nft};
        default:
            return state;
    }
};

export interface IUserContextProps {
    userState: IUserState;
    userDispatch: React.Dispatch<IUserActions>;
}

const UserContext = createContext<IUserContextProps>({
    userState: initialUserState,
    userDispatch: () => {}
});

export const UserContextConsumer = UserContext.Consumer;
export const UserContextProvider = UserContext.Provider;
export default UserContext;