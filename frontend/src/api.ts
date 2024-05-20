import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Middleware для установки токена в заголовок Authorization
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Middleware для проверки ответа на наличие ошибки авторизации
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export const getRooms = () => axiosInstance.get('/rooms');
export const createRoom = (data: { number: string }) => axiosInstance.post('/rooms', data);
export const updateRoom = (id: string, data: { number: string }) => axiosInstance.put(`/rooms/${id}`, data);
export const deleteRoom = (id: string) => axiosInstance.delete(`/rooms/${id}`);

export const getTeachers = () => axiosInstance.get('/teachers');
export const createTeacher = (data: { name: string; position: string }) => axiosInstance.post('/teachers', data);
export const updateTeacher = (id: string, data: { name: string; position: string }) => axiosInstance.put(`/teachers/${id}`, data);
export const deleteTeacher = (id: string) => axiosInstance.delete(`/teachers/${id}`);

export const getGroups = () => axiosInstance.get('/groups');
export const createGroup = (data: { number: string }) => axiosInstance.post('/groups', data);
export const updateGroup = (id: string, data: { number: string }) => axiosInstance.put(`/groups/${id}`, data);
export const deleteGroup = (id: string) => axiosInstance.delete(`/groups/${id}`);

export const getSchedules = () => axiosInstance.get('/schedules');
export const createSchedule = (data: { name: string }) => axiosInstance.post('/schedules', data);
export const updateSchedule = (id: string, data: { name: string }) => axiosInstance.put(`/schedules/${id}`, data);
export const deleteSchedule = (id: string) => axiosInstance.delete(`/schedules/${id}`);
export const getScheduleById = (id: string) => axiosInstance.get(`/schedules/${id}`);
export const updateScheduleItems = (id: string, data: { items: any[] }) => axiosInstance.put(`/schedules/${id}/items`, data);
export const optimizeSchedule = (id: string) => axiosInstance.post(`/schedules/optimize/${id}`);