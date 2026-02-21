import { Metadata } from "next";
import SplitContentThemeLayout from "@/components/theme-customizer/AuthPageVariants/split-form-theme/page";
import SplitForgotPassForm from "@/components/theme-customizer/AuthPageVariants/split-form-theme/ForgotPassForm";
import SideImageThemeLayout from "@/components/theme-customizer/AuthPageVariants/login-sideimage/page";
import SideImageLoginForm from "@/components/theme-customizer/AuthPageVariants/login-sideimage/LoginForm";
import SideImageForgotPassForm from "@/components/theme-customizer/AuthPageVariants/login-sideimage/ForgotPassForm";
import MordanCardAuthLayout from "@/components/theme-customizer/AuthPageVariants/mordan-card-layout/pages";
import MordanCardForgotPassPage from "@/components/theme-customizer/AuthPageVariants/mordan-card-layout/ForgotPassForm";
import GlassForgotPassForm from "@/components/theme-customizer/AuthPageVariants/glass-theme-auth/ForgotPassForm";
import GlassThemeAuthLayout from "@/components/theme-customizer/AuthPageVariants/glass-theme-auth/page";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Forgot your password? No worries, just share your registered email to get rest passowrd link",
};

export default function ForgotPasswordPage() {
  return (
    <>
      {/* side image - form content theme */}
       <SideImageForgotPassForm />

      {/* mordan card content theme */}
      {/* <MordanCardForgotPassPage /> */}

      {/* split content theme */}
      
      {/* <SplitContentThemeLayout>
        <SplitForgotPassForm/>
      </SplitContentThemeLayout>  */}
     

    {/* glass card theme */}
      {/* <GlassThemeAuthLayout>
        <GlassForgotPassForm />
      </GlassThemeAuthLayout> */}
    </>);
}
