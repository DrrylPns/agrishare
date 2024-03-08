import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BiSearch } from "react-icons/bi"
 
export function SearchInput() {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2 ">
      <Input id="search" name="search" type="text" placeholder="Search" className="pl-10 py-3 pr-5" />
      <Button variant={'default'} type="submit">Search</Button>
      <label htmlFor="search" className="absolute"><BiSearch/></label>
    </div>
  )
}