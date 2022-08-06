import React, { useState, useEffect } from "react";
// import { Button } from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import cn from "classnames";
import "./ResultPanel.scss";
import { story } from "../../sharing-method";
import { nativeAds } from "../../ads";
import { Modal, Button } from "antd";
import { SettingLightIcon } from "../../icons";
import { ResultModal } from "./ResultModal/index";

import {
  APP_IMG_SHARING_STORIES,
  APP_ILLUMINATE,
  APP_STATISTICS,
  APP_REMEMBER_SUMMER,
  APP_STATS_APP,
  APP_SQUID_GAME,
  APP_MY_LOVE_1,
  NAME_PROJECT,
} from "../../constants";
import { AnimationStars } from "../../components";
import { navigate } from "@reach/router";

const ResultPanel = ({
  id,
  go,
  IMGresult,
  getPlatform,
  openAlert,
  snackbar,
  fetchedUser,
  getGroupId,
  appID,
  imgIndex,
  notifyLinks,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      nativeAds(getPlatform);
    }, 3000);
  }, []);

  function success() {
    Modal.success({
      title: "Ваши результаты",
      content: (
        <div>
          <p>Сообщений отправлено за год: 856 412</p>
          <p>Шагов за год: 1 642 286</p>
        </div>
      ),
      onOk() {},
    });
  }

  const showModal = () => {
    setIsModalVisible(true);
    setTimeout(() => {
      success();
    }, 60 * 10 * 1000);
  };

  const openNewApp = (appId) => {
    bridge
      .send("VKWebAppOpenApp", { app_id: appId, location: "new-app" })
      .then((res) => {})
      .catch((err) => {});
  };

  return (
    <>
      <AnimationStars />
      <div
        className={cn({
          "result-panel": true,
          web: getPlatform === "web",
        })}
      >
        <Button
          className="buttons"
          onClick={() => story(APP_IMG_SHARING_STORIES[imgIndex])}
        >
          Посмотреть результат
        </Button>
        <Button className="buttons small-text" onClick={showModal}>
          Узнать кол-во сообщений и шагов за 2021г
        </Button>
      </div>
      <ResultModal
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        showModal={showModal}
        notifyLinks={notifyLinks}
        success={success}
      />

      {/* <Modal
        title="Кол-во сообщений и шагов за 2021г"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          <SettingLightIcon color="black" />
          <Timer expiryTimestamp={time} />
          <p>Чтобы узнать результат нажмите кнопку ниже</p>
          <Button
            type="primary"
            href={notifyLinks[`${NAME_PROJECT}_linkTelegram`]}
            target="_blank"
            onClick={handleOk}
          >
            Узнать
          </Button>
        </div>
      </Modal> */}
    </>
  );
};

export { ResultPanel };
