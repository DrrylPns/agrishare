"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from "@/components/ui/use-toast"
import { UploadButton } from "@/lib/uploadthing"
import { DonationSchema, DonationType } from "@/lib/validations/donation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category, Subcategory } from '@prisma/client'
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { add, format, sub } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

export default function Page() {
  const [imageUrl, setImageUrl] = useState<string>("")
  const imageIsEmpty = imageUrl.length === 0
  const [chosenCategory, setChosenCategory] = useState("")
  const [size, setSize] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")

  const form = useForm<DonationType>({
    resolver: zodResolver(DonationSchema),
  })

  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: async ({
      image,
      // donatee,
      name,
      product,
      quantity,
      category,
      subcategory,
      pickUpDate,
      size,
    }: DonationType) => {
      const payload: DonationType = {
        image,
        // donatee,
        name,
        product,
        quantity,
        category,
        subcategory,
        pickUpDate,
        size
      }

      const { data } = await axios.post("/api/donate", payload)
      return data
    },
    onError: (err) => {
      return toast({
        title: 'Something went wrong.',
        description: `${err}`,
        variant: 'destructive',
      })
    },
    onSuccess: (data) => {
      toast({
        title: 'Success!',
        description: `${data}`,
        variant: 'default',
      })

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  })

  function onSubmit(values: DonationType) {
    const payload: DonationType = {
      // donatee: values.donatee,
      name: values.name,
      product: values.product,
      quantity: values.quantity,
      image: imageUrl,
      category: values.category,
      subcategory: values.subcategory,
      pickUpDate: values.pickUpDate,
      size,
    }

    createPost(payload)
  }

  return (
    <div className="w-full sm:w-3/5 mt-5 sm:mt-0 ">
      <Form {...form}>
        <h1 className='text-center text-4xl font-semibold mb-5'>Donation Form</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="font-poppins bg-green-200 p-10 rounded-2xl space-y-3">
          <h1 className='text-center text-xl font-medium mb-5'>Donation Information</h1>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
            {/* <FormField
              control={form.control}
              name="donatee"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name of Urban farm/Organization" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name of Donator" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name of Donation Product" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Quantity" {...field} disabled={isLoading} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={(newValue) => {
                    field.onChange(newValue);
                    setChosenCategory(newValue);
                  }}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Category.FRESH_FRUIT}>Fresh Fruit</SelectItem>
                      <SelectItem value={Category.VEGETABLES}>Vegetables</SelectItem>
                      <SelectItem value={Category.TOOLS}>Tools</SelectItem>
                      <SelectItem value={Category.EQUIPMENTS}>Equipments</SelectItem>
                      <SelectItem value={Category.SEEDS}>Seeds</SelectItem>
                      <SelectItem value={Category.SOILS}>Soils</SelectItem>
                      <SelectItem value={Category.FERTILIZER}>Fertilizer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <Select onValueChange={(newValue) => {
                    field.onChange(newValue)
                    setSelectedSubcategory(newValue)
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subcategory..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {chosenCategory === Category.VEGETABLES && (
                        <>
                          <SelectItem value={Subcategory.LEAFY_VEGETABLES}>Leafy Vegetables</SelectItem>
                          <SelectItem value={Subcategory.PODDED_VEGETABLES}>Podded Vegetables</SelectItem>
                          <SelectItem value={Subcategory.FRUIT_VEGETABLES}>Fruit Vegetables</SelectItem>
                          <SelectItem value={Subcategory.ROOT_VEGETABLES}>Root Vegetables</SelectItem>
                          <SelectItem value={Subcategory.HERBS_VEGETABLES}>Herbs Vegetables</SelectItem>
                        </>
                      )}
                      {chosenCategory === Category.FRESH_FRUIT && (
                        <>
                          <SelectItem value={Subcategory.CITRUS_FRUITS}>Citrus Fruits</SelectItem>
                          <SelectItem value={Subcategory.TROPICAL_FRUIT}>Tropical Fruit</SelectItem>
                          <SelectItem value={Subcategory.COCONUT}>Coconut</SelectItem>
                        </>
                      )}
                      {chosenCategory === Category.EQUIPMENTS && (
                        <>
                          <SelectItem value={Subcategory.SMALL}>Small</SelectItem>
                          <SelectItem value={Subcategory.MEDIUM}>Medium</SelectItem>
                          <SelectItem value={Subcategory.LARGE}>Large</SelectItem>
                        </>
                      )}
                      {chosenCategory === Category.FERTILIZER && (
                        <>
                          <SelectItem value={Subcategory.ORGANIC_FERTILIZER}>Organic Fertilizer</SelectItem>
                          <SelectItem value={Subcategory.NOT_ORGANIC_FERTILIZER}>Not Organic Fertilizer</SelectItem>
                        </>
                      )}
                      {/* {chosenCategory === Category.SEEDS && (
                        <>
                          <SelectItem value={Subcategory.SEEDS1}>Seeds 1</SelectItem>
                          <SelectItem value={Subcategory.SEEDS2}>Seeds 2</SelectItem>
                        </>
                      )} */}
                      {chosenCategory === Category.TOOLS && (
                        <>
                          <SelectItem value={Subcategory.WHEEL_BARROW}>Wheel Barrow</SelectItem>
                          <SelectItem value={Subcategory.WATER_HOSE}>Water Hose</SelectItem>
                          <SelectItem value={Subcategory.GARDEN_POTS}>Garden Pots</SelectItem>
                          <SelectItem value={Subcategory.BUCKET}>Bucket</SelectItem>
                          <SelectItem value={Subcategory.GLOVES}>Gloves</SelectItem>
                          <SelectItem value={Subcategory.HAND_PRUNES}>Hand Prunes</SelectItem>
                          <SelectItem value={Subcategory.KALAYKAY}>Kalaykay</SelectItem>
                          <SelectItem value={Subcategory.HOES}>Hoes</SelectItem>
                          <SelectItem value={Subcategory.SHOVEL}>Shovel</SelectItem>
                        </>
                      )}
                      {chosenCategory === Category.SOILS && (
                        <>
                          <SelectItem value={Subcategory.ORGANIC_SOIL}>Organic Soil</SelectItem>
                          <SelectItem value={Subcategory.NOT_ORGANIC_SOIL}>Not Organic Soil</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* {(
            selectedSubcategory === Subcategory.WATER_HOSE ||
            selectedSubcategory === Subcategory.GARDEN_POTS ||
            selectedSubcategory === Subcategory.BUCKET ||
            selectedSubcategory === Subcategory.KALAYKAY ||
            selectedSubcategory === Subcategory.SHOVEL
          ) && (
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sizes</SelectLabel>
                    <SelectItem value="apple">Small</SelectItem>
                    <SelectItem value="banana">Medium</SelectItem>
                    <SelectItem value="blueberry">Large</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )} */}

          {selectedSubcategory === Subcategory.WATER_HOSE ? (
            <Select onValueChange={(newValue) => setSize(newValue)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sizes</SelectLabel>
                  <SelectItem value="1/4">1/4</SelectItem>
                  <SelectItem value="1/2">1/2</SelectItem>
                  <SelectItem value="3/4">3/4</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : selectedSubcategory === Subcategory.GARDEN_POTS ? (
            <Select onValueChange={(newValue) => setSize(newValue)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sizes</SelectLabel>
                  <SelectItem value="SmallGarden">Small</SelectItem>
                  <SelectItem value="MediumGarden">Medium</SelectItem>
                  <SelectItem value="LargeGarden">Large</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : selectedSubcategory === Subcategory.BUCKET ? (
            <Select onValueChange={(newValue) => setSize(newValue)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sizes</SelectLabel>
                  <SelectItem value="SmallBucket">Small</SelectItem>
                  <SelectItem value="MediumBucket">Medium</SelectItem>
                  <SelectItem value="LargeBucket">Large</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : selectedSubcategory === Subcategory.KALAYKAY ? (
            <Select onValueChange={(newValue) => setSize(newValue)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sizes</SelectLabel>
                  <SelectItem value="SmallKalaykay">Small</SelectItem>
                  <SelectItem value="LargeKalaykay">Large</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : selectedSubcategory === Subcategory.SHOVEL ? (
            <Select onValueChange={(newValue) => setSize(newValue)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sizes</SelectLabel>
                  <SelectItem value="SmallShovel">Small</SelectItem>
                  <SelectItem value="LargeShovel">Large</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : ""}


          <FormField
            control={form.control}
            name="pickUpDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Pick up date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() ||
                        date > add(new Date(), { days: 7 })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="text-xl font-poppins font-medium leading-6 mt-5 px-5 text-justify">We further certify that this is for free and that there is no payment exchange of monetary value for the distribution of said merchandise but you are required to fill out and give back to the CUAI office the evaluation form attached here.</p>

          <h1 className="text-center text-2xl font-semibold my-10 mt-2 md:mt-10">Acceptance</h1>
          <p className="text-xl font-poppins font-medium leading-6 mb-5 px-5 text-justify">That the Donee hereby accepts the foregoing donation from the Donor and for which he/his expresses his/her sincere appreciation and gratitude for the kindness shown by the Donor.</p>
          {/* Replace it with upload image */}
          <div>
            {!imageUrl.length && <h1 className="my-5">Upload Photo</h1>}

            {imageUrl.length ?
              <>
                <h1 className='mt-3 text-gray-500'>Uploaded Successfully</h1>
                <div
                  className="cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground w-fit p-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => {
                    setImageUrl("")
                  }}
                >Change</div>
              </>
              :
              <div className="flex flex-col items-start">
                <UploadButton
                  className="text-green"
                  appearance={{
                    button: "bg-[#099073] p-2",
                    allowedContent: "flex h-8 flex-col px-2 text-green",
                  }}
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    console.log('Files: ', res);
                    if (res && res.length > 0 && res[0].url) {
                      setImageUrl(res[0].url);
                    } else {
                      console.error('Please input a valid product image.', res);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      title: 'Error!',
                      description: error.message,
                      variant: 'destructive',
                    })
                  }}
                />
              </div>
            }

          </div>
          <div className="text-right w-full">
            <Button className="rounded-full text-xl font-semibold tracking-wider px-10 py-5 h-16" type="submit" disabled={imageIsEmpty || isLoading} isLoading={isLoading}>Submit</Button>
          </div>
        </form>
      </Form>
    </div>

  )
}