import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

function SelectSort() {
  return (
    <Select>
        <SelectTrigger className="w-[180px] ml-5">
            <SelectValue placeholder="Latest" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="reviews">Reviews</SelectItem>
            <SelectItem value="trade">Trade</SelectItem>
        </SelectContent>
    </Select>
  )
}

export default SelectSort