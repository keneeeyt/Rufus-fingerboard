import { connectDB } from "@/config/mongo-connect";
import User from "@/lib/models/User";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();

    const user = await getUser();

    if (!user || user === null || !user.id) {
      return new NextResponse("Unathorized", { status: 403 });
    }
   
    await connectDB();

    const isUserExists = await User.findOne({ user_id: user.id });
    
    if (isUserExists) {
      return NextResponse.redirect("http://localhost:3000/");
    }

    const newUser = new User({
      email: user.email ?? "",
      first_name: user.given_name ?? "",
      last_name: user.family_name ?? "",
      user_id: user.id,
      profile_image: user.picture ?? `https://avatar.vercel.sh/rauchg/${user.given_name}`
    });

    await newUser.save();

    return NextResponse.redirect("http://localhost:3000/");
  } catch (err) {
    console.log("Creating user", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
