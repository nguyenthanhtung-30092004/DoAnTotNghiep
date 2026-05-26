export function Button({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

  const variants = {
    default:
      "bg-primary text-primary-foreground hover:bg-secondary shadow-soft hover:shadow-primary-glow",

    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",

    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300",

    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",

    ghost:
      "text-slate-700 hover:bg-slate-100 hover:text-slate-900",

    link:
      "text-primary underline-offset-4 hover:underline",

    dark:
      "bg-slate-900 text-white hover:bg-slate-800 shadow-soft",

    hero:
      "bg-primary text-primary-foreground hover:bg-secondary shadow-lg hover:shadow-primary-glow text-base",

    "hero-outline":
      "border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur text-base",
  };

  const sizes = {
    default: "h-10 px-5 py-2",
    sm:      "h-9 px-4 text-sm rounded-lg",
    lg:      "h-12 px-8 text-base rounded-xl",
    xl:      "h-14 px-10 text-base rounded-2xl",
    icon:    "h-10 w-10",
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? ""} ${sizes[size] ?? ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
