import api from '../api';

export const approveStudent = async (id) => {
    return await api.post(`/students-pre-registrations/${id}/approve`);
};

export const rejectStudent = async (id, reason) => {
    return await api.post(`/students-pre-registrations/${id}/reject`, {
        rejection_reason: reason, 
    });
};