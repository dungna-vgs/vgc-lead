import { useState, useRef } from 'react';

interface OTPInputProps {
  disabled?: boolean;
  onComplete: (otp: string) => void;
}

export default function OTPInput({
  disabled = false,
  onComplete,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Chỉ cho phép nhập số

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Chuyển sang ô tiếp theo nếu đã nhập
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Gọi onComplete khi đã nhập đủ 6 chữ số
    if (newOtp.every((digit) => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex space-x-2">
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          value={value}
          disabled={disabled}
          maxLength={1}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          className="w-12 h-12 border-2 border-gray-300 rounded text-center text-xl focus:border-primary font-bold text-gray-800 disabled:opacity-20"
        />
      ))}
    </div>
  );
}
