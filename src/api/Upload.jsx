import { API } from "./API"

export const UploadApi = {
  Upload: async (form) => {
    return API.post({
      url: "/api/upload.php",
      data: form,
    })
  },
  Delete: async (form) => {
    return API.delete({
      url: "/api/delete.php?filename=" + form,
    })
  },
}
