import { ReactNode } from "react";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";



const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if(session) redirect("/");
  
  return (


        <main className="auth-container">
          
          {/*Left Side*/}
          <section className="auth-form">

            {/*Box*/}
            <div className="auth-box">

              <div className="flex flex-grow gap-3">
                <Image src="/icons/logo.svg" alt="logo" width={37} height={37}/>
                <h1 className="text-2xl font-semibold text-white">BookWise</h1>
              </div>

              {/*Form*/}
              <div>
                {children}
              </div>
            
            </div>
            
          </section>
          

          {/*Right Side*/}
          <section className="auth-illustration">
            <Image src="/images/auth-illustration.png" alt="auth illustration" height={1000} width={1000} className="size-full object-cover"/>
          </section>

        </main>

  );
};

export default Layout;
