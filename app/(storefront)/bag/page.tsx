import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import BagPageContent from "../_components/bag-page-content";


// This is a server-side component
const BagPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  // Server-side rendering user authentication
  return <BagPageContent />;
};

export default BagPage;
