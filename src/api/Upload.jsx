import { API } from "./API"

export const UploadApi = {
    File: async (form) => {
        return API.post({
            url: "/uploads/upload.php",
            data: form,
        })
    },
}