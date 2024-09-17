import { connectDB } from "@/config/mongo-connect";
import Banner from "@/lib/models/Banner";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== process.env.VALID_EMAIL_ADMIN) {
      return NextResponse.redirect("/", 302);
    }

    await connectDB();

    const formData = await req.json();

    const existingBanner = await Banner.findOne({
      banner_name: formData.banner_name,
    });

    if (existingBanner) {
      return new NextResponse(
        JSON.stringify({ error: "Banner already exists" }),
        { status: 400 }
      );
    }

    if (!formData.banner_name || !formData.banner_image) {
      return new NextResponse(
        JSON.stringify({ error: "Banner name and image are required" }),
        { status: 400 }
      );
    }

    const newBanner = new Banner({
      banner_name: formData.banner_name,
      banner_image: formData.banner_image,
    });

    await newBanner.save();

    return new NextResponse(
      JSON.stringify({ message: "Banner created successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async () => {
  try {

    await connectDB();

    const banners = await Banner.find().sort({ createdAt: "desc" });

    return NextResponse.json(banners, { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
