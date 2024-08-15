"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Message } from "@/models/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { Familjen_Grotesk } from "next/font/google";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton"

function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();
  const { watch, register, setValue } = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const acceptMessages = watch("acceptMessages");
  const handleDeleteMessage = (messageId: string)=>{
    setMessages(messages.filter((message) => message._id !== messageId))
  }
  const fetchMessage = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      if (response.data.success) {
        setMessages(response.data.messages as Message[]);
        toast({
          title: "Messages Refreshed!",
          description: "Check gossips about you",
        });
      } else {
        toast({
          title: "Error",
          description: "Error fetching messages",
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: axiosError.response?.data.message ==="No Messages for you" ?"No Messages" : "Error",
        description: axiosError.response?.data.message,
        variant: axiosError.response?.data.message ==="No Messages for you" ? "default": "destructive" ,
      });
    } finally{
      setIsLoading(false)
    }
  }, []);

  const fetchAcceptMessageStatus = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      if (response.data.success) {
        setValue("acceptMessages", response.data.isAcceptingMessages);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally{
    setIsSwitchLoading(false)

    }
  }, [setValue]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      toast({
        title: response.data.message,
      });
      setValue("acceptMessages", !acceptMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to switch",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchMessage();
      fetchAcceptMessageStatus();
    }
  }, [status, fetchMessage, fetchAcceptMessageStatus]);

  if (status === "loading") {
    return <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
    <Skeleton className="h-10 mb-4 bg-gray-200" />
    <Skeleton className="h-6 mb-4 bg-gray-200" />
    <Skeleton className="h-8 mb-4 bg-gray-200" />
    <Skeleton className="h-64 bg-gray-200" />
  </div>;
  }

  if (status === "unauthenticated") {
    router.push("/sign-in");
    return null;
  }

  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessage();
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Page;
