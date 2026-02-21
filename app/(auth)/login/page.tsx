import { Metadata } from "next";
import SplitContentThemeLayout from "@/components/theme-customizer/AuthPageVariants/split-form-theme/page";
import SplitSignUpForm from "@/components/theme-customizer/AuthPageVariants/split-form-theme/SignUpForm";
import SideImageSignUpForm from "@/components/theme-customizer/AuthPageVariants/login-sideimage/SignUpForm";
import SideImageThemeLayout from "@/components/theme-customizer/AuthPageVariants/login-sideimage/page";
import SideImageLoginForm from "@/components/theme-customizer/AuthPageVariants/login-sideimage/LoginForm";
import SplitLogin from "@/components/theme-customizer/AuthPageVariants/split-form-theme/LoginForm";
import MordanCardAuthLayout from "@/components/theme-customizer/AuthPageVariants/mordan-card-layout/pages";
import MordanCardLoginFormPage from "@/components/theme-customizer/AuthPageVariants/mordan-card-layout/LoginForm";
import GlassThemeAuthLayout from "@/components/theme-customizer/AuthPageVariants/glass-theme-auth/page";
import GlassLoginForm from "@/components/theme-customizer/AuthPageVariants/glass-theme-auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Access your account",
};

export default function SignUpPage() {
  return (
    <>
      {/* split content theme */}
      {/* <SplitContentThemeLayout>
        <SplitLogin/>
      </SplitContentThemeLayout> */}

      {/* side image content theme */}
      <SideImageLoginForm />

      {/* mordan card content theme */}
      {/* <MordanCardLoginFormPage /> */}

      {/* glass card theme */}
      {/* <GlassThemeAuthLayout>
        <GlassLoginForm />
      </GlassThemeAuthLayout> */}
    </>
  );
}
