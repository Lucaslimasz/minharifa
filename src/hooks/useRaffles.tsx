"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

import { firebase } from "@/config/firebase";

interface IRafflesProvider {
  children: ReactNode;
}

interface RafflesContextData {
  createRaffle: (raffle: IRaffleProps) => void;
  removeRaffle: (id: string) => void;
  rafflesActives: IRaffleProps[];
}

interface IRaffleProps {
  number: string;
  name: string;
  contact: string;
  id?: string;
  deleted?: string;
}

const RafflesContext = createContext<RafflesContextData>(
  {} as RafflesContextData
);

export const RafflesProvider = ({ children }: IRafflesProvider) => {
  const [rafflesActives, setRafflesActives] = useState<IRaffleProps[]>([]);
  const db = getFirestore(firebase);
  const useCollectionRef = collection(db, "minharifa");

  const createRaffle = useCallback(
    async (raffle: IRaffleProps) => {
      const { name, number, contact } = raffle;
      const newRaffle = {name, number, contact, deleted: "" };
      const res = await addDoc(useCollectionRef, newRaffle);
      setRafflesActives((prevState) => [...prevState, {...newRaffle, id: res.id}]);
    },
    [useCollectionRef]
  );

  const removeRaffle = useCallback(async (id: string) => {
    const date = new Date();
    const dateFormatted = new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);

    const userDoc = doc(db, 'rafflesActives', id)
    await updateDoc(userDoc, {deleted: dateFormatted})
  }, [db]);

  useEffect(() => {
    (async () => {
      const response = await getDocs(useCollectionRef)
      const data: any = response.docs.map(doc => ({...doc.data(), id: doc.id}))  
      setRafflesActives(data)
    })()
  },[])

  return (
    <RafflesContext.Provider value={{createRaffle, removeRaffle, rafflesActives}}>{children}</RafflesContext.Provider>
  );
};

export function useRaffles() {
  const ctx = useContext(RafflesContext);

  return ctx;
}
