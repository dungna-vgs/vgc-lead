import CloseIcon from '@/assets/images/close.svg';
import { Modal } from '@/components/modal/Modal';
import { InputForm } from '@/components/InputForm';
import DownloadSection from '../DownloadSection';
import { useEffect, useState } from 'react';
import CustomButton from '../CustomButton';

export default function InputModal({
  open,
  setOpen,
  onSubmit,
  isSubmitting,
  userForm,
  errorMessage,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (formValue: any) => void;
  isSubmitting: boolean;
  userForm: any;
  errorMessage: null | string;
}) {
  const [initialForm, setInitialForm] = useState<any>(null);
  const tern = userForm.watch('tern');

  const onCheckTern = () => {
    userForm.setValue('tern', !tern);
  };

  useEffect(() => {
    if (open) {
      setInitialForm(userForm.getValues());
    } else {
      userForm.reset();
      setInitialForm(null);
    }
  }, [open]);

  return (
    <Modal open={open} setOpen={setOpen}>
      <form
        onSubmit={userForm.handleSubmit(onSubmit)}
        className="flex flex-col items-center mx-auto p-4 bg-white rounded-3xl relative"
      >
        <div
          onClick={() => setOpen(false)}
          className="cursor-pointer self-end text-2xl tracking-tight leading-5 uppercase text-ellipsis text-stone-950 absolute top-3 right-3"
        >
          <img src={CloseIcon.src} alt={'close'} />
        </div>
        <div className="mt-4 text-2xl font-bold leading-7 text-center uppercase whitespace-nowrap text-stone-950">
          Đăng ký mở thẻ
        </div>
        <div className="self-stretch mt-3 text-sm font-medium leading-5 text-center text-gray-800 whitespace-nowrap">
          Vui lòng điền đầy đủ thông tin
        </div>

        {!!initialForm?.vgaId && (
          <InputForm
            userForm={userForm}
            name="vgaId"
            placeholder="Nhập mã VGA"
            label="Mã VGA"
            disabled
          />
        )}

        <InputForm
          userForm={userForm}
          name="name"
          placeholder="Nhập họ và tên"
          label="Họ và tên"
          disabled={!!initialForm?.name}
        />

        <InputForm
          userForm={userForm}
          name="phone"
          placeholder="Nhập số điện thoại"
          label="Số điện thoại"
          disabled={!!initialForm?.phone}
        />

        <InputForm
          userForm={userForm}
          name="identifyNumber"
          placeholder="Nhập số CCCD"
          label="Số CCCD"
          disabled={!!initialForm?.identifyNumber}
        />

        <InputForm userForm={userForm} name="email" placeholder="Nhập email" label="Email" required={false} />

        <InputForm
          userForm={userForm}
          name="address"
          placeholder="Nhập địa chỉ"
          label="Địa chỉ"
          required={false}
        />

        {userForm.formState.errors['data_source'] && (
          <div className="w-full mt-2 flex text-xs italic text-red-500">
            {userForm.formState.errors['data_source'].message}
          </div>
        )}

        <div
          onClick={onCheckTern}
          className="flex items-start w-full mt-4 gap-2"
        >
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <div>
              {tern ? (
                <div className="border border-blue-600 rounded-full">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="8.70068" cy="8.76172" r="7.5" stroke="black" />
                </svg>
              )}
            </div>
            <span className=" text-xs font-medium text-stone-950">
              Tôi đã đọc và đồng ý chia sẻ không giới hạn thông tin của tôi tại
              vHandicap cho Nam A Bank, nhằm phục vụ quá trình mở thẻ tín dụng
              của tôi tại Nam A Bank
            </span>
          </label>
        </div>

        {errorMessage && (
          <div className="w-full mt-2 flex text-xs italic text-red-500">
            {errorMessage}
          </div>
        )}

        <CustomButton
          type="submit"
          disabled={!tern || isSubmitting}
          className="mt-4"
        >
          Đăng ký
        </CustomButton>

        <DownloadSection />
      </form>
    </Modal>
  );
}
