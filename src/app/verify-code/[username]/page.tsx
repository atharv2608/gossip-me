'use client'
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast, useToast } from '@/components/ui/use-toast';
import { verifyCodeSchema } from '@/schemas/verifyCodeSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, Router } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
function Page() {
    const [isVerifying, setIsVerifying] = useState(false) 
    const router = useRouter()
    const codeSchema = z.object({
        code: verifyCodeSchema
    })
    const form = useForm<z.infer<typeof codeSchema>>({
        resolver: zodResolver(codeSchema),
        defaultValues:{
            code: ""
        }
    })
    
    const searchParams = useSearchParams();
    const params = useParams<{username: string}>()
    const decodedEmail = searchParams.get("email") as string
    const email = decodeURIComponent(decodedEmail)
    console.log("Decoded email: ", email);
    const username = params.username;
    if(!email || !username){
        router.push("/not-found")
        return 
    }
    const onSubmit = async(data: z.infer<typeof codeSchema>)=>{
      setIsVerifying(true)
        try {
          const response = await axios.post<ApiResponse>("/api/verify-code", {
            username: username,
            email: email,
            code: data.code
          })

          if(response.data.success){
            toast({
              title: "Success",
              description:  response.data.message,
            })

            router.replace("/sign-in")
          }
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: 'Verification Failed',
            description:
              axiosError.response?.data.message ??
              'An error occurred. Please try again.',
            variant: 'destructive',
          });
        } finally{
          setIsVerifying(false)
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Verify Your Account
        </h1>
        <p className="mb-4">Enter the verification code sent to your email</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isVerifying}>{
            isVerifying? <>
            <Loader2 className='animate-spin'></Loader2>  
            </> : "Verify" 
          }
            </Button>
        </form>
      </Form>
    </div>
  </div>
  )
}

export default Page