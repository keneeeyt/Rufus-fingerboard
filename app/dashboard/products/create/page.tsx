"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, XIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  product_status: z.enum(["draft", "published", "archived"]),
  product_category: z.string(),
  // product_images: z.array(z.string().min(1, "At least 1 image is required")),
});

type ProductFormValues = z.infer<typeof ProductSchema>;

function ProductCreatePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<any>([]);

  const router = useRouter();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const resp = await axios.get("/api/category");
        setCategories(resp.data);
      } catch (err) {
        console.log(err);
      }
    };
    getCategories();
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    mode: "onChange",
  });

  const resetForm = () => {
    form.reset({
      product_name: "",
      product_description: "",
      product_price: 0,
      isFeatured: false,
      product_status: "draft",
    });
    setImages([]);
  };
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
      };
      const resp = await axios.post("/api/product", formData);

      if (resp.status === 200) {
        resetForm();
        router.push("/dashboard/products");
        toast.success("Product created successfully");
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
      <div className="flex items-center gap-4">
        <Button asChild size={"icon"} variant={"outline"}>
          <Link href={"/dashboard/products"}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Product</h1>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            In this form you can create your product
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        defaultValue={field.value}
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
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
                    onUploadError={(err) => {
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
                  Create Product
                </CustomButton>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

export default ProductCreatePage;
