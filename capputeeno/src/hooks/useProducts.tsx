import { ProductsFecthResponse } from "@/types/productsResponse";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosPromise } from "axios";
import { useFilter } from "./useFilter";
import { FilterType } from "@/types/filter-types";
import { PriorityTypes } from "@/types/priority-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

function getCategoryByType (type: FilterType) {
  if(type === FilterType.MUG) return "mugs";
  if(type === FilterType.SHIRT) return "t-shirt";

  return'';
}
const fetcher = (query:string) : AxiosPromise<ProductsFecthResponse> => {
  return axios.post(
  API_URL,
  { query });
}

const mountQuery = (type: FilterType, priority: PriorityTypes) => {
  if(type == FilterType.ALL && priority ===PriorityTypes.POPULARITY) return `query {
    allProducts(sortField: "sales", sortOrder: "DSC") {
      id
      name
      price_in_cents
      image_url
    }
   }`
   return `
    query {
      allProducts (filter: {category:"${getCategoryByType(type)}"}) {
        id
        name
        price_in_cents
        image_url
        category
      }
    }
   `
}
export function useProducts(){
  const {type, priority} = useFilter()
  const query = mountQuery(type,priority)
  const {data} = useQuery({
    queryFn:()=> fetcher(query),
    queryKey: ['products', type]
  })
  return {
    data: data?.data?.data?.allProducts
  }
}