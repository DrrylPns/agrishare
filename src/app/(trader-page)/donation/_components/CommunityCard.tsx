import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Community } from "../_types"
import Image from "next/image"
import Link from "next/link"

function CommunityCard({
    community
}:{
    community: Community
}) {

    const ConvertIntohundreds = ()=>{
        const targetDonation = community.neededDonation
        const currentDonation = community.currentDonated

        const factor = targetDonation / 100
        const equivalent = currentDonation / factor

        return equivalent
    }
  return (
    <Card className="drop-shadow-lg shadow-lg hover:shadow-gree">
        <Link href={`/donation/${community.id}`}>
         <Image 
                src={community.thumbnail} 
                alt="Community thumbnail"
                height={100}
                width={100}
                className="object-contain w-full"
            />
        <CardHeader>
           
            <CardTitle className="">{community.name}</CardTitle>
            <CardDescription className="line-clamp-6">{community.story}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col">
            <div className="flex text-[0.7rem]">
                <h1>{community.currentDonated} raised of  <span>{community.neededDonation} </span></h1>
            </div>
            
            <Progress value={ConvertIntohundreds()} className="w-full shadow-md drop-shadow-md" />
        </CardFooter>
        </Link>
    </Card>
  )
}

export default CommunityCard