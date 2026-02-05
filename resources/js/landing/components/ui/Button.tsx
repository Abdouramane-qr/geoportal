import type { ButtonHTMLAttributes, ElementType } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full border border-transparent px-6 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-white text-[#2ECC71] shadow-md shadow-[#2ECC71]/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#27AE60]/40 border-white/60',
      secondary: 'bg-white/40 text-white shadow-sm hover:bg-white/70 border-white/50',
      accent:
        'bg-[#2ECC71] text-white shadow-lg hover:bg-[#27AE60] hover:-translate-y-1 focus-visible:ring-[#2ECC71] border-[#27AE60]',
      outline:
        'border border-[#2ECC71] text-[#2ECC71] bg-transparent hover:bg-[#2ECC71]/10 focus-visible:ring-[#2ECC71]',
      nav:
        'bg-[#2ECC71] text-white shadow-lg hover:bg-[#27AE60] hover:-translate-y-0.5 focus-visible:ring-[#2ECC71] border-[#27AE60] px-5 py-2.5 text-sm',
      },
      size: {
        sm: 'text-xs px-4 py-2',
        md: 'text-sm px-6 py-3',
        lg: 'text-base px-8 py-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    loadingLabel?: string;
    asChild?: boolean;
  };

// Institutional button variants for landing page CTAs.
export function Button({
  asChild,
  className,
  variant,
  size,
  loading,
  loadingLabel = 'Chargement...',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const Component: ElementType = asChild ? Slot : 'button';

  return (
    <Component
      aria-busy={loading}
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? loadingLabel : children}
    </Component>
  );
}

export type { ButtonProps };
