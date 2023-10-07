import { API } from "./API"

export const UploadApi = {
    File: async (form) => {
        return API.post({
            url: "/upload.php",
            data: form,
        })
    },
}