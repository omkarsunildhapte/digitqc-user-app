export const InspectionService = {
    saveInspection: async (inspectionData: any) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const isSuccess = Math.random() > 0.1;
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
