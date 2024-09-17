"use client"
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, LoaderIcon, XIcon } from "lucide-react";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button as CustomButton } from "@/components/custom/button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import Image from "next/image";

const ProductSchema = z.object({
  product_name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(55, "Product name must be at most 55 characters"),
  product_description: z
    .string()
    .min(2, "Product description must be at least 2 characters")
    .max(255, "Product description must be at most 255 characters"),
  product_price: z.preprocess(
    (value) => parseFloat(value as string), // Convert string to number
    z.number().min(0.01, "Price must be at least 0.01")
  ),
  isFeatured: z.boolean().optional(),
  product_status: z.string().nonempty({ message: 'product status is required' }),
  product_category: z.string(),
  // product_images: z.array(z.string().min(1, "At least 1 image is required")),
});

type ProductFormValues = z.infer<typeof ProductSchema>;

function EditProductPage({params} : {params: { id: string}}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [InitialLoading, setInitialLoading] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<any>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    mode: "onChange",
  });

  useEffect(()=> {
    const getData = async () => {
      setInitialLoading(true)
      try{
        const categoriesResp = await axios.get('/api/category');
        const resp = await axios.get(`/api/product/${params.id}`)
        
        const data = resp.data;
        const categoriesData = categoriesResp.data;
        setCategories(categoriesData)
        form.reset({
          product_name: data.product_name,
          product_description: data.product_description,
          product_price: data.product_price,
          product_status: data.product_status,
          product_category: data.product_category,
          isFeatured: data.isFeatured,
        });
        setImages(data.product_images)
        setInitialLoading(false)
      }catch(err){
        setInitialLoading(false)
        console.log(err)
      }
    }
    getData();
  },[params, form])



  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    if (images.length === 0) {
      setIsLoading(false);
      return toast.error("Product image cannot be empty");
    }
  
    try {
      const formData = {
        ...data,
        product_images: images,
      }
     const resp = await axios.put(`/api/product/${params.id}`, formData);
  
      if (resp.status === 200) {
        toast.success("Product updated successfully");
      } else if (resp.status === 400) {    
        toast.error(resp.data.error)
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
      <div className="flex items-center gap-4">
        <Button asChild size={"icon"} variant={"outline"}>
          <Link href={"/dashboard/products"}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">Update Product</h1>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            In this form you can update your product
          </CardDescription>
        </CardHeader>
        <CardContent>
          
            {InitialLoading ? (
              <div className="flex items-center justify-center gap-3 mt-32 mb-32">
                <LoaderIcon className="h-5 w-5 animate-spin" /> <span className="text-muted-foreground">Loading data</span>
              </div>
            ) : (
              <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="product_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="@Product Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="product_description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Description{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="@Product Description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="product_price"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Price <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="$55"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="product_category"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length > 0 &&
                            categories.map((category: any) => (
                              <SelectItem
                                key={category.name}
                                value={category.category_name}
                              >
                                {category.category_name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="isFeatured"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel> Featured Product</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="product_status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                       onValueChange={(value) => field.onChange({ target: { value } })}
                        value={field.value }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3">
                <Label>Images</Label>
                {images.length > 0 ? (
                  <div className="flex gap-5">
                    {images.map((image, index) => (
                      <div key={index} className="relative w-[100px] h-[100px]">
                        <Image
                          width={100}
                          height={100}
                          src={image}
                          alt="Product_image"
                          className="w-full h-full object-cover rounded-lg border"
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
                    endpoint="imageUploader"
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
              <CardFooter>
                <CustomButton
                  type="submit"
                  className="mt-4"
                  loading={isLoading}
                >
                  Update Product
                </CustomButton>
              </CardFooter>
            </form>
          </Form>
            )
          }
          
        </CardContent>
      </Card>
    </>
  );
}

export default EditProductPage;
