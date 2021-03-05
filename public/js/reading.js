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

  console.log("firebase initialize success");

  const auth = firebase.auth();
  const database = firebase.database();
  const storage = firebase.storage();
  let userInfo, selectedKey;

  let curUrl = location.href;
  let keyidx = curUrl.indexOf("key=");
  const key = curUrl.slice(keyidx + 4);
  selectedKey = key;

  const postRef = database.ref(`posts/${selectedKey}`);
  const storageRef = storage.ref("temp/");

  const read_header = document.querySelector(".read_header");
  const read_wrap = document.querySelector(".read_wrap");
  const change_btn = document.querySelector(".change");
  const delete_btn = document.querySelector(".delete_post");

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      afterLogin();
    } else {
      console.log("No user is signed in.");
      logOut();
    }
  });

  postRef.once("value").then(readPost);

  function readPost(data) {
    const rootData = data.val().rootData;
    const title = rootData.title;
    const info = rootData.info;
    const items = rootData.items;

    for (i in items) {
      let item = items[i];
      let item_title = item.title;
      let item_content = item.contents.replaceAll("\n", "<br />");
      let item_imgs = item.imgs;

      const itemWrap = document.createElement("div");
      itemWrap.classList.add("item_wrap");

      read_wrap.appendChild(itemWrap);

      let itemInner = `
        <div class="title">${item_title}</div>
        <p class="content">${item_content}</p>
        `;

      for (j in item_imgs) {
        storageRef
          .child(item_imgs[j])
          .getDownloadURL()
          .then((url) => {
            itemWrap.insertAdjacentHTML(
              "beforeend",
              `<img class="img" src="${url}"/>`
            );
          });
      }
      itemWrap.insertAdjacentHTML("beforeend", itemInner);
    }

    let readHead = `
        <h1 class="read_title">${title}</h1>
        <h2 class="read_info">${info}</h2>
        `;

    document.title = `${title} : blogsy`;
    read_header.insertAdjacentHTML("beforeend", readHead);
  }

  function afterLogin() {
    change_btn.style.display = "inline";
    change_btn.href = `write.html?key=${selectedKey}`;
    delete_btn.style.display = "inline";
  }

  delete_btn.addEventListener("click", () => {
    if (window.confirm("Do you really want to delete?")) {
      deletePost();
    }
  });

  function deletePost() {
    postRef.remove();
    window.location.replace("index.html");
  }

  function logOut() {
    change_btn.style.display = "none";
  }
});
