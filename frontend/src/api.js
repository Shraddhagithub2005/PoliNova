// src/api.js
import axios from "axios";

const api = axios.create({
 baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/", // Django backend
});

export const fetchComplaints = async (victimEmail = "", language = "en") => {
  const params = { language };
  if (victimEmail) {
    params.victim_email = victimEmail;
  }
  const response = await api.get("victim/complaint/list/", { params });
  return response.data;
};

export const updateStatus = async (complaintId, status, language = "en") => {
  const response = await api.put(`victim/complaint/update-status/${complaintId}/`, {
    status,
    language,
  });
  return response.data;
};

export const getComplaintDetail = async (complaintId, language = "en") => {
  const response = await api.get(`victim/complaint/detail/${complaintId}/`, {
    params: { language },
  });
  return response.data;
};

export const deleteComplaint = async (complaintId) => {
  const response = await api.delete(`victim/complaint/delete/${complaintId}/`);
  return response.data;
};

export default api;
