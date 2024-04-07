"use client"
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { UploadDropzone } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import { AgrifeedSchema, AgrifeedType } from '@/lib/validations/agrifeed'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category, ShelfLifeUnit, Subcategory, Types } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { format, sub } from 'date-fns'
import { ArrowLeft, ArrowRight, CalendarIcon } from 'lucide-react'
import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Post } from './_types'

type Props = {
  product: Post;
  isUpdateOpen: boolean;
  setIsUpdateOpen: Dispatch<SetStateAction<boolean>>;
}


function UpdateAgrifeedForm({
  isUpdateOpen,
  product,
  setIsUpdateOpen,
}: Props) {
  const [imageUrl, setImageUrl] = useState<string>(product.image)
  const [formStep, setFormStep] = useState(0)
  const [chosenCategory, setChosenCategory] = useState(product.category)

  const imageIsEmpty = imageUrl.length === 0

  const form = useForm<AgrifeedType>({
    resolver: zodResolver(AgrifeedSchema),
    defaultValues: {
      image: product.image,
      color: product.color,
      description: product.description,
      name: product.name,
      preferedOffers: product.preferedOffers,
      shelfLifeDuration: product.shelfLifeDuration,
      shelfLifeUnit: product.shelfLifeUnit,
      quantity: product.quantity,
      weight: product.weight,
      subcategory: product.subcategory as Subcategory,
      category: product.category as Category,
      harvestDate: product.harvestDate,
      type: product.type,
    }
  })

  useEffect(() => {
    form.resetField("type")
  }, [chosenCategory]);

  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: async ({
      category,
      color,
      description,
      harvestDate,
      name,
      preferedOffers,
      quantity,
      shelfLifeDuration,
      shelfLifeUnit,
      type,
      weight,
      image,
      subcategory,
      id,
    }: AgrifeedType) => {
      const payload: AgrifeedType = {
        category,
        color,
        description,
        harvestDate,
        name,
        preferedOffers,
        quantity,
        shelfLifeDuration,
        shelfLifeUnit,
        type,
        weight,
        image,
        subcategory,
        id: product.id,
      }

      const { data } = await axios.post("/api/agrifeedPost", payload)
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

  function onSubmit(values: AgrifeedType) {
    const payload: AgrifeedType = {
      category: values.category,
      color: values.color,
      description: values.description,
      image: imageUrl,
      name: values.name,
      preferedOffers: values.preferedOffers,
      quantity: values.quantity,
      weight: values.weight,
      shelfLifeDuration: values.shelfLifeDuration,
      shelfLifeUnit: values.shelfLifeUnit,
      type: values.type,
      harvestDate: values.harvestDate,
      subcategory: values.subcategory,
      id: product.id,
    }

    createPost(payload)
  }

  return (
    <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle className='text-center'>
            {formStep === 0 && "Upload Product Image"}
            {formStep === 1 && "Enter Info"}
            {formStep === 2 && "Specifics"}
            {formStep === 3 && "More info"}
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* STEP 1 */}
                <div className={`${formStep !== 0 && "hidden"}`}>
                  {imageUrl.length ? <div className="w-full flex flex-col items-center justify-center mt-5">
                    <Image
                      alt='product image'
                      src={imageUrl}
                      width={250}
                      height={250}
                      className='mb-3'
                    />
                    <Button variant="outline" onClick={() => setImageUrl("")}>Change</Button>
                  </div> : <UploadDropzone
                    className="text-green"
                    appearance={{
                      button: "bg-[#00B207] p-2 mb-3",
                      label: "text-green",
                      allowedContent: "flex h-8 flex-col items-center justify-center px-2 text-green",
                    }}
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      console.log('Files: ', res);
                      if (res && res.length > 0 && res[0].url) {
                        setImageUrl(res[0].url);
                      } else {
                        console.error('Please input a valid image.', res);
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
                  }
                </div>

                {/* STEP 2 */}
                <div className={`${formStep !== 1 && "hidden"} space-y-3 mb-1`}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Name..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter description.."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* STEP 3 */}
                <div className={`${formStep !== 2 && "hidden"} space-y-3 mb-1`}>

                  <FormField
                    control={form.control}
                    name="shelfLifeDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shelf Life Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter shelf life..." {...field} type='number' min={1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shelfLifeUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shelf Life Unit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={ShelfLifeUnit.DAY}>Day(s)</SelectItem>
                            <SelectItem value={ShelfLifeUnit.WEEK}>Week(s)</SelectItem>
                            <SelectItem value={ShelfLifeUnit.MONTH}>Month(s)</SelectItem>
                            <SelectItem value={ShelfLifeUnit.YEAR}>Year(s)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter quantity..." {...field} type='number' min={0} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight by (kg)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter weight..." {...field} type='number' min={0} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter color..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                </div>

                {/* STEP 4 */}
                <div className={`${formStep !== 3 && "hidden"} space-y-3 mb-1`}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <SelectItem value={Subcategory.FRUIT1}>Fruit 1</SelectItem>
                                <SelectItem value={Subcategory.FRUIT2}>Fruit 2</SelectItem>
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
                            {chosenCategory === Category.SEEDS && (
                              <>
                                <SelectItem value={Subcategory.SEEDS1}>Seeds 1</SelectItem>
                                <SelectItem value={Subcategory.SEEDS2}>Seeds 2</SelectItem>
                              </>
                            )}
                            {chosenCategory === Category.TOOLS && (
                              <>
                                <SelectItem value={Subcategory.SMALL}>Small</SelectItem>
                                <SelectItem value={Subcategory.MEDIUM}>Medium</SelectItem>
                                <SelectItem value={Subcategory.LARGE}>Large</SelectItem>
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

                  {(chosenCategory === Category.VEGETABLES || chosenCategory === Category.FRESH_FRUIT) && (
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Select onValueChange={(newValue) => {
                              chosenCategory === Category.VEGETABLES ||
                                chosenCategory === Category.FRESH_FRUIT
                                ? field.onChange(newValue)
                                : form.unregister("type")
                            }} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a type..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={Types.ORGANIC}>Organic</SelectItem>
                                <SelectItem value={Types.NOT_ORGANIC}>Not Organic</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="preferedOffers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Offers</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter preferred..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="harvestDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Harvest Date</FormLabel>
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
                                date > new Date() ||
                                date < sub(new Date(), { days: 3 }) // Limit to the last 3 days
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* STEP 1 BUTTON: NEXT STEP */}
                <Button
                  type='button'
                  variant="primary"
                  disabled={imageIsEmpty}
                  className={
                    cn(' text-white rounded-full w-full mt-3', {
                      'hidden': formStep !== 0
                    })
                  }
                  onClick={() => {
                    setFormStep(1)
                  }}
                >
                  Next Step <ArrowRight className='w-4 h-4 ml-2 font-bold' />
                </Button>



                <div className='flex flex-row justify-evenly gap-3'>
                  {/* STEP 2 BUTTON: GO BACK */}
                  <Button
                    type='button'
                    variant="primary"
                    className={
                      cn(' text-white rounded-full w-full mt-3', {
                        'hidden': formStep !== 1
                      })
                    }
                    onClick={() => {
                      setFormStep(0)
                    }}
                  >
                    <ArrowLeft className='w-4 h-4 mr-2 font-bold' />
                    Go Back
                  </Button>

                  {/* STEP 2 BUTTON: NEXT STEP */}
                  <Button
                    type='button'
                    variant="primary"
                    className={
                      cn(' text-white rounded-full w-full mt-3', {
                        'hidden': formStep !== 1
                      })
                    }
                    onClick={() => {
                      form.trigger(['name', 'description'])

                      const nameState = form.getFieldState("name")
                      const descriptionState = form.getFieldState("description")

                      if (nameState.invalid) return;
                      if (descriptionState.invalid) return;

                      setFormStep(2)
                    }}
                  >
                    Next Step<ArrowRight className='w-4 h-4 ml-2 font-bold' />
                  </Button>
                </div>

                <div className='flex flex-row justify-evenly gap-3'>
                  {/* STEP 3 BUTTON: GO BACK */}
                  <Button
                    type='button'
                    variant="primary"
                    className={
                      cn(' text-white rounded-full w-full mt-3', {
                        'hidden': formStep !== 2
                      })
                    }
                    onClick={() => {
                      setFormStep(1)
                    }}
                  >
                    <ArrowLeft className='w-4 h-4 mr-2 font-bold' />
                    Go Back
                  </Button>

                  {/* STEP 3 BUTTON: GO NEXT  */}
                  <Button
                    type='button'
                    variant="primary"
                    className={
                      cn(' text-white rounded-full w-full mt-3', {
                        'hidden': formStep !== 2
                      })
                    }
                    onClick={() => {
                      form.trigger(['quantity', 'weight', 'color', 'shelfLifeDuration', 'shelfLifeUnit'])

                      const quantityState = form.getFieldState("quantity")
                      const weightState = form.getFieldState("weight")
                      const colorState = form.getFieldState("color")
                      const shelfLifeDuration = form.getFieldState("shelfLifeDuration")
                      const shelfLifeUnit = form.getFieldState("shelfLifeUnit")

                      const quantityValue = form.getValues("quantity")
                      const weightValue = form.getValues("weight")

                      if (quantityValue <= 0 || weightValue <= 0) return toast({
                        description: "Please put a valid quantity or weight!",
                        variant: "destructive"
                      })

                      if (quantityState.invalid) return;
                      if (weightState.invalid) return;
                      if (colorState.invalid) return;
                      if (shelfLifeDuration.invalid) return;
                      if (shelfLifeUnit.invalid) return;

                      setFormStep(3)
                    }}
                  >
                    Next Step<ArrowRight className='w-4 h-4 ml-2 font-bold' />
                  </Button>
                </div>

                <div className='flex flex-row justify-evenly gap-3'>
                  {/* STEP 4 BUTTON: GO BACK */}
                  <Button
                    type='button'
                    variant="primary"
                    className={
                      cn(' text-white rounded-full w-full mt-3', {
                        'hidden': formStep !== 3
                      })
                    }
                    onClick={() => {
                      setFormStep(2)
                    }}
                  >
                    <ArrowLeft className='w-4 h-4 mr-2 font-bold' />
                    Go Back
                  </Button>

                  {/* STEP 4 BUTTON: save changes  */}
                  <Button
                    type='button'
                    variant="primary"
                    isLoading={isLoading}
                    disabled={isLoading}
                    className={
                      cn(' text-white rounded-full w-full mt-3', {
                        'hidden': formStep !== 3
                      })
                    }
                    onClick={() => {
                      form.handleSubmit(onSubmit)()
                    }}
                  >
                    Save Changes
                  </Button>
                </div>

              </form>
            </Form >
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateAgrifeedForm