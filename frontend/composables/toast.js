
export const useToast = () => {
    const { $toast } = useNuxtApp();
    const error = (message) => {
        if(process.client) {
            $toast.open({
                message: message,
                type: "error",
                position: "top",
                duration: 6000,
            });
        }
    }
    const info = (message) => {
        if(process.client) {
            $toast.open({
                message: message,
                type: "info",
                position: "top",
                duration: 6000,
            });
        }
    }
    const success = (message) => {
        if(process.client) {
            $toast.open({
                message: message,
                type: "success",
                position: "top",
                duration: 6000,
            });
        }
    }
    return {error, info, success}
}
