import axios from "axios";

const http = axios.create({ baseURL: "http://localhost:8000/api" });

export const getPatients = () => http.get("/patients").then(r => r.data);
export const getPatient = id => http.get(`/patients/${id}`).then(r => r.data);
export const createPatient = body => http.post("/patients", body).then(r => r.data);
export const updatePatient = (id, body) => http.patch(`/patients/${id}`, body).then(r => r.data);
export const deletePatient = id => http.delete(`/patients/${id}`);
export const generateRemarks = id => http.post(`/patients/${id}/remarks`).then(r => r.data);
