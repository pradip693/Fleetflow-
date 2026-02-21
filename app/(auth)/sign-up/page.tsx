import { Metadata } from "next";
import SplitContentThemeLayout from "@/components/theme-customizer/AuthPageVariants/split-form-theme/page";
import SplitSignUpForm from "@/components/theme-customizer/AuthPageVariants/split-form-theme/SignUpForm";
import SideImageSignUpForm from "@/components/theme-customizer/AuthPageVariants/login-sideimage/SignUpForm";
import SideImageThemeLayout from "@/components/theme-customizer/AuthPageVariants/login-sideimage/page";
import MordanCardAuthLayout from "@/components/theme-customizer/AuthPageVariants/mordan-card-layout/pages";
import MordanCardSignUpFormPage from "@/components/theme-customizer/AuthPageVariants/mordan-card-layout/SignUpForm";
import GlassThemeAuthLayout from "@/components/theme-customizer/AuthPageVariants/glass-theme-auth/page"
import GlassSignUpForm from "@/components/theme-customizer/AuthPageVariants/glass-theme-auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your account",
};

export default function SignUpPage() {
  return (
    <>
      {/* split content theme */}
      {/* <SplitContentThemeLayout>
       <SplitSignUpForm />
      </SplitContentThemeLayout> */}

      {/* side image content theme */}
      <SideImageSignUpForm   />

      {/* mordan card content theme */}
      {/* <MordanCardSignUpFormPage /> */}

      {/* glass card theme */}
      {/* <GlassThemeAuthLayout>
        <GlassSignUpForm />
      </GlassThemeAuthLayout> */}
    </>
  );
}
