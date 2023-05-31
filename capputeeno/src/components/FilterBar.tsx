"use client"
import styled from "styled-components";
import { FilterBarTypes } from "./FilterBarType";
import { FilterByPriority } from "./FilterByPriority";

interface FilterBarProps {

}
const FilterContainer = styled.div`
display: flex;
width: 100%;
align-items: start;
justify-content: space-between;
`;
export function FilterBar(props: FilterBarProps){
  return(
    <FilterContainer>
      <FilterBarTypes/>
      <FilterByPriority/>
    </FilterContainer>
  )
}