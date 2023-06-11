'use client'

import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from "react";
import { useRouter } from 'next/navigation';

import 'firebase/auth';

import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { firebase } from "../config/firebase";

const provider = new GoogleAuthProvider();

interface IAuthProvider {
  children: ReactNode;
}

interface AuthContextData {
  signInGoogle: () => void;
  signed: boolean;
  signOut: () => void;
  user: any;
  isUserValid: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthGoogleProvider = ({ children }: IAuthProvider) => {
  const auth = getAuth(firebase);
  const [user, setUser] = useState<any>();
  const [isUserValid, setIsUserValid] = useState<boolean>(false);
  const router = useRouter();

  const signInGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token: any = credential?.accessToken;
        const user = result.user;
        sessionStorage.setItem("@AuthFireBase:token", token);
        sessionStorage.setItem("@AuthFireBase:user", JSON.stringify(user));
        router.push('/')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log({ errorCode, errorMessage, email, credential });
      });
  };

  const signOut = () => {
    sessionStorage.clear();
    setUser(null);
    setIsUserValid(false)
  };


  useEffect(() => {
    const sessionUser: any = sessionStorage.getItem("@AuthFireBase:user");
    const user = JSON.parse(sessionUser)
    if(!sessionUser){
      return signOut();
    }
    if(user.uid === process.env.NEXT_PUBLIC_ID_USER || user.uid === process.env.NEXT_PUBLIC_ID_USER_ALANE){
      return setIsUserValid(true);
    }
    
    setIsUserValid(false)

  }, [isUserValid])

  useEffect(() => {
    const loadStoreAuth = () => {
      const sessionToken = sessionStorage.getItem("@AuthFireBase:token");
      const sessionUser = sessionStorage.getItem("@AuthFireBase:user");
      if (sessionToken && sessionUser) {
        setUser(sessionUser);
        router.push('/')
      }
    };

    loadStoreAuth();
  }, [router]);

  return (
    <AuthContext.Provider value={{signInGoogle, signed: !!user, signOut, user, isUserValid}}>
      {children}
    </AuthContext.Provider>
  )
};

export function useAuthGoogle() {
  const ctx = useContext(AuthContext);

  return ctx;
}
