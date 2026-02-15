import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center p-8">
      <SignIn
        forceRedirectUrl="/admin"
        withSignUp={false}
        transferable={false}
        appearance={{
          variables: {
            colorBackground: "#1f2028",
            colorInputBackground: "#23242e",
            colorInputText: "#f2f0ff",
            colorText: "#f2f0ff",
            colorTextSecondary: "#a9a4bd",
            colorPrimary: "#6e47ff",
            colorDanger: "#ef4444",
            borderRadius: "12px"
          },
          elements: {
            card: "border border-white/10 bg-[#1f2028]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
            headerTitle: "text-white",
            headerSubtitle: "text-[#a9a4bd]",
            formFieldLabel: "text-[#f2f0ff]",
            formFieldInput:
              "border border-white/20 bg-[#23242e] text-white placeholder:text-[#a9a4bd] focus:border-[#6e47ff]",
            footerAction: "hidden",
            footerActionText: "text-[#a9a4bd]",
            footerActionLink: "text-[#6e47ff] hover:text-[#8a6dff]",
            socialButtonsBlockButton: "border border-white/15 bg-[#23242e] text-white",
            identityPreviewText: "text-white",
            formButtonPrimary:
              "bg-gradient-to-r from-[#6e47ff] to-[#7a5dff] text-white hover:brightness-110 shadow-none"
          }
        }}
      />
    </main>
  );
}
