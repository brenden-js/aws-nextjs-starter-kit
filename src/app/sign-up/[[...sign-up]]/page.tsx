import { SignUp} from "@clerk/nextjs";
import {redirect} from "next/navigation";
import {auth} from "@clerk/nextjs/server";

export default function Page() {
  const user = auth()
  if (user.userId) {
    return redirect('/dashboard')
  }
  return (
    <div className="flex justify-center py-24">
      <SignUp />
    </div>
  );
}
