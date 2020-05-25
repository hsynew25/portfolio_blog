document.addEventListener("DOMContentLoaded", function () {
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
  const database = firebase.database();
  let userInfo, selectedKey;

  const summitForm = document.querySelector(".saveForm");

  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("success");
      userInfo = user;
      console.log(userInfo.displayName);
    } else {
      console.log("login session is null");
    }
  });

  function save_form() {
    const postRef = database.ref("posts/");
    const title = document.querySelector(".postTitle").value;
    const subTitle = document.querySelector(".postSubTitle").value;
    const txt = document.querySelector(".postTxt").value;
    if (selectedKey) {
      const repostRef = database.ref("posts/" + selectedKey);
      repostRef.set({
        title: title,
        subTitle: subTitle,
        txt: txt,
      });
    } else {
      postRef.push({
        title: title,
        subTitle: subTitle,
        txt: txt,
      });
    }
    window.location.replace("../index.html");
  }

  summitForm.addEventListener("click", function () {
    save_form();
  });
});
