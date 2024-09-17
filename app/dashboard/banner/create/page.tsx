"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronLeft, XIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button as CustomButton } from "@/components/custom/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";

const BannerSchema = z.object({
  banner_name: z.string()
  .min(2, "Banner name must be at least 2 characters")
})

type BannerFormValue = z.infer<typeof BannerSchema>

function CreateBannerPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const router = useRouter();


  const form = useForm<BannerFormValue>({
    resolver: zodResolver(BannerSchema),
    mode: "onChange"
  })
  
  const onSubmit = async (data: BannerFormValue) => {
    setIsLoading(true)
    const formData = {
      ...data,
      banner_image: images[0]
    }
    if(images.length === 0) return toast.error("Banner image is required")
    try{
      const resp = await axios.post("/api/banner", formData)
      if(resp.status === 200){
        form.reset()
        setImages([])
        toast.success("Banner created successfully")
        router.push("/dashboard/banner")
      }else if(resp.status === 400){
        toast.error(resp.data.error)
      }
    }catch(err: any){
      console.log(err)
      toast.error(err.response?.data?.error || "Something went wrong!");
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Button asChild size={"icon"} variant={"outline"}>
          <Link href={"/dashboard/banner"}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Banner</h1>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Banner Details</CardTitle>
          <CardDescription>Create your banner right here</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="banner_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="@Banner Title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3">
                <Label>Banner Image</Label>
                {images.length > 0 ? (
                  <div className="flex gap-5">
                    {images.map((image, index) => (
                      <div key={index} className="relative w-[200px] h-[200px]">
                        <Image
                          width={200}
                          height={200}
                          src={image}
                          alt="Product_image"
                          className="w-[200px] h-[200px] object-cover rounded-lg border"
                        />
                        <button
                          onClick={() =>
                            setImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          type="button"
                          className="absolute -top-3 -right-3 bg-red-500 p-2 rounded-lg text-white"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint="bannerImageRoute"
                    onClientUploadComplete={(res) => {
                      setImages(res.map((r) => r.url));
                      // toast.success("Image uploaded successfully");
                    }}
                    onUploadError={(err) => {
                      toast.error("Image upload failed");
                    }}
                  />
                )}
              </div>
              <CustomButton type="submit" className="mt-4" loading={isLoading}>
                Create Banner
              </CustomButton>
            </form>
          </Form>
          </CardContent>
      </Card>
    </>
  );
}

export default CreateBannerPage;
