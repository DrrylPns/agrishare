"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RegisterSchema, RegisterType } from "@/lib/validations/auth";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import usePasswordToggle from "@/lib/hooks/usePasswordToggle";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios"
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
    },
  } = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: registerUser, isLoading } = useMutation({
    mutationFn: async ({
      email,
      fullname,
      password,
      confirmPassword,
      terms,
    }: RegisterType) => {
      const payload: RegisterType = {
        email,
        fullname,
        password,
        confirmPassword,
        terms,
      };
      const { data } = await axios.post("api/register", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 403) {
            return toast({
              title: "Creating a user failed",
              description: "Cannot create a user, you are already logged in!",
              variant: "destructive",
            });
          }
          if (err.response?.status === 405) {
            return toast({
              title: "Invalid Action",
              description: "Method not allowed",
              variant: "destructive",
            });
          }
          if (err.response?.status === 409) {
            return toast({
              title: "Invalid email",
              description: "Email already exists. Please use a different one.",
              variant: "destructive",
            });
          }
        } else {
          return toast({
            title: "Error!",
            description: "Error: Something went wrong!",
            variant: "destructive",
          });
        }
      }
    },
    onSuccess: () => {
      router.push("/sign-in");
      return toast({
        title: "Success!",
        description: "Account Created Successfully!",
        variant: "default",
      });
    },
  });

  const onSubmit: SubmitHandler<RegisterType> = (data: RegisterType) => {
    const payload: RegisterType = {
      email: data.email,
      fullname: data.fullname,
      password: data.password,
      confirmPassword: data.confirmPassword,
      terms: data.terms,
    };

    registerUser(payload);
  };

  return (
    <div className="bg-[#84D187]">
      <Link className="flex flex-row pt-3" href="/">
        <ChevronLeft />
        Go Back
      </Link>
      <div className='h-screen w-full flex items-center justify-center'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className='w-full p-6'>
            <CardHeader className='flex text-center'>
              <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 w-full p-0">

              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' placeholder='username@example.com' {...register("email")} />
                {errors.email && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.email.message}</span>}
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='fname'>Full Name</Label>
                <Input id='fname' type='text' placeholder='Enter Fullname' {...register("fullname")} />
                {errors.fullname && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.fullname.message}</span>}
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='password'>Password</Label>
                <Input id='password' type={PasswordInputType as string} placeholder='Enter Password'{...register("password")} ToggleIcon={ToggleIcon} />
                {errors.password && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.password.message}</span>}
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='confirm-password'>Confirm Password</Label>
                <Input id='confirm-password' type={PasswordInputType as string} placeholder='Confirm Password' {...register("confirmPassword")} ToggleIcon={ToggleIcon} />
                {errors.confirmPassword && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.confirmPassword.message}</span>}
              </div>
            </CardContent>

            <CardFooter className="w-full">
              <div className='flex flex-col w-full gap-4'>
                <div className='flex space-x-2 mt-5 mb-2'>
                  <input
                    id='terms'
                    type="checkbox"
                    {...register('terms')}
                  />
                  <Label htmlFor='terms' className='text-muted-foreground'>I accept all {" "}
                    <Link href="/tnc" className="underline text-[#1916C1]">terms & conditions</Link>
                  </Label>
                </div>
                {errors.terms && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.terms.message}</span>}

                <Button className='w-full rounded-full' isLoading={isLoading} variant="primary" >Proceed</Button>
                <Link href="/sign-in" className="text-neutral-500 text-[14px]">Already have an account? <span className="font-bold">Login</span></Link>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}

export default page