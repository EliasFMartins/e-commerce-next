import { Product } from "./product"

export interface ProductsFecthResponse {
  data: {
    allProducts: Product[]
  }
}