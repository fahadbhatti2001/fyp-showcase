import { API } from "./API"

export const UploadApi = {
  Upload: async (form) => {
    return API.post({
      url: "/uploads/upload.php",
      data: form,
    })
  },
  Delete: async (form) => {
    return API.delete({
      url: "/uploads/delete.php?filename=" + form.split("uploads/")[1],
    })
  },
}
