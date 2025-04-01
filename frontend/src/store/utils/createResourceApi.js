import api from '../../api';

export default function createResourceApi(route, extra = {}) {
  return {
    fetchList(params) {
      return api.get(route, { params });
    },

    details(id, params) {
      return api.get(`${route}/${id}`, { params });
    },

    create(data, params) {
      return api.post(route, data instanceof FormData ? data : { ...data }, {
        params,
      });
    },

    update(id, data, params) {
      return api.put(
        `${route}/${id}`,
        data instanceof FormData ? data : { ...data },
        { params }
      );
    },

    remove(id, params) {
      return api.delete(`${route}/${id}`, { params });
    },
    ...extra,
  };
}
