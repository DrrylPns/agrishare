'use client'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { PageNF } from '@/components/not-found'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { UploadDropzone } from '@/lib/uploadthing'
import { formattedCategory } from '@/lib/utils'
import { TradeSchema, TradeType } from '@/lib/validations/trade'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category, Subcategory } from '@prisma/client'
import Image from 'next/image'
import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { BeatLoader } from 'react-spinners'
import { z } from "zod"
import { fetchPost } from '../../../../../actions/fetchPost'
import { trade } from '../../../../../actions/trade'
import { Post } from '../../agrifeed/_components/_types'

function Page({
    params
}: {
    params: {
        id: string
    }
}) {
    const [post, setPost] = useState<Post>()
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition()
    const [chosenCategory, setChosenCategory] = useState("")
    const [imageUrl, setImageUrl] = useState<string>('')
    const [number, setNumber] = useState<number>(1)
    const [tradeeId, setTradeeId] = useState<string>()
    const [postId, setPostId] = useState<string>()
    const [size, setSize] = useState("")
    const [selectedSubcategory, setSelectedSubcategory] = useState("")

    const imageIsEmpty = imageUrl.length === 0

    useEffect(() => {
        fetchPostByParams()
    }, [params.id])

    const fetchPostByParams = async () => {
        const post = await fetchPost(params.id)
        setPost(post as Post)
        if (post) {
            setTradeeId(post.User.id);
            setPostId(post.id)
        }
    }

    const handleSubtract = () => {
        if (number > 0) {
            setNumber(prev => prev - 1)
        }
    }

    const handleAdd = () => {
        if (post && number < post.quantity) {
            setNumber(prev => prev + 1)
        }
    }

    const form = useForm<z.infer<typeof TradeSchema>>({
        resolver: zodResolver(TradeSchema),
        defaultValues: {
            item: "",
            // quantity: 0,
            // value: 0,
            weight: 0,
            description: '',
        },
    })

    function onSubmit(values: z.infer<typeof TradeSchema>) {
        setError("");
        setSuccess("");

        startTransition(() => {

            if (number <= 0) {
                toast({
                    description: "Quantity can't be less than 0",
                    variant: "destructive",
                })
            } else {
                trade(values as TradeType, number, tradeeId as string, imageUrl, postId as string).then((data) => {
                    if (data?.error) {
                        form.reset()
                        setError(data.error)
                    }

                    if (data?.success) {
                        form.reset()
                        setImageUrl("")
                        setNumber(0)
                        setSuccess(data.success);
                    }
                }).catch(() => setError("Something went wrong"))
            }
        })
    }

    if (post === undefined) return <BeatLoader />

    if (!post) return <PageNF />


    return (
        <div className='w-full overflow-hidden flex flex-col items-center justify-center gap-3 pb-20 max-lg:pt-20'>
            <div className='w-full sm:w-3/5 mt-5 sm:mt-0 p-10 border border-gray-300 rounded-xl'>
                <h1 className='text-3xl font-semibold text-center mb-3'>You are currently trading:</h1>

                <div className='flex flex-col lg:flex-row justify-evenly items-center lg:items-start space-x-2'>
                    <Image
                        src={post.image}
                        alt={post.name}
                        width={300}
                        height={300}
                        className='lg:w-2/5 h-72 object-center border border-gray-300'
                    />

                    <div className='md:text-start text-center space-y-3'>
                        <h1 className='text-3xl font-medium'>{post.name}</h1>
                        <p className=''>Remaining stocks: {post.quantity}</p>
                        <h1 className='text-sm text-gray-700'>Category: <span className='text-gray-500'>{formattedCategory(post.category)}</span></h1>
                        <h1>Choose how many {post.name} {" "} do you want to trade:</h1>
                        <div className='flex flex-row items-center justify-center lg:justify-start'>

                            <Button variant={'secondary'}
                                onClick={handleSubtract}
                            >
                                -
                            </Button>
                            <h1 className='px-3'>{number}</h1>
                            <Button variant={'secondary'}
                                onClick={handleAdd}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

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
                            content={{
                                label: "Max 4MB (png, jpeg, svg)"
                            }}
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

                        <FormField
                            control={form.control}
                            name="item"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Item" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
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
                                                        <SelectItem value={Subcategory.AmpalayaLeaves}>Ampalaya Leaves (Dahon ng Ampalaya)</SelectItem>
                                                        <SelectItem value={Subcategory.WaterSpinach}>Water Spinach (Kangkong)</SelectItem>
                                                        <SelectItem value={Subcategory.SweetPotatoLeaves}>Sweet Potato Leaves (Talbos ng Kamote)</SelectItem>
                                                        <SelectItem value={Subcategory.MalabarSpinach}>Malabar Spinach (Alugbati)</SelectItem>
                                                        <SelectItem value={Subcategory.JewsMallow}>Jews Mallow (Saluyot)</SelectItem>
                                                        <SelectItem value={Subcategory.ChiliLeaves}>Chili Leaves (Dahon ng Sili)</SelectItem>
                                                        <SelectItem value={Subcategory.Moringaoleifera}>Moringa oleifera (Malunggay)</SelectItem>
                                                        <SelectItem value={Subcategory.TaroLeaves}>Taro Leaves (Dahon ng Gabi)</SelectItem>
                                                        <SelectItem value={Subcategory.OnionLeaves}>Onion Leaves</SelectItem>
                                                        <SelectItem value={Subcategory.PetchayNative}>Petchay (Native)</SelectItem>
                                                        <SelectItem value={Subcategory.PetchayBaguio}>Petchay (Baguio)</SelectItem>
                                                        <SelectItem value={Subcategory.CabbageRareBall}>Cabbage (Rare Ball)</SelectItem>
                                                        <SelectItem value={Subcategory.CabbageScorpio}>Cabbage (Scorpio)</SelectItem>
                                                        <SelectItem value={Subcategory.Basil}>Basil</SelectItem>
                                                        <SelectItem value={Subcategory.Sitao}>Sitao</SelectItem>
                                                        <SelectItem value={Subcategory.BaguioBeans}>Baguio Beans</SelectItem>
                                                        <SelectItem value={Subcategory.GiantPatani}>Giant Patani</SelectItem>
                                                        <SelectItem value={Subcategory.Eggplant}>Eggplant</SelectItem>
                                                        <SelectItem value={Subcategory.Ampalaya}>Ampalaya</SelectItem>
                                                        <SelectItem value={Subcategory.Tomato}>Tomato</SelectItem>
                                                        <SelectItem value={Subcategory.Chili}>Chili</SelectItem>
                                                        <SelectItem value={Subcategory.BellPepperGreen}>Bell Pepper(Green)</SelectItem>
                                                        <SelectItem value={Subcategory.BellPepperRed}>Bell pepper(Red)</SelectItem>
                                                        <SelectItem value={Subcategory.Squash}>Squash</SelectItem>
                                                        <SelectItem value={Subcategory.BlueTarnette}>Blue Tarnette</SelectItem>
                                                        <SelectItem value={Subcategory.Patola}>Patola</SelectItem>
                                                        <SelectItem value={Subcategory.Okra}>Okra</SelectItem>
                                                        <SelectItem value={Subcategory.Carrots}>Carrots</SelectItem>
                                                        <SelectItem value={Subcategory.WhitePotato}>White Potato</SelectItem>
                                                        <SelectItem value={Subcategory.Chayote}>Chayote</SelectItem>
                                                        <SelectItem value={Subcategory.RedOnion}>Red Onion</SelectItem>
                                                        <SelectItem value={Subcategory.WhiteOnion}>White Onion</SelectItem>
                                                        <SelectItem value={Subcategory.WhiteOnionImported}>White Onion(Imported)</SelectItem>
                                                        <SelectItem value={Subcategory.GarlicImported}>Garlic(Imported)</SelectItem>
                                                        <SelectItem value={Subcategory.GarlicNative}>Garlic(Native)</SelectItem>
                                                        <SelectItem value={Subcategory.Ginger}>Ginger</SelectItem>
                                                    </>
                                                )}
                                                {/* {chosenCategory === Category.FRESH_FRUIT && (
                        <>
                          <SelectItem value={Subcategory.CITRUS_FRUITS}>Citrus Fruits</SelectItem>
                          <SelectItem value={Subcategory.TROPICAL_FRUIT}>Tropical Fruit</SelectItem>
                          <SelectItem value={Subcategory.COCONUT}>Coconut</SelectItem>
                        </>
                      )} */}
                                                {chosenCategory === Category.FRESH_FRUIT && (
                                                    <>
                                                        <SelectItem value={Subcategory.Calamansi}>Calamansi</SelectItem>
                                                        <SelectItem value={Subcategory.MandarinOrange}>Mandarin Orange (Dalandan)</SelectItem>
                                                        <SelectItem value={Subcategory.Banana}>Banana (Saging)</SelectItem>
                                                        <SelectItem value={Subcategory.Mango}>Mango (Mangga)</SelectItem>
                                                        <SelectItem value={Subcategory.Avocado}>Avocado</SelectItem>
                                                        <SelectItem value={Subcategory.CottonFruit}>Cotton Fruit (Santol)</SelectItem>
                                                        <SelectItem value={Subcategory.Pineapple}>Pineapple (Pinya)</SelectItem>
                                                        <SelectItem value={Subcategory.Soursop}>Soursop (Guyabano)</SelectItem>
                                                        <SelectItem value={Subcategory.CustardApple}>Custard Apple (Atis)</SelectItem>
                                                        <SelectItem value={Subcategory.Papaya}>Papaya</SelectItem>
                                                        <SelectItem value={Subcategory.Lanzones}>Lanzones</SelectItem>
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
                                                        <SelectItem value={Subcategory.GiantPatani}>Giant Patani</SelectItem>
                                                        <SelectItem value={Subcategory.BlueTarnette}>Blue Tarnette</SelectItem>
                                                        <SelectItem value={Subcategory.AmpalayaSeed}>Ampalaya</SelectItem>
                                                        <SelectItem value={Subcategory.PatolaSeed}>Patola</SelectItem>
                                                        <SelectItem value={Subcategory.OkraSeed}>Okra</SelectItem>
                                                        <SelectItem value={Subcategory.BasilSeed}>Basil</SelectItem>
                                                        <SelectItem value={Subcategory.Talong}>Talong</SelectItem>
                                                        <SelectItem value={Subcategory.Sitaw}>Sitaw</SelectItem>
                                                        <SelectItem value={Subcategory.BaguioBeansSeed}>Baguio Beans</SelectItem>
                                                    </>
                                                )}
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
                        </div>


                        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                            {(chosenCategory === Category.VEGETABLES || chosenCategory === Category.FRESH_FRUIT) && (
                                <FormField
                                    control={form.control}
                                    name="shelfLife"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Shelf Life</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Shelf life..." {...field} disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Value</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0" {...field} disabled={isPending} type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                        </div>

                        <div className='grid grid-cols-1 gap-10'>
                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {chosenCategory === Category.FRESH_FRUIT || chosenCategory === Category.VEGETABLES ? "Kilo/s" :
                                                chosenCategory === Category.EQUIPMENTS || chosenCategory === Category.TOOLS ? "Piece/s" :
                                                    chosenCategory === Category.FERTILIZER || chosenCategory === Category.SEEDS || chosenCategory === Category.SOILS ? "Pack/s" : "Unit"}
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="..." {...field} disabled={isPending} type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem className='col'>
                                        <FormLabel>Weight by (kg)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1 Kg" {...field} disabled={isPending} type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

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
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='text-center space-y-2'>
                            <FormError message={error} />
                            <FormSuccess message={success} />
                            <Button type="submit" disabled={imageIsEmpty || isPending}>Send Offer</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Page