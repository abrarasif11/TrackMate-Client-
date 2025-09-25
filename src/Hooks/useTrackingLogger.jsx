import useAxiosSecure from "./useAxiosSecure";

const useTrackingLogger = () => {
  const axiosSecure = useAxiosSecure();

  const logTracking = async ({
    trackingId,
    status,
    details,
    deliveryInstruction,
    updatedBy,
  }) => {
    try {
      const payload = {
        tracking_id: trackingId,
        status,
        details,
        deliveryInstruction,
        updated_by: updatedBy,
      };
      await axiosSecure.post("/trackings", payload);
    } catch (error) {
      console.error("Failed to log tracking:", error);
    }
  };

  return { logTracking };
};

export default useTrackingLogger;
