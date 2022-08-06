import bridge from "@vkontakte/vk-bridge";

// открытие рекламного ролика
export function nativeAds(getPlatform) {
  const res = ["ios", "mobile-web"].includes(getPlatform)
    ? null
    : bridge
        .send("VKWebAppShowNativeAds", {
          ad_format: "preloader",
        })
        .then((res) => {
          console.log("nativeAds res", res);
        })
        .catch((err) => {
          console.log("nativeAds err", err);
        });
  console.log("getPlatform", getPlatform);
  console.log("nativeAds", res);
  return res;

  // bridge
  //   .send("VKWebAppShowNativeAds", {
  //     ad_format: "reward",
  //     use_waterfall: "interstitial",
  //   })
  //   .then((res) => {
  //     console.log("nativeAds res", res);
  //   })
  //   .catch((err) => {
  //     console.log("nativeAds err", err);
  //   });
}

/**
 * Открывает рекламный баннер на весь экран
 * @returns {Promise<boolean>}
 */
export async function showNativeAd() {
  try {
    const data = await bridge.send("VKWebAppShowNativeAds", {
      ad_format: "preloader",
    });

    return data.result !== undefined ? data.result : false;
  } catch (e) {
    return false;
  }
}
