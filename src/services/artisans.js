import api from "./api";

export async function getArtisans(params = {}) {
  const { data } = await api.get("/artisans", { params });
  return data;
}

export async function getArtisanById(id) {
  const { data } = await api.get(`/artisans/${id}`);
  return data;
}

export async function getCategories() {
  const { data } = await api.get("/categories");
  return data;
}