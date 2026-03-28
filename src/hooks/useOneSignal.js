import { useEffect } from "react"
import { ONESIGNAL_APP_ID, BASE_URL } from "../repository/Repository";

const useOneSignal = () => {
    useEffect(() => {
        const loadOneSignal = async () => {

            window.OneSignalDeferred = window.OneSignalDeferred || [];
            window.OneSignalDeferred.push(async function (OneSignal) {
                await OneSignal.init({
                  appId: ONESIGNAL_APP_ID,
                  safari_web_id: "web.onesignal.auto.2c5a7aa8-83b4-45ba-8e8f-e5cd6a2881a0",
                  notifyButton: {
                    enable: true,
                  },
                  allowLocalhostAsSecureOrigin: true,
                });

                setTimeout(async function () {
                    const subscription = await OneSignal.User.PushSubscription;
                    if (subscription && subscription.id) {
                      const user = JSON.parse(localStorage.getItem("authUser"));
          
                      fetch(`${BASE_URL}/one-signal-subscription-id`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          one_signalsubscription_id: subscription.id,
                          user_id: user ? user.id : null,
                        }),
                      })
                        .then((response) => response.json())
                        .then((data) => console.log("OneSignal Response:", data))
                        .catch((error) => console.error("OneSignal Error:", error));
                    } else {
                      console.log("OneSignal Subscription ID not available yet.");
                    }
                }, 3000);
                
            });

        }

        const script = document.createElement("script");
        script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
        script.defer = true;
        script.onload = loadOneSignal;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };

    }, []);
};

export default useOneSignal;