export type RootStackParamList = {
    Splash: undefined;
    Intro: undefined;
    Login: undefined;
    OTP: { phone?: string } | undefined;
    Main: undefined;
    InspectionForm: { inspectionId?: string; initialStatus?: string } | undefined;
    Notification: undefined;
};
