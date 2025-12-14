import { API_BASE, ACCESS_TOKEN_KEY } from "../config/env";

export const InspectionService = {
    /**
     * Saves inspection data to the backend API.
     * @param inspectionData The inspection payload.
     * @returns The response data from the server.
     */
    saveInspection: async (inspectionData: any) => {


        // MOCK IMPLEMENTATION
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const isSuccess = Math.random() > 0.1; // 90% success rate
                if (isSuccess) {
                    console.log("Mock API: Inspection saved successfully online");
                    resolve({ success: true, id: inspectionData.id });
                } else {
                    console.log("Mock API: Inspection save failed");
                    reject(new Error("Network Error or Server Error"));
                }
            }, 1000);
        });
    }
};
