export const InputForm = ({
  userForm,
  name,
  placeholder,
  label,
  disabled = false,
  required = true,
}: {
  userForm: any;
  name: string;
  placeholder: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-1 w-full mt-4">
      {!!label && (
        <label className="text-secondary text-sm">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <input
        {...userForm.register(name)}
        placeholder={placeholder}
        className="justify-center items-start py-4 pr-16 pl-4 max-w-full leading-5 placeholder:font-normal text-base whitespace-nowrap rounded-2xl bg-zinc-300 bg-opacity-50 placeholder:text-[#868686] text-secondary font-bold w-full disabled:cursor-not-allowed disabled:text-[#868686]"
        disabled={disabled}
      />
      {userForm.formState.errors[name] && (
        <div className="mt-2 text-xs italic text-red-500">
          {userForm.formState.errors[name].message}
        </div>
      )}
    </div>
  );
};
