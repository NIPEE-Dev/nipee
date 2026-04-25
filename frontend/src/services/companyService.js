import api from "../api";

export const getBranches = async (companyId) => {
  return await api.get("/companies/branches", {
    params: companyId ? { company_id: companyId } : {},
  });
};

export const createBranch = async (payload) => {
  return await api.post("/companies/branches", payload);
};

export const updateBranch = async (id, payload) => {
  return await api.put(`/companies/branches/${id}`, payload);
};

export const deleteBranch = async (id) => {
  return await api.delete(`/companies/branches/${id}`);
};

export const createBranchSector = async (branchId, payload) => {
  return await api.post(`/companies/branches/${branchId}/sectors`, payload);
};

export const updateBranchSector = async (branchId, sectorId, payload) => {
  return await api.put(
    `/companies/branches/${branchId}/sectors/${sectorId}`,
    payload,
  );
};

export const deleteBranchSector = async (branchId, sectorId) => {
  return await api.delete(
    `/companies/branches/${branchId}/sectors/${sectorId}`,
  );
};
