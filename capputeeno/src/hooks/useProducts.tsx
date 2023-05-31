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
function getFieldByPriority(priority: PriorityTypes){
  if(priority === PriorityTypes.NEWS) return {field:"created_at", order: "ASC"}
  if(priority === PriorityTypes.BIGGEST_PRICE) return {field:"price_in_cents", order: "ASC"}
  if(priority === PriorityTypes.MINOR_PRICE) return {field:"price_in_cents", order: "DSC"}
  return {field:"sales", order: "DSC"}
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
   const sortSettings = getFieldByPriority(priority)
   const categoryFilter = getCategoryByType(type)
   return `
    query {
      allProducts ( sortField: "${sortSettings.field}",sortOrder: "${sortSettings.order}",${categoryFilter? `filter: {category:"${categoryFilter}"}`: ''}) {
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
    queryKey: ['products', type, priority]
  })
  return {
    data: data?.data?.data?.allProducts
  }
}