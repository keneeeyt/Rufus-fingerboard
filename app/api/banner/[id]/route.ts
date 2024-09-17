import { connectDB } from "@/config/mongo-connect";
import Banner from "@/lib/models/Banner";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export const GET = async ({},{ params }: { params: { id: any } }) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectDB();

    const { id } = params;

    if (!id) {
      return new NextResponse("Bad Request: Missing Banner ID", { status: 400 });
    }

    const banner = await Banner.findById(id);

    if (!banner) {
      return NextResponse.json("Banner not found", { status: 404 });
    }

    return NextResponse.json(banner, { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PUT = async(req:NextRequest, {params} : {params:{id: any}}) => {
  try{
    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if(!user || user.email !== process.env.VALID_EMAIL_ADMIN) {
      return NextResponse.redirect("/", 302);
    }

    await connectDB();

    const {id} = params;
    const formData = await req.json();

    const updatedData = {
      banner_name: formData.banner_name,
      banner_image: formData.banner_image
    }

    const updatedBanner = await Banner.findByIdAndUpdate(id, updatedData, {
      new: true
    });

    if(!updatedBanner) {
      return NextResponse.json("Banner not found", {status: 404})
    }

    return NextResponse.json("Banner updated successfully", {status: 200})
  }catch(err){
    console.log(err)
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const DELETE = async ({params}:{params:{id: any}}) => {
  try{
    const {getUser} = getKindeServerSession();
    const user = await getUser();


    if(!user || user.email !== process.env.VALID_EMAIL_ADMIN) {
      return NextResponse.redirect("/")
    }

    await connectDB();

    const {id} = params;

    const banner = await Banner.findByIdAndDelete(id);

    if(!banner) {
      return NextResponse.json("Banner not found", {status: 404})
    }

    return NextResponse.json("Banner deleted successfully", {status: 200})

  }catch(err){
    console.log(err)
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}