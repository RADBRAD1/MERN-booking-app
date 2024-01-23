import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from '../api-client';

type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}

//appContext type describes different thigns we are exposing to the users in the context. 
type AppContext = {
    showToast: (toastMessage: ToastMessage) => void;
    isLoggedIn: boolean;
}

const AppContext = React.createContext<AppContext | undefined>(undefined);

//can set a child type and define it inline without previous creation.

//in the appcontext.provider value, we expose the showtoast function.

export const AppContextProvider = ({children}: {children: React.ReactNode}) => {
    const[toast, setToast] = useState<ToastMessage | undefined>(undefined);
    const {isError} = useQuery("validateToken", apiClient.validateToken, {retry: false,}); // import useQuery hook, calls the validateToken endpoint using apiClient and returns if there is an error or not. 
    // if there is an error, it will throw it to the {isError} property. 
    return(
        <AppContext.Provider 
        value = {{showToast: (toastMessage) => {
                setToast(toastMessage);
            }, isLoggedIn: !isError, 
            }}> 
            {toast && (<Toast message = {toast.message} type = {toast.type} onClose = {() => setToast(undefined)}/>)}
            {children}
        </AppContext.Provider>
    )
}
// the above function wraps around the entire app(which is children),
// and adds context


export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContext;
};

