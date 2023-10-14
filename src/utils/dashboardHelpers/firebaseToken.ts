import { getToken } from "firebase/messaging";
import { messaging } from "./../../firebase/firebaseConfig";
import axios from "axios";
// const getToken = getToken(messaging, { vapidKey: "YOUR_PUBLIC_VAPID_KEY_HERE" });

export const requestPermission = (email) => {
  // console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      // console.log("Notification permission granted.");

      // Get registration token
      getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      })
        .then((currentToken) => {
          if (currentToken) {
            // Here you would send this token to your backend
            // Or save it in your user's profile in Firestore, for example
            // console.log("currentToken:", currentToken);

            // saveTokenToFirestore(currentToken);
            // const email = localStorage.getItem('userEmail');

            // Send token and email to backend using axios
            axios
              .post(`${process.env.REACT_APP_BASE_URL}/save-token`, {
                token: currentToken,
                email,
              })
              .then((response) => {
                // console.log(response.data.message);
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
};

// This function is similar to what you've done before.
// Saves the FCM token to Firestore
// function saveTokenToFirestore(token) {
//   const user = JSON.parse(localStorage.getItem("driver"));

//   if (user && user.email) {
//     const usersRef = db.collection('users');
//     usersRef.where('email', '==', user.email)
//       .get()
//       .then((snapshot) => {
//         if (!snapshot.empty) {
//           const userId = snapshot.docs[0].id;
//           usersRef.doc(userId).update({ fcmToken: token });
//         }
//       });
//   }
// }
