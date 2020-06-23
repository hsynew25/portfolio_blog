document.addEventListener("DOMContentLoaded", function () {
  // Your web app's Firebase configuration

  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // firebase.auth().onAuthStateChanged(user => { });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  var firebaseConfig = {
    apiKey: "AIzaSyD879qI_tyKGE8nVpauTbf600wMq0akifI",
    authDomain: "portfolio-7fd43.firebaseapp.com",
    databaseURL: "https://portfolio-7fd43.firebaseio.com",
    projectId: "portfolio-7fd43",
    storageBucket: "portfolio-7fd43.appspot.com",
    messagingSenderId: "1091508426658",
    appId: "1:1091508426658:web:26035b0171529a3c44c4fb",
  };
  // Initialize Firebase

  if (!firebase.apps.length) {
    firebase.initializeApp({});
  }
  // console.log(firebase.apps.length);
  // firebase.initializeApp(firebaseConfig);
  console.log("firebase initialize success");

  const auth = firebase.auth();

  const authProvider = new firebase.auth.GoogleAuthProvider();

  let userInfo;

  const tab_btn = document.querySelector(".menu_btn");
  const login_btn = document.querySelector(".loginbtn");
  const write_btn = document.querySelector(".writing");

  function toggleClass(element, className) {
    let check = new RegExp("(\\s|^)" + className + "(\\s|$)");
    if (check.test(element.className)) {
      element.className = element.className.replace(check, " ").trim();
    } else {
      element.className += " " + className;
    }
  }

  tab_btn.addEventListener("click", function () {
    let tab = document.querySelector(".tabs");
    toggleClass(tab, "is_active");
  });

  // auth.onAuthStateChanged((user) => {
  //   if (user) {
  //     console.log("success");
  //     userInfo = user;
  //     afterLogin();
  //   } else {
  //     console.log("아무도 로그인 안함");
  //     return;
  //   }
  // });

  login_btn.addEventListener("click", function () {
    if (login_btn.innerText == "LOGIN") {
      auth
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function () {
          return auth.onAuthStateChanged((user) => {
            if (user) {
              console.log("success");
              userInfo = user;
              afterLogin();
            } else {
              auth.signInWithPopup(authProvider);
            }
          });
        })
        .catch(function (error) {
          let errorCode = error.code;
          let errorMsg = error.message;
          console.log(`error code : ${errorCode}, msg : ${errorMsg}`);
        });
    } else if (login_btn.innerText == "LOGOUT") {
      logOut();
    }
  });

  function afterLogin() {
    const username = document.querySelector(".userName");
    username.innerText = userInfo.displayName;
    login_btn.innerText = "LOGOUT";
    write_btn.style.display = "block";
  }

  function logOut() {
    auth
      .signOut()
      .then(function () {
        const username = document.querySelector(".userName");
        console.log("logout successful");
        username.innerText = null;
        write_btn.style.display = "none";
        login_btn.innerText = "LOGIN";
      })
      .catch(function (errer) {
        const errorCode = error.code;
        const errorMsg = errer.message;
        console.log(`error code : ${errorCode}, error message : ${errorMsg}`);
      });
  }
});
