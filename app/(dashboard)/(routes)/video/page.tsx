"use client";

import * as z from "zod";

import axios from "axios";
import { VideoIcon } from "lucide-react";
import { Heading } from "./heading";
import { useForm } from "react-hook-form";
import { formSchema } from "./constansts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { usePromodel } from "@/hooks/use-pro-model";
import toast from "react-hot-toast";

const VideoPage = () => {
  const proModal = usePromodel();
  const router = useRouter();
  const [video, setVideo] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isloading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);

      const response = await axios.post("/api/video", values);

      setVideo(response.data[0]);

      form.reset();
    } catch (error: any) {
      // open pro model
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong");
      }
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Video Generation"
        description="Turn your prompt into Video"
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
      ></Heading>
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              action=""
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isloading}
                        placeholder="Clown fish swimming around an small Island"
                        {...field}
                      ></Input>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <Button
                className="col-span-12 lg:col-span-2 w-full "
                disabled={isloading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-0">
          {isloading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center items-center bg-muted">
              <Loader></Loader>
            </div>
          )}
          {!video && !isloading && <Empty label="No video Generated" />}
          {video && (
            <video
              controls
              className="w-full aspect-video mt-8 rounded-lg border bg-black"
            >
              <source src={video}></source>
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
