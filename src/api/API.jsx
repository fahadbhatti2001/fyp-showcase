export const API = {
    get: async (args) => {
        const url = process.env.NEXT_PUBLIC_API_BASE + args.url;

        const res = await fetch(url);

        const body = await res.json();

        if (!res.ok) {
            const errorMessage = body.error ?? "failed to fetch data";
            throw new Error(errorMessage);
        }

        return body;
    },
    post: async (args) => {
        const url = process.env.NEXT_PUBLIC_API_BASE + args.url;
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(args.data),
        });

        const body = await res.json();

        if (!res.ok) {
            const errorMessage = body.error ?? "Unknown error";
            throw new Error(errorMessage);
        }

        return body;
    },
    put: async (args) => {
        const url = process.env.NEXT_PUBLIC_API_BASE + args.url;
        const res = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(args.data),
        });

        const body = await res.json();
        if (!res.ok) {
            const errorMessage = body.error ?? "Unknown error";
            throw new Error(errorMessage);
        }

        return body;
    },
};
