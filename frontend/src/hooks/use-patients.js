import { useCallback, useEffect, useReducer } from "react";
import * as api from "../api";

const init = { patients: [], loading: true, error: null };

function reducer(state, action) {
  switch (action.type) {
    case "LOADED": return { ...state, loading: false, patients: action.data };
    case "ERROR":  return { ...state, loading: false, error: action.msg };
    case "SET":    return {
      ...state,
      patients: state.patients.map(p => p.id === action.data.id ? action.data : p),
    };
    case "ADD":    return { ...state, patients: [...state.patients, action.data] };
    case "DEL":    return { ...state, patients: state.patients.filter(p => p.id !== action.id) };
    default: return state;
  }
}

export function usePatients() {
  const [state, dispatch] = useReducer(reducer, init);

  const reload = useCallback(async () => {
    try {
      const data = await api.getPatients();
      dispatch({ type: "LOADED", data });
    } catch {
      dispatch({ type: "ERROR", msg: "could not reach the server" });
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const add = async body => {
    const row = await api.createPatient(body);
    dispatch({ type: "ADD", data: row });
    return row;
  };

  const patch = async (id, body) => {
    const row = await api.updatePatient(id, body);
    dispatch({ type: "SET", data: row });
    return row;
  };

  const remove = async id => {
    await api.deletePatient(id);
    dispatch({ type: "DEL", id });
  };

  const remark = async id => {
    const row = await api.generateRemarks(id);
    dispatch({ type: "SET", data: row });
    return row;
  };

  return { ...state, add, patch, remove, remark };
}
