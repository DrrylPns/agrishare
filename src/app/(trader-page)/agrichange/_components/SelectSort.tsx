import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function SelectSort({ setSelectedSort }:{setSelectedSort: any}) {
  return (
      <Select>
          <SelectTrigger className="w-[180px] ml-5">
              <SelectValue placeholder="Latest" />
          </SelectTrigger>
          <SelectContent>
              <SelectItem value="latest" onClick={() => setSelectedSort('latest')}>Latest</SelectItem>
              <SelectItem value="transaction" onClick={() => setSelectedSort('transaction')}>Trade</SelectItem>
          </SelectContent>
      </Select>
  )
}

export default SelectSort
