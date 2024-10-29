import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { Modal } from '@/components/modal/Modal';
import CloseIcon from '@/assets/images/close.svg';
import ArrowDown from '@/assets/images/arrow-down.svg';
import ZaloIcon from '@/assets/images/zalo.svg';
import SMSIcon from '@/assets/images/sms.svg';
import DownloadSection from '../DownloadSection';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CLOUD_URL, BUSINESS_URL, api } from '@/api';
import { InputForm } from '../InputForm';
import CustomButton from '../CustomButton';
import OTPInput from '../OTPInput';
import { LoginProvider } from '@/config';

const VGA_REGEX = /^\d+$/;
const PHONE_REGEX = /^((\+84)|0)\d{9,11}$/;

const formatPhoneNumber = (phone: string) => {
  if (phone?.startsWith('+840')) {
    phone = `+84${phone.slice(4)}`;
  } else if (phone?.startsWith('0')) {
    phone = `+84${phone.slice(1)}`;
  }
  return phone;
};

const schema = yup.object().shape({
  user_id: yup.string().matches(VGA_REGEX, 'Mã VGA không hợp lệ'),
  phone: yup.string().matches(PHONE_REGEX, 'Số điện thoại không hợp lệ'),
});

export default function OTPModal({
  open,
  setOpen,
  onSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: (data: any) => void;
}) {
  const [hasVGA, setHasVGA] = useState(true);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const otpForm = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      user_id: '',
      phone: '',
    },
    mode: 'onChange',
  });

  const onChangeHasVGA = (v: ChangeEvent<HTMLSelectElement>) => {
    setHasVGA(!!Number(v.target.value));
  };

  // Gửi OTP qua App nếu có mã VGA
  const onSendOTPToApp = useCallback(() => {
    setShowOTPInput(false);

    const userId = otpForm.getValues('user_id');

    if (hasVGA && /^\d+$/.test(userId)) {
      setIsSendingOtp(true);

      const url = `${BUSINESS_URL}/api/v1/otp/send`;

      const body = { user_id: userId };

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          }
          throw new Error('Lỗi khi gửi OTP');
        })
        .then((res) => {
          if (res.error_code === 200) {
            setShowOTPInput(true);
          } else {
            setErrorMessage(res.message);
          }
        })
        .catch(() => {
          setErrorMessage('Đã xảy ra lỗi trong quá trình gửi OTP');
        })
        .finally(() => {
          setIsSendingOtp(false);
        });
    } else {
      setErrorMessage('Mã VGA không hợp lệ');
    }
  }, [hasVGA, otpForm]);

  // Gửi OTP qua provider
  const onSendOTPToPhone = useCallback(
    (provider: LoginProvider) => {
      setShowOTPInput(false);

      let phone = otpForm.getValues('phone');

      if (!hasVGA && /^\d+$/.test(phone)) {
        setIsSendingOtp(true);

        phone = formatPhoneNumber(phone);

        const url = `${CLOUD_URL}/api/internal/create_internal_otp`;

        const body = { phone, provider };

        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
          .then((res) => {
            if (res.status === 200) {
              return res.json();
            }
            if (res.status === -118) {
              return onSendOTPToPhone(LoginProvider.SMS);
            }
            throw new Error('Lỗi khi gửi OTP');
          })
          .then((res) => {
            setShowOTPInput(true);
          })
          .catch(() => {
            setErrorMessage('Đã xảy ra lỗi trong quá trình gửi OTP');
          })
          .finally(() => {
            setIsSendingOtp(false);
          });
      } else {
        setErrorMessage('Số điện thoại không hợp lệ');
      }
    },
    [hasVGA, otpForm]
  );

  // Xác thực OTP qua SĐT
  const verifyPhoneOTP = useCallback(
    async (phone: string, otp: string) => {
      if (PHONE_REGEX.test(phone)) {
        setIsSubmitting(true);

        phone = formatPhoneNumber(phone);

        const url = `${CLOUD_URL}/api/internal/verify_internal_otp`;

        const body = { phone, OTP: otp };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          onSuccess({ phone });
        } else {
          setErrorMessage('Mã OTP không hợp lệ');
        }
        setIsSubmitting(false);
      } else {
        setErrorMessage('Số điện thoại không hợp lệ');
      }
    },
    [PHONE_REGEX]
  );

  // Lấy thông tin theo VGA
  const getUserInfo = useCallback(async (uid: string, otp: string) => {
    await api
      .get('/lead_form/autofill', { uid, otp })
      .then((res: any) => {
        if (res.error_code === 0) {
          onSuccess(res.data);
        } else {
          setErrorMessage(res.message);
        }
      })
      .catch(() => {
        setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại.');
      });
  }, []);

  // Xác thực OTP qua App để lấy thông tin theo VGA
  const verifyAppOTP = useCallback(async (userId: string, otp: string) => {
    if (VGA_REGEX.test(userId)) {
      setIsSubmitting(true);

      const url = `${BUSINESS_URL}/api/v1/otp/verify`;

      const body = { user_id: userId, otp };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.error_code === 200) {
          await getUserInfo(userId, otp);
        } else {
          setErrorMessage(data.message);
        }
      } else {
        setErrorMessage('Lỗi khi xác minh OTP');
      }
      setIsSubmitting(false);
    } else {
      setErrorMessage('Mã VGA không hợp lệ');
    }
  }, []);

  // Tự động xử lý khi điền đủ OTP
  const handleOTPComplete = useCallback(
    (otpValue: string) => {
      const [userId, phone] = otpForm.getValues(['user_id', 'phone']);

      if (hasVGA) {
        verifyAppOTP(userId, otpValue);
      } else {
        verifyPhoneOTP(phone, otpValue);
      }
    },
    [hasVGA, otpForm]
  );

  useEffect(() => {
    if (open) {
      otpForm.reset();
      setHasVGA(true);
      setIsSendingOtp(false);
      setShowOTPInput(false);
      setIsSubmitting(false);
      setErrorMessage(null);
    }
  }, [open]);

  useEffect(() => {
    setErrorMessage(null);
  }, [hasVGA, showOTPInput]);

  useEffect(() => {
    if (isSendingOtp) {
      setErrorMessage(null);
    }
  }, [isSendingOtp]);

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="flex flex-col items-center mx-auto p-4 bg-white rounded-3xl relative">
        <div
          onClick={() => setOpen(false)}
          className="cursor-pointer self-end text-2xl tracking-tight leading-5 uppercase text-ellipsis text-stone-950 absolute top-3 right-3"
        >
          <img src={CloseIcon.src} alt={'close'} />
        </div>
        <div className="mt-4 text-2xl font-bold leading-7 text-center uppercase whitespace-nowrap text-stone-950">
          Đăng ký mở thẻ
        </div>

        <div className="relative flex appearance-none justify-between mt-4 w-full rounded-2xl bg-zinc-300 bg-opacity-50">
          <select
            onChange={onChangeHasVGA}
            className={`flex-auto appearance-none text-base p-4 w-full bg-transparent text-secondary font-bold outline-none`}
          >
            <option value={1}>Có mã VGA</option>
            <option value={0}>Không có mã VGA</option>
          </select>
          <img
            className="absolute right-4 top-4"
            src={ArrowDown.src}
            alt={'icon'}
          />
        </div>

        <form className="flex flex-col items-center w-full gap-4">
          {hasVGA ? (
            <>
              <InputForm
                userForm={otpForm}
                name="user_id"
                placeholder="Nhập mã VGA"
              />
              <CustomButton disabled={isSendingOtp} onClick={onSendOTPToApp}>
                Nhận OTP qua App vHandicap
              </CustomButton>
            </>
          ) : (
            <>
              <InputForm
                userForm={otpForm}
                name="phone"
                placeholder="Nhập số điện thoại"
              />

              <CustomButton
                disabled={isSendingOtp}
                onClick={() => onSendOTPToPhone(LoginProvider.ZALO)}
              >
                <div className="flex items-center justify-center gap-2">
                  <img className="w-7 h-7" src={ZaloIcon.src} alt={'icon'} />
                  <span>Gửi OTP qua Zalo</span>
                </div>
              </CustomButton>

              <CustomButton
                disabled={isSendingOtp}
                onClick={() => onSendOTPToPhone(LoginProvider.SMS)}
              >
                <div className="flex items-center justify-center gap-2">
                  <img className="w-7 h-7" src={SMSIcon.src} alt={'icon'} />
                  <span>Gửi OTP qua SMS</span>
                </div>
              </CustomButton>
            </>
          )}

          {showOTPInput && (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-center text-gray-800">
                Nhập mã xác thực vào bên dưới
              </div>
              <OTPInput
                disabled={isSubmitting}
                onComplete={handleOTPComplete}
              />
            </div>
          )}

          {errorMessage && (
            <div className="w-full mt-1 flex text-xs italic text-red-500">
              {errorMessage}
            </div>
          )}
        </form>

        <DownloadSection />
      </div>
    </Modal>
  );
}
