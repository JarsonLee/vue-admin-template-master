import request from "@/utils/request";

export const reqSpuList = (page, limit, category3Id) =>
  request({
    url: `/admin/product/${page}/${limit}`,
    method: "get",
    params: { category3Id },
  });

export const reqSpu = (spuId) =>
  request({ url: `/admin/product/getSpuById/${spuId}`, method: "get" });

export const reqTradeMarkList = () =>
  request({
    url: `/admin/product/baseTrademark/getTrademarkList`,
    method: "get",
  });

export const reqSpuImageList = (spuId) =>
  request({ url: `/admin/product/spuImageList/${spuId}`, method: "get" });

export const reqBaseSaleAttrList = () =>
  request({ url: "/admin/product/baseSaleAttrList", method: "get" });

export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    return request({
      url: "/admin/product/updateSpuInfo",
      method: "post",
      data: spuInfo,
    });
  } else {
    return request({
      url: "/admin/product/saveSpuInfo",
      method: "post",
      data: spuInfo,
    });
  }
};

export const reqDeleteSpu = (spuId) =>
  request({ url: `/admin/product/deleteSpu/${spuId}`, method: "delete" });

export const reqSpuImageLIst = (spuId) =>
  request({ url: `/admin/product/spuImageList/${spuId}`, method: "get" });

export const reqSpuSaleAttrList = (spuId) =>
  request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: "get" });

export const reqAttrInfoList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });

export const reqAddSku = (skuInfo) =>
  request({ url: "/admin/product/saveSkuInfo", method: "post", data: skuInfo });

export const reqSkuList = (spuId) =>
  request({ url: `/admin/product/findBySpuId/${spuId}`, method: "get" });
