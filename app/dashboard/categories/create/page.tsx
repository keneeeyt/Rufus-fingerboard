"use client";
import { Button } from "@/components/ui/button";
import { Button as CustomButton } from "@/components/custom/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, XIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const CategorySchema = z.object({
  category_name: z
    .string()
    .min(2, "Category name must be at least 2 characters"),
});

type CategoryFormValues = z.infer<typeof CategorySchema>;

function CreateCategoryPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);

  const router = useRouter();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    mode: "onChange",
  });

  const resetForm = () => {
    form.reset({
      category_name: "",
    });
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setIsLoading(true);

      const formData = {
        ...data,
        category_image: images[0],
      };

      if (images.length === 0) return toast.error("Category image is required");

      const resp = await axios.post("/api/category", formData);

      if (resp.status === 200) {
        resetForm();
        router.push("/dashboard/categories");
        toast.success("Category created successfully");
      } else if (resp.status === 400) {
        toast.error(resp.data.error);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Button asChild size={"icon"} variant={"outline"}>
          <Link href={"/dashboard/categories"}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Category</h1>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            In this form you can create your category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="category_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="@Category Title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3">
                <Label>Category Image</Label>
                {images.length > 0 ? (
                  <div className="flex gap-5">
                    {images.map((image, index) => (
                      <div key={index} className="relative w-[200px] h-[200px]">
                        <Image
                          width={200}
                          height={200}
                          src={image}
                          alt="category_image"
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
                    onUploadError={(err: any) => {
                      console.log(err)
                      toast.error("Image upload failed");
                    }}
                  />
                )}
              </div>
              <CustomButton type="submit" className="mt-4" loading={isLoading}>
                Create Category
              </CustomButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

export default CreateCategoryPage;
