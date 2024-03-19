"use client"
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, CalendarIcon, LucideImagePlus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UploadDropzone } from '@/lib/uploadthing'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { AgrifeedSchema, AgrifeedType } from '@/lib/validations/agrifeed'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format, sub } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Category, Subcategory, Types } from '@prisma/client'


function CreatePost() {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [formStep, setFormStep] = useState(0)
  const [chosenCategory, setChosenCategory] = useState("")

  const imageIsEmpty = imageUrl.length === 0



  const form = useForm<AgrifeedType>({
    resolver: zodResolver(AgrifeedSchema),
    defaultValues: {
      image: "",
      color: "",
      description: "",
      name: "",
      preferedOffers: "",
      shelfLife: "",
      quantity: 0,
      weight: 0,
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
      shelfLife,
      type,
      weight,
      image,
      subcategory,
    }: AgrifeedType) => {
      const payload: AgrifeedType = {
        category,
        color,
        description,
        harvestDate,
        name,
        preferedOffers,
        quantity,
        shelfLife,
        type,
        weight,
        image,
        subcategory,
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
      shelfLife: values.shelfLife,
      type: values.type,
      harvestDate: values.harvestDate,
      subcategory: values.subcategory,
    }

    createPost(payload)
  }

  return (

    <div className='w-full px-10 py-5 border border-gray-700 rounded-3xl'>
      <h1 className='text-gray-300 text-lg'>Whats on your farm?</h1>
      <div className='flex text-[0.6rem] sm:text-sm mt-10 sm:mt-16 justify-between items-center border-t-2 pt-5 border-gray-300'>
        <Button variant='primary' className='flex gap-3 w-36 py-2 rounded-2xl'>
          <span><LucideImagePlus /></span>
          <span>Upload</span>
        </Button>

        <Dialog>
          <DialogTrigger className='bg-[#00B207] hover:bg-[#00B207]/80 text-white w-36 py-2 rounded-2xl'>
            Post
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-center'>
                {formStep === 0 && "Upload Image"}
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
                          alt='Done Upload'
                          src={"/done.svg"}
                          width={250}
                          height={250}
                          className='mb-3'
                        />
                        <h1 className='text-xl text-muted-foreground'>Image Uploaded!</h1>
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

                      <FormField
                        control={form.control}
                        name="shelfLife"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shelf Life</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter shelf life..." {...field} />
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
                                    <SelectItem value={Subcategory.EQUIPMENTS1}>Equipment 1</SelectItem>
                                  </>
                                )}
                                {chosenCategory === Category.FERTILIZER && (
                                  <>
                                    <SelectItem value={Subcategory.FERTILIZER1}>Fertilizer 1</SelectItem>
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
                                    <SelectItem value={Subcategory.TOOLS1}>Tools 1</SelectItem>
                                  </>
                                )}
                                {chosenCategory === Category.SOILS && (
                                  <>
                                    <SelectItem value={Subcategory.SOILS1}>Soils 1</SelectItem>
                                    <SelectItem value={Subcategory.SOILS2}>Soils 2</SelectItem>
                                    <SelectItem value={Subcategory.SOILS3}>Soils 3</SelectItem>
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
                                    <SelectItem value={Types.INORGANIC}>Inorganic</SelectItem>
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

                          if (!nameState.isDirty || nameState.invalid) return;
                          if (!descriptionState.isDirty || descriptionState.invalid) return;

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
                          form.trigger(['quantity', 'weight', 'color', 'shelfLife'])

                          const quantityState = form.getFieldState("quantity")
                          const weightState = form.getFieldState("weight")
                          const colorState = form.getFieldState("color")
                          const shelfLifeState = form.getFieldState("shelfLife")

                          const quantityValue = form.getValues("quantity")
                          const weightValue = form.getValues("weight")

                          console.log(quantityValue)
                          console.log(weightValue)

                          if (quantityValue <= 0 || weightValue <= 0) return toast({
                            description: "Please put a valid quantity or weight!",
                            variant: "destructive"
                          })

                          if (!quantityState.isDirty || quantityState.invalid) return;
                          if (!weightState.isDirty || weightState.invalid) return;
                          if (!colorState.isDirty || colorState.invalid) return;
                          if (!shelfLifeState.isDirty || shelfLifeState.invalid) return;

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
      </div>
    </div>
  )
}

export default CreatePost