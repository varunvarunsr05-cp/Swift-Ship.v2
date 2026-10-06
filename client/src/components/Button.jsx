const variants = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

export default function Button({ children, variant = 'primary', size, className = '', icon: Icon, iconPosition = 'right', ...props }) {
  const sizeClass = size === 'sm' ? 'btn-sm' : '';
  return (
    <button className={`${variants[variant] || variants.primary} ${sizeClass} ${className}`} {...props}>
      {Icon && iconPosition === 'left' && <Icon size={16} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} />}
    </button>
  );
}
