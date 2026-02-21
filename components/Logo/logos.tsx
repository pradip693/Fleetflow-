import IconLogo from "@public/logo/logo-mini.png";
import HorizontalLogo from "@public/logo/logo-with-side-text.jpeg";
import FullLogo from "@public/logo/logo-with-text.png";
import Image from "next/image";
import Link from "next/link";

type LogoVariant = "icon" | "full" | "horizontal";

interface LogoProps {
  variant?: LogoVariant;
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

const logoConfig = {
  icon: {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    src: IconLogo,
  },
  full: {
    sm: { width: 100, height: 40 },
    md: { width: 140, height: 56 },
    lg: { width: 180, height: 72 },
    src: FullLogo,
  },
  horizontal: {
    sm: { width: 120, height: 40 },
    md: { width: 160, height: 54 },
    lg: { width: 200, height: 68 },
    src: HorizontalLogo,
  },
};

export function Logo({
  variant = "full",
  size = "md",
  href = "/",
  className = "",
}: LogoProps) {
  const config = logoConfig[variant];
  const dimensions = config[size];

  const logoImage = (
    <Image
      src={config.src}
      alt="Admin UI Logo"
      width={dimensions.width}
      height={dimensions.height}
      priority
      className={`object-contain ${className}`}
    />
  );

  if (href) {
    return <Link href={href} className="w-fit">{logoImage}</Link>;
  }

  return logoImage;
}

// Variants for different use cases
export function LogoIcon({
  size = "md",
  href = "/",
  className = "",
}: Omit<LogoProps, "variant">) {
  return <Logo variant="icon" size={size} href={href} className={className} />;
}

export function LogoFull({
  size = "md",
  href = "/",
  className = "",
}: Omit<LogoProps, "variant">) {
  return <Logo variant="full" size={size} href={href} className={className} />;
}

export function LogoHorizontal({
  size = "md",
  href = "/",
  className = "",
}: Omit<LogoProps, "variant">) {
  return (
    <Logo variant="horizontal" size={size} href={href} className={className} />
  );
}
