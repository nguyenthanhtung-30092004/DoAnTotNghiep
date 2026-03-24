export function Button({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.97] focus:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

  const variants = {
    default:
      "bg-primary text-primary-foreground hover:bg-secondary shadow-soft hover:shadow-card-hover",

    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",

    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",

    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",

    ghost: "hover:bg-accent hover:text-accent-foreground",

    link: "text-primary underline-offset-4 hover:underline",

    hero: "bg-primary text-primary-foreground hover:bg-secondary shadow-lg hover:shadow-xl text-base",
    "hero-outline":
      "border-2 border-primary text-primary bg-background hover:bg-accent text-base",
  };

  const sizes = {
    default: "h-10 px-5 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-12 px-8 text-base",
    xl: "h-14 px-10 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${base} ${variants[variant] || ""} ${sizes[size] || ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
