export const API = {
  post: async (args) => {
    const url = process.env.NEXT_PUBLIC_API_BASE + args.url
    const res = await fetch(url, {
      method: "POST",
      body: args.data,
    })

    const body = await res.json()

    if (!res.ok) {
      const errorMessage = body.error ?? "Unknown error"
      throw new Error(errorMessage)
    }

    return body
  },

  delete: async (args) => {
    try {
      const url = process.env.NEXT_PUBLIC_API_BASE + args.url
      const res = await fetch(url, {
        method: "DELETE",
        body: args.data,
      })

      const body = await res.json()

      if (!res.ok) {
        const errorMessage = body.error || "Unknown error"
        throw new Error(errorMessage)
      }

      return body
    } catch (error) {
      console.error("Delete API Error:", error)
      throw error
    }
  },
}
