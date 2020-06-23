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
  let idx = 0;
  const imgList = {};
  const imgItemStack = [];

  const subMain = document.querySelector(".subMain");
  const addImg = document.querySelector(".addImg");
  const addItem = document.querySelector(".addItem");
  const removeItem = document.querySelector(".removeItem");
  const uploadImg = document.querySelector(".uploadImg");
  const removeImg = document.querySelector(".removeImg");
  const saveBtn = document.querySelector(".saveBtn");

  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("success");
      userInfo = user;
      console.log(userInfo.displayName);
    } else {
      console.log("login session is null");
    }
  });

  addImg.addEventListener("click", () => {
    uploadImg.click();
  });

  uploadImg.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const storageRef = storage.ref("temp/" + file.name);
    let task = storageRef.put(file);

    const uploads = document.querySelector(".uploads");
    const uploadState = document.querySelector(".uploadState");
    uploads.style.display = "block";

    task.on(
      "state_changed",
      function Progress(snap) {
        let per = (snap.bytesTransferred / snap.totalBytes) * 100;
        uploadState.setAttribute("aria-valuenow", per.toString());
        uploadState.style.width = `${per.toString()}%`;
        uploadState.innerHTML = `${per.toString()}%`;
      },
      function error(err) {
        console.log(err);
      },
      function complete() {
        setTimeout(() => {
          const index = idx - 1;
          if (imgList.hasOwnProperty(index) === false) {
            imgList[index] = [];
          }
          imgList[index].push(file);

          uploads.style.display = "none";
          console.log("upload complete");

          const imgItem = document.createElement("img");
          imgItem.classList.add("imgitem");

          const img = storage.ref().child("temp/" + file.name);
          img.getDownloadURL().then((url) => {
            imgItem.setAttribute("src", url);
          });

          const div = document.createElement("div");
          div.classList.add("imgWrap");
          div.append(imgItem);
          subMain.append(div);
          imgItemStack.push(div);

          console.log(imgList);
          console.log(imgItemStack);
        }, 1000);
      }
    );
  });

  removeImg.addEventListener("click", () => {
    const curIdx = idx - 1;
    const lastFile = imgList[curIdx].pop();

    if (lastFile !== undefined) {
      const item = imgItemStack.pop();
      if (item !== undefined) {
        item.remove();
      }
      storage.ref().child(`temp/${lastFile.name}`).delete();
    }
  });

  addItem.addEventListener("click", () => {
    AddItem(subMain);
  });

  removeItem.addEventListener("click", () => {
    if (idx == 0) {
      return;
    }
    const delItem = document.querySelector(`#item${idx - 1}`);
    delItem.remove();
    idx--;
  });

  saveBtn.addEventListener("click", () => {
    const mainTitle = document.querySelector("#mainTitle").value;
    const mainInfo = document.querySelector("#mainContents").value;
    const items = [];
    for (let i = 0; i < idx; i++) {
      const title = document.querySelector(`#itemTitle${i.toString()}`).value;
      const contents = document.querySelector(`#itemContents${i.toString()}`)
        .value;
      const imgItems = imgList.hasOwnProperty(i) ? imgList[i] : null;
      let imgs = [];

      if (imgItems !== null) {
        for (const file of imgItems) {
          imgs.push(file.name);
        }
      }

      items.push({
        title: title,
        contents: contents,
        imgs: imgs,
      });
    }

    const rootData = {
      title: mainTitle,
      info: mainInfo,
      items: items,
    };

    const postsRef = database.ref("posts/");
    if (selectedKey) {
      const redocsRef = database.ref("posts/" + selectedKey);
      repostRef.set({ rootData });
    } else {
      postsRef.push({ rootData });
    }

    console.log("save complete");
  });

  function AddItem(root) {
    console.log("additem");
    const div = document.createElement("div");
    div.id = `item${idx.toString()}`;

    const divctt = `
        <div class="postTitle_wrap">
            <label for="itemTitle${idx.toString()}" >Item Title</label>
            <input id="itemTitle${idx.toString()}" type="text"class="postTitle"></input>
        </div>
        <div class="postTitle_wrap">
            <label for="itemContents${idx.toString()}">Contents</label>
            <textarea id="itemContents${idx.toString()}" class="postTxt" style="resize:none;" rows="5"></textarea>
        </div>`;

    div.insertAdjacentHTML("beforeend", divctt);

    root.append(div);
    idx++;
  }
});
