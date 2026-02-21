import GlassLoginForm from "@/components/theme-customizer/AuthPageVariants/glass-theme-auth/LoginForm";
import GlassThemeAuthLayout from "@/components/theme-customizer/AuthPageVariants/glass-theme-auth/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Access your account",
};

export default function Page() {
  return (
    <>
      {/* side image theme content theme */}
      {/* <SideImageLoginForm /> */}

      {/* mordan card content theme */}
      {/* <MordanCardLoginFormPage /> */}

      {/* split content theme */}
      {/* 
        <SplitContentThemeLayout>
          <SplitLogin/>
        </SplitContentThemeLayout> 
      */}

      {/* glass card theme */}
      <GlassThemeAuthLayout>
        <GlassLoginForm />
      </GlassThemeAuthLayout>
    </>
  );
}
