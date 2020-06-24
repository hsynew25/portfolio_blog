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

  if (!firebase.apps.length) {
    firebase.initializeApp({});
  }

  console.log("firebase initialize success");

  const auth = firebase.auth();
  const postsRef = firebase.database().ref("posts/");

  const authProvider = new firebase.auth.GoogleAuthProvider();

  let userInfo;

  const tab_btn = document.querySelector(".menu_btn");
  const login_btn = document.querySelector(".loginbtn");
  const write_btn = document.querySelector(".writing");
  const projectList = document.querySelector(".project_list");

  // postsRef.on("child_added", addList);
  postsRef.once("value").then(addList);

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

  function addList(data) {
    const dbData = data.val();
    for (i in dbData) {
      let rootData = dbData[i].rootData;
      let mainTitle = rootData.title;
      let info = rootData.info;
      let tag = rootData.tag;
      let li = `<li>
                <div class="project_tag">${tag}</div>
                <a href="reading.html?key=${i}" class="project_title">${mainTitle}</a>
                <p class="project_info">
                  ${info}
                </p>
            </li>`;

      projectList.insertAdjacentHTML("beforeend", li);
    }
  }

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
