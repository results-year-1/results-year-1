import bridge from "@vkontakte/vk-bridge";
import axios from "axios";
import {
  GROUP_ID_SUBSCRIPTION,
  APP_ID_DEFAULT,
  USER_ID,
  rootUrl,
  notifyUrl,
} from "../constants";
import { navigate } from "@reach/router";
import sharing from "../img/sharing.png";

export const incrementCountButton = (type) => {
  axios
    .post(`${rootUrl}/edit`, {
      key: type,
      value: 1,
    })
    .then(function (response) {
      // console.log("incrementCountButton", response);
    })
    .catch(function (error) {
      // console.log("incrementCountButton", error);
    });
};

// получение токена пользователя
export const getUserToken = async (setUserToken, appID) => {
  let token = "";

  await bridge
    .send("VKWebAppGetAuthToken", {
      app_id: appID,
      scope: "friends,wall,photos, stories",
    })
    .then((res) => {
      token = res.access_token;
    })
    .catch((err) => {});

  if (!token) {
    await bridge
      .send("VKWebAppGetAuthToken", {
        app_id: appID,
        scope: "friends,wall,photos, stories",
      })
      .then((res) => {
        token = res.access_token;
      })
      .catch((err) => {});
  }

  return token;
};

// разрешение на отправку сообщений от имени группы
export function subscribeMessageFromGroupDefault(
  groupIDsubscription,
  setTemplatePage,
  nextPage
) {
  bridge
    .send("VKWebAppAllowMessagesFromGroup", {
      group_id: groupIDsubscription,
    })
    .then((res) => {
      setTemplatePage(nextPage);
    })
    .catch((err) => {
      bridge
        .send("VKWebAppAllowMessagesFromGroup", {
          group_id: groupIDsubscription,
        })
        .then((res) => {
          setTemplatePage(nextPage);
        })
        .catch((err) => {
          bridge
            .send("VKWebAppAllowMessagesFromGroup", {
              group_id: groupIDsubscription,
            })
            .then((res) => {
              setTemplatePage(nextPage);
            })
            .catch((err) => {
              setTemplatePage(nextPage);
            });
        });
    });
}

// разрешение на отправку сообщений от имени группы
export function subscribeMessageFromGroupTasks(
  openAlert,
  groupIDsubscription,
  typeState
) {
  bridge
    .send("VKWebAppAllowMessagesFromGroup", {
      group_id: groupIDsubscription,
    })
    .then((res) => {
      // console.log("subscribeMessageFromGroup result", res);
      typeState(true);
      // incrementCountButton("stats.button2");
    })
    .catch((err) => {
      // console.log("subscribeMessageFromGroup result", err);

      openAlert(
        `Чтобы узнать результат, разрешите отправку сообщений от имени группы`,
        "red"
      );
      typeState(false);
    });
}

// подписка на группу
export function addGroup(group_id, page) {
  bridge
    .send("VKWebAppJoinGroup", { group_id: group_id })
    .then(({ result }) => {
      // incrementCountButton(`stats.buttonPage_${page}`);
    })
    .catch((err) => {
      bridge
        .send("VKWebAppJoinGroup", { group_id: group_id })
        .then(({ result }) => {
          // incrementCountButton(`stats.buttonPage_${page}`);
        });
    });
}

// добавление сервиса в сообщество
export function AddToCommunity() {
  bridge
    .send("VKWebAppAddToCommunity", {})
    .then((res) => {
      if (res.group_id) {
        return true;
      }
    })
    .catch((err) => {
      return false;
    });
}

// открытие др приложение
export function goToApp(appID) {
  bridge.send("VKWebAppOpenApp", { app_id: appID, location: "GLI" });
}

// добавление сервиса в сообщество
export async function subscribeAppNotifications() {
  let result = false;

  await bridge
    .send("VKWebAppAllowNotifications", {})
    .then((res) => {
      // console.log("VKWebAppAllowNotifications res", res);
      result = true;

      axios
        .post(`${notifyUrl}/add-user`, {
          id: USER_ID,
        })
        .then((response) => {
          // console.log("app-notify res", response);
        })
        .catch((error) => {
          // console.log("app-notify res", response);
        });
    })
    .catch((err) => {
      console.log("VKWebAppAllowNotifications res", err);
      result = false;
    });

  // console.log("result", result);
  return result;
}

export const returnMethod = async (count, asyncFn) => {
  let success = false;

  for (let i = 0; i < count; i++) {
    if (success === true) {
      fn(page);
      return;
    } else {
      success = await asyncFn();
    }
  }
};

export const returnAsyncMethod = async (arr, seconds) => {
  const promise = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
        console.log("Promise resolve", timeout);
      }, timeout * 1000);
    });
  };

  for (const seconds of arr) {
    await promise(seconds);
  }
};

export const returnAsyncFnMethod = async (arrFn) => {
  const promise = (currentFn) => {
    return new Promise(async (resolve) => {
      await currentFn();
      resolve();
    });
  };

  for (const targetFn of arrFn) {
    await promise(targetFn);
  }
};

export const publishPhotoInAlbum = async (userToken) => {
  const sharingText = `
  Узнай статистику за 2021г. 
  Сколько сделал шагов? 
  Сколько написал сообщений? Сколько времени слушал музыку? 😅
  Запускай по ссылке 👇
  https://vk.com/app${APP_ID_DEFAULT}
  `;

  const albumId = await bridge.send("VKWebAppCallAPIMethod", {
    method: "photos.createAlbum",
    params: {
      title: "ILLUMINATE TEST",
      description: sharingText,
      v: 5.131,
      access_token: userToken,
    },
  });

  // console.log("albumId", albumId);

  const uploadUrl = await bridge.send("VKWebAppCallAPIMethod", {
    method: "photos.getUploadServer",
    params: {
      album_id: albumId.response.id,
      v: 5.131,
      access_token: userToken,
    },
  });

  // console.log("uploadUrl", uploadUrl);

  // const img = [img1, img2, img3, img4][getRandomInt(0, 3)];
  const img = sharing;

  // console.log("img", img);
  const blob = await (await fetch(img)).blob();
  const formData = new FormData();
  formData.append("file", blob, "image.png");
  // console.log("formData", formData);

  const proxy = "https://gold-proxy-photo.ru:9999";

  const { data: result } = await axios({
    method: "post",
    url: `${proxy}/${uploadUrl.response.upload_url}`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });

  const photoSave = await bridge.send("VKWebAppCallAPIMethod", {
    method: "photos.save",
    params: {
      album_id: albumId.response.id,
      v: 5.131,
      access_token: userToken,
      hash: result.hash,
      photos_list: result.photos_list,
      server: result.server,
      caption: sharingText,
    },
  });

  // console.log("photoSave", photoSave);
};
