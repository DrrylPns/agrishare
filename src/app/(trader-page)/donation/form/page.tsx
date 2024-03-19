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
import { useState } from "react"
 

export default function Page() {
    const [imageUrl, setImageUrl] = useState<string>("")
    const imageIsEmpty = imageUrl.length === 0

    const form = useForm<DonationType>({
        resolver: zodResolver(DonationSchema),
        defaultValues: {
          image: "",
          urbanFarmName: "",
          donator: "",
          productName: "",
        }
      })
  
      const { mutate: createPost, isLoading } = useMutation({
        mutationFn: async ({
            image,
            urbanFarmName,
            donator,
            productName,
            date,
        
        }: DonationType) => {
          const payload: DonationType = {
            image,
            urbanFarmName,
            donator,
            productName,
            date,
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
            image: imageUrl,
            urbanFarmName: values.urbanFarmName,
            donator: values.donator,
            productName: values.productName,
            date: values.date
           
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
            name="urbanFarmName"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <Input placeholder="Name of Urban farm/Organization" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="donator"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <Input placeholder="Name of Donator" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <Input placeholder="Name of Donation Product" {...field} />
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
          <h1 className="my-5">Upload E-Signature</h1>
          <Button>Upload file</Button>
        </div>
        <div className="text-right w-full">
          <Button className="rounded-full text-xl font-semibold tracking-wider px-10 py-5 h-16" type="submit">Submit</Button>
        </div>
      </form>
    </Form>
    </div>
   
  )
}