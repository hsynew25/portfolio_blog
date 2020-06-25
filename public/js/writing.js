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
  const postsRef = database.ref("posts/");

  const subMain = document.querySelector(".subMain");
  const addImg = document.querySelector(".addImg");
  const addItem = document.querySelector(".addItem");
  const removeItem = document.querySelector(".removeItem");
  const uploadImg = document.querySelector(".uploadImg");
  const removeImg = document.querySelector(".removeImg");
  const saveBtn = document.querySelector(".saveBtn");
  const cancelBtn = document.querySelector(".cancelBtn");
  const maintitle = document.querySelector("#mainTitle");
  const maininfo = document.querySelector("#mainContents");
  const tag = document.querySelector("#mainTag");

  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("success");
      userInfo = user;
      console.log(userInfo.displayName);
    } else {
      console.log("login session is null");
    }
  });

  let curUrl = location.href;
  let keyidx = curUrl.indexOf("key=");
  const key = curUrl.slice(keyidx + 4);

  if (keyidx === -1) {
    console.log("no key");
  } else {
    selectedKey = key;
    postsRef.child(key).once("value").then(changePost);
  }

  addImg.addEventListener("click", () => {
    uploadImg.click();
  });

  uploadImg.addEventListener("change", UploadImg);

  removeImg.addEventListener("click", () => {
    const curIdx = idx - 1;
    const lastFile = imgList[curIdx].pop();

    if (lastFile !== undefined) {
      const item = imgItemStack.pop();
      if (item !== undefined) {
        item.remove();
      }
      storage
        .ref()
        .child(`temp/${lastFile.name ? lastFile.name : lastFile}`)
        .delete();
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

  cancelBtn.addEventListener("click", () => {
    window.location.replace("index.html");
  });

  saveBtn.addEventListener("click", () => {
    const mainTitle = maintitle.value;
    const mainInfo = maininfo.value;
    const mainTag = tag.value;
    const items = [];
    for (let i = 0; i < idx; i++) {
      const title = document.querySelector(`#itemTitle${i.toString()}`).value;
      const contents = document.querySelector(`#itemContents${i.toString()}`)
        .value;
      const imgItems = imgList.hasOwnProperty(i) ? imgList[i] : null;
      let imgs = [];

      if (imgItems !== null) {
        for (const file of imgItems) {
          if (file.name === undefined) {
            imgs.push(file);
          } else {
            imgs.push(file.name);
          }
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
      tag: mainTag,
      items: items,
    };
    console.log(rootData);
    if (selectedKey) {
      const repostRef = database.ref("posts/" + selectedKey);
      repostRef.set({ rootData });
    } else {
      postsRef.push({ rootData });
    }

    console.log("save complete");

    window.location.replace("index.html");
  });

  function UploadImg(e, key) {
    let file;
    if (key) {
      file = e;

      let index = idx - 1;
      if (imgList.hasOwnProperty(index) === false) {
        imgList[index] = [];
      }
      imgList[index].push(file);

      let imgItem = document.createElement("img");
      imgItem.classList.add("imgitem");

      let img = storage.ref().child("temp/" + file);
      img.getDownloadURL().then((url) => {
        imgItem.setAttribute("src", url);
      });

      let div = document.createElement("div");
      div.classList.add("imgWrap");
      div.append(imgItem);
      let rootdiv = document.querySelector(`#item${index}`);
      rootdiv.append(div);
      imgItemStack.push(div);
    } else {
      file = e.target.files[0];
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
            let index = idx - 1;
            if (imgList.hasOwnProperty(index) === false) {
              imgList[index] = [];
            }
            imgList[index].push(file);

            uploads.style.display = "none";
            console.log("upload complete");

            let imgItem = document.createElement("img");
            imgItem.classList.add("imgitem");

            let img = storage.ref().child("temp/" + file.name);
            img.getDownloadURL().then((url) => {
              imgItem.setAttribute("src", url);
            });

            let div = document.createElement("div");
            div.classList.add("imgWrap");
            div.append(imgItem);
            let rootdiv = document.querySelector(`#item${index}`);
            rootdiv.append(div);
            imgItemStack.push(div);

            console.log(imgList);
            // console.log(imgItemStack);
          }, 1000);
        }
      );
    }
  }

  function AddItem(root, key, data) {
    console.log("additem");
    const div = document.createElement("div");
    let divctt;
    div.id = `item${idx.toString()}`;
    if (key) {
      let keyData = data;
      let kitems = keyData.items;
      divctt = `
        <div class="postTitle_wrap">
            <label for="itemTitle${i}" >Item Title</label>
            <input id="itemTitle${i}" type="text"class="postTitle" value="${kitems[i].title}"></input>
        </div>
        <div class="postTitle_wrap">
            <label for="itemContents${i}">Contents</label>
            <textarea id="itemContents${i}" class="postTxt" style="resize:none;" rows="5">${kitems[i].contents}</textarea>
        </div>`;
    } else {
      divctt = `
      <div class="postTitle_wrap">
          <label for="itemTitle${idx.toString()}" >Item Title</label>
          <input id="itemTitle${idx.toString()}" type="text"class="postTitle"></input>
      </div>
      <div class="postTitle_wrap">
          <label for="itemContents${idx.toString()}">Contents</label>
          <textarea id="itemContents${idx.toString()}" class="postTxt" style="resize:none;" rows="5"></textarea>
      </div>`;
    }

    div.insertAdjacentHTML("beforeend", divctt);
    root.append(div);
    idx++;
    console.log(idx);
  }

  function changePost(data) {
    let keyData = data.val().rootData;
    console.log(keyData);
    const ktitle = keyData.title;
    const kinfo = keyData.info;
    const ktag = keyData.tag;
    let kitems = keyData.items;

    maintitle.value = ktitle;
    maininfo.value = kinfo;
    tag.value = ktag;

    for (i in kitems) {
      AddItem(subMain, selectedKey, keyData);
      for (j in kitems[i].imgs) {
        UploadImg(kitems[i].imgs[j], selectedKey);
      }
    }

    // console.log(kitems);
  }
});
