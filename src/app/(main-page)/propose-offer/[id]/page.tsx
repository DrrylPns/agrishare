'use client'
import React, { useState } from 'react'
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadDropzone } from '@/lib/uploadthing'
import Image from 'next/image'
import { toast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'

function Page({
    params
}:{
    params:{
        id:string
    }
}) {

    const numberError = { message: "Field must be 0 or more" }   
    const [imageUrl, setImageUrl] = useState<string>('')
    const imageIsEmpty = imageUrl.length === 0
    const formSchema = z.object({
        imageUrl: z.string(),
        item: z.string({
            required_error:"Please select an item"
        }),
        quantity: z.coerce.number().min(0, numberError),
        value: z.coerce.number().min(0, numberError),
        weight: z.coerce.number().min(0, numberError),
        description: z.string({
            required_error: "Add some description!"
        }).min(5,{
            message: "Make atleast 5 character long"
        })
    })
  
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        imageUrl: '',
        item: "",
        quantity: 0,
        value: 0,
        weight: 0,
        description: ''
    },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }


  return (
    <div className='w-full sm:w-3/5 mt-5 sm:mt-0 p-10 border border-gray-300 rounded-xl'>
        <h1 className='text-center text-xl font-semibold'>Propose Offer</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {imageUrl.length ? <div
                className='flex justify-center items-center flex-col'
            >

                <Image
                    alt='Done Upload'
                    src={imageUrl}
                    width={250}
                    height={250}
                    className='mb-3'
                />
                <h1 className='mt-3 text-gray-500'>Uploaded Successfully</h1>
            </div> : <UploadDropzone
                className="text-green"
                appearance={{
                    button: "bg-[#099073] p-2",
                    label: "text-green",
                    allowedContent: "flex h-8 flex-col items-center justify-center px-2 text-green",
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
            />}
            <div className='grid grid-cols-2 gap-10'>    
            <FormField
                control={form.control}
                name="item"
                render={({ field }) => (
            <FormItem>
              <FormLabel>Item</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FRESH_FRUITS">Fresh fruits</SelectItem>
                  <SelectItem value="VEGETABLES">Vegetables</SelectItem>
                  <SelectItem value="TOOLS">Tools</SelectItem>
                  <SelectItem value="EQUIPMENTS">Equipments</SelectItem>
                  <SelectItem value="SEEDS">Seeds</SelectItem>
                  <SelectItem value="SOILS">Soils</SelectItem>
                  <SelectItem value="FERTILIZER">Fertilizer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
                )}
            />

            <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                    <Input placeholder="P" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            </div>
            
            <div className='grid grid-cols-2 gap-10'>
            <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
                <FormItem className='col'>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                    <Input placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
                <FormItem className='col'>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                    <Input placeholder="1 Kg" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your item here"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='text-center'>

            <Button type="submit">Send Offer</Button>
        </div>
        </form>
        </Form>

    </div>
  )
}

export default Page