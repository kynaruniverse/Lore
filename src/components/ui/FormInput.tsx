interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function FormInput({ label, ...props }: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  )
}
