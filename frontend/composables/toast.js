const { $toast } = useNuxtApp();

export const useToast = () => {
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
    return {error, success}
}
