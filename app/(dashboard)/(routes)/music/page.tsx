"use client";

import * as z from "zod";

import axios from "axios";
import { MessageSquare, Music } from "lucide-react";
import { Heading } from "./heading";
import { useForm } from "react-hook-form";
import { formSchema } from "./constansts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionRequestMessage } from "openai";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { usePromodel } from "@/hooks/use-pro-model";
import toast from "react-hot-toast";

const MusicPage = () => {
  const proModal = usePromodel();
  const router = useRouter();
  const [music, setMusic] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isloading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined);

      const response = await axios.post("/api/music", values);

      setMusic(response.data.audio);

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
        title="Music Generation"
        description="Turn your prompt into music"
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
                        placeholder="Piano Solo"
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
          {!music && !isloading && <Empty label="No Music Generated" />}
          {music && (
            <audio controls className="w-full mt-8">
              <source src={music}></source>
            </audio>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
