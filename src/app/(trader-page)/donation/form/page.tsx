"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { DonationSchema, DonationType } from "@/lib/validations/donation"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useState, useTransition } from "react"
import { FormSuccess } from "@/components/form-success"
import { FormError } from "@/components/form-error"
import { UploadButton } from "@/lib/uploadthing"


export default function Page() {
  const [imageUrl, setImageUrl] = useState<string>("")
  const imageIsEmpty = imageUrl.length === 0

  const form = useForm<DonationType>({
    resolver: zodResolver(DonationSchema),
  })

  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: async ({
      image,
      date,
      donatee,
      name,
      product,
    }: DonationType) => {
      const payload: DonationType = {
        image,
        date,
        donatee,
        name,
        product,
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
      date: values.date,
      donatee: values.donatee,
      name: values.name,
      product: values.product,
      image: imageUrl
    }

    createPost(payload)
  }

  return (
    <div className="w-full sm:w-3/5 mt-5 sm:mt-0 ">
      <Form {...form}>
        <h1 className='text-center text-4xl font-semibold mb-5'>Donation Form</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="font-poppins bg-green-200 p-10 rounded-2xl ">
          <h1 className='text-center text-xl font-medium mb-5'>Donation Information</h1>
          <div className="grid grid-cols-3 gap-5">
            <FormField
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
            />
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
          </div>

          <p className="text-xl font-poppins font-medium leading-6 mt-5 px-5 text-justify">We further certify that this is for free and that there is no payment exchange of monetary value for the distribution of said merchandise but you are required to fill out and give back to the CUAI office the evaluation form attached here.</p>

          <h1 className="text-center text-2xl font-semibold my-10">Acceptance</h1>
          <p className="text-xl font-poppins font-medium leading-6 mb-5 px-5 text-justify">That the Donee hereby accepts the foregoing donation from the Donor and for which he/his expresses his/her sincere appreciation and gratitude for the kindness shown by the Donor.</p>
          <div className="grid grid-cols-3">
            <FormField
              control={form.control}
              name="date"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="flex flex-col col-span-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
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
                          date > new Date() || date < new Date("1900-01-01")
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
          {/* Replace it with upload image */}
          <div>
            {!imageUrl.length && <h1 className="my-5">Upload E-Signature</h1>}

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