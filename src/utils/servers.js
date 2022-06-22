import { ENV } from "../constants";

const hostMap = {
  dev: "https://wright.zhsq.work:8085/wright/api"
  // qa: "https://wright.zhsq.work:8085/wright/api",
  // prod: "https://wright.zhsq.work:8085/wright/api"
};

const servers = {
  goodsStock: `${hostMap[ENV]}/goodsStock`,
  main: `${hostMap[ENV]}/main`,
  usr: `${hostMap[ENV]}/usr`,
  goods: `${hostMap[ENV]}/goods`,
  goodsCart: `${hostMap[ENV]}/goodsCart`,
  goodsEvaluation: `${hostMap[ENV]}/goodsEvaluation`,
  goodsUser: `${hostMap[ENV]}/goods-user`,
  order: `${hostMap[ENV]}/order`
};

export default servers;
