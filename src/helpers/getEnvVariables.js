
export const getEnvVariables = () => {

    // import.meta.env;

    return {
        VITE_MODE: import.meta.env.MODE,
        VITE_API_URL: import.meta.env.VITE_API_URL,
        // ...import.meta.env,
    }
}