'use client'
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {usePathname, useRouter} from "next/navigation";
import {sortTypes} from "@/constants";

const Sort = () => {
  const paht = usePathname();
  const rotuter = useRouter();

  const handleSort = (value: string) => {
      rotuter.push(`${paht}?sort=${value}`)
  }
  return (
      <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
        <SelectTrigger className="sort-select">
          <SelectValue placeholder={sortTypes[0].value} />
        </SelectTrigger>
        <SelectContent className='sort-select-content'>
            {sortTypes.map((sort) => (
                <SelectItem key={sort.label} className='shad-select-item' value={sort.value}>{sort.label}</SelectItem>
            ))}
        </SelectContent>
      </Select>
  );
};

export default Sort;