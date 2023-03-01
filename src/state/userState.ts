import { createContext } from 'react';

export interface IUserState {
    toncoinPrice: string;
}

export interface IUserActions {
    type: 'updateToncoinPrice';
    payload: string

}

export const initialUserState: IUserState = {
    toncoinPrice: '0'
}

export const userReducer = (state: IUserState, action: IUserActions) => {
    const toncoinPrice = action.payload;
    switch (action.type) {
        case 'updateToncoinPrice':
            return { ...state, toncoinPrice};
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