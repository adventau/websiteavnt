// src/app/sign-in/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-avnt-gradient flex items-center justify-center px-4">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-avnt-purple/10 blur-[100px] -translate-y-1/2" />
      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-avnt-purple mx-auto mb-4 flex items-center justify-center">
            <span className="font-display font-bold text-white text-xl">A</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-avnt-text">AVNT Admin</h1>
          <p className="text-avnt-muted text-sm mt-1">Sign in to manage your content</p>
        </div>
        <SignIn
          appearance={{
            variables: {
              colorBackground: "#130D24",
              colorText: "#E5E0F5",
              colorTextSecondary: "#9B88CC",
              colorPrimary: "#7C3AED",
              colorInputBackground: "#0A0514",
              colorInputText: "#E5E0F5",
              borderRadius: "0.75rem",
            },
          }}
          redirectUrl="/admin"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
