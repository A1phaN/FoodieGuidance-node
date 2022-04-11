interface Dish {
  name: string;
  img: string;
  canteen: string;
  floor?: string;
  window?: string;
  start: string;
  end: string;
  price: number;
  remark?: string;
  reporter?: string;
}

interface ApiResponse<Data = never> {
  code: number;
  data?: Data;
  msg?: string;
}
