import useAxiosSecure from "./useAxiosSecure";

const useTrackingLogger = () => {
  const axiosSecure = useAxiosSecure();

  const logTracking = async ({
    trackingId,
    deliveryStatus,
    details,
    deliveryInstruction,
    createdAt,
  }) => {
    try {
      const payload = {
        trackingId,
        deliveryStatus,
        details,
        deliveryInstruction,
        createdAt,
      };
      await axiosSecure.post("/tracking", payload);
    } catch (error) {
      console.error("Failed to log tracking:", error);
    }
  };

  return { logTracking };
};

export default useTrackingLogger;
