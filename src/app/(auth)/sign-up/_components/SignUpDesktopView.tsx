"use client"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Logo } from "@/components/logo";
import { Tagline } from "@/components/tagline";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import usePasswordToggle from "@/lib/hooks/usePasswordToggle";
import { SubmitHandler, useForm } from "react-hook-form";
import { RegisterSchema, RegisterType } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";


export const SignUpDesktopView = () => {
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
    onError: (err: unknown) => {
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
    <div className="md:block hidden">
      <div className="absolute top-3">
        <Link className="flex flex-row w-fit h-fit" href="/">
          <ChevronLeft />
          Go Back
        </Link>
      </div>

      <div className="flex justify-between flex-row w-full">
        <div className="bg-[#F7FFF6] w-[50%] flex items-center justify-center flex-col">
          <Logo isAuth />
        </div>

        <div className="bg-[#84D187] w-[50%]">
          <div className='h-screen w-full flex items-center justify-center'>
            <form onSubmit={handleSubmit(onSubmit)} className="lg:w-[400px] xl:w-[500px]">
              <Card className='w-full p-6'>
                <CardHeader className='flex text-center'>
                  <CardTitle>Sign Up</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 w-full p-0">

                  <div className='grid gap-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input className="lg:w-[350px] xl:w-[450px]" id='email' type='email' placeholder='username@example.com' {...register("email")} />
                    {errors.email && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.email.message}</span>}
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='fname'>Full Name</Label>
                    <Input className="lg:w-[350px] xl:w-[450px]" id='fname' type='text' placeholder='Enter Fullname' {...register("fullname")} />
                    {errors.fullname && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.fullname.message}</span>}
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='password'>Password</Label>
                    <Input className="lg:w-[350px] xl:w-[450px]" id='password' type={PasswordInputType as string} placeholder='Enter Password'{...register("password")} ToggleIcon={ToggleIcon} />
                    {errors.password && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.password.message}</span>}
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='confirm-password'>Confirm Password</Label>
                    <Input className="lg:w-[350px] xl:w-[450px]" id='confirm-password' type={PasswordInputType as string} placeholder='Confirm Password' {...register("confirmPassword")} ToggleIcon={ToggleIcon} />
                    {errors.confirmPassword && <span className='text-rose-500 text-[13px] md:text-[16px]'>{errors.confirmPassword.message}</span>}
                  </div>
                </CardContent>

                <CardFooter className="w-full flex justify-center items-center p-0">
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

                    <div className="flex justify-center items-center">
                      <Link href="/sign-in" className="text-neutral-500 text-[14px]">Already have an account? <span className="font-bold">Login</span></Link>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
