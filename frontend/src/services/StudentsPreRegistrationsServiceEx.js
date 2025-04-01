import api from '../apiex';

export const createStudent = async (studentData) => {
    return await api.post('/students-pre-registrations/store', studentData);
};
