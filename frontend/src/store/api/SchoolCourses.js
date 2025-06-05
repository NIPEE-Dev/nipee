import api from '../../api';

const SchoolCourses = {
  fetchList: ({ schoolId, ...params }) =>
    api.get(`schools/${schoolId}/courses`, { params }),

  details: ({ schoolId, courseId, ...params }) =>
    api.get(`schools/${schoolId}/courses/${courseId}`, { params }),

  create: ({ schoolId, ...data }, params) =>
    api.post(`schools/${schoolId}/courses`, data, { params }),

  update: ({ schoolId, courseId, ...data }, params) =>
    api.put(`schools/${schoolId}/courses/${courseId}`, data, { params }),

  remove: ({ schoolId, courseId }, params) =>
    api.delete(`schools/${schoolId}/courses/${courseId}`, { params })
};

export default SchoolCourses;
