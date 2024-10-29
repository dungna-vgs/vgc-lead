import { Montserrat } from "next/font/google";
import * as React from "react";
import Image1 from "@/assets/images/image-1.png";
import Image2 from "@/assets/images/image-2.png";
import Image3 from "@/assets/images/image-3.png";
import Image4 from "@/assets/images/image-4.png";
import Box1 from "@/assets/images/box-1.svg";
import Box2 from "@/assets/images/box-2.svg";
import Box3 from "@/assets/images/box-3.svg";
import Box4 from "@/assets/images/box-4.svg";
import Box5 from "@/assets/images/box-5.svg";
import ImageItem1 from "@/assets/images/item-1.png";
import ImageItem2 from "@/assets/images/item-2.png";
import ImageItem3 from "@/assets/images/item-3.png";
import ImageItem4 from "@/assets/images/item-4.png";
import ImageLogo1 from "@/assets/images/logo-1.svg";
import ImageLogo2 from "@/assets/images/logo-2.svg";
import FlagIcon from "@/assets/images/flag.svg";
import HandIcon from "@/assets/images/hand.svg";
import SayNo from "@/assets/images/say-no.png";
import SayYes from "@/assets/images/say-yes.png";
import DacQuyen from "@/assets/images/dac-quyen.png";
import NextArrow from "@/assets/images/next-arrow.svg";
import BackArrow from "@/assets/images/back-arrow.svg";
import NamABank from "@/assets/images/nam-a-bank.png";
import HappyGolf from "@/assets/images/happy-golf.png";
import InputModal from "@/components/modal/InputModal";
import SuccessModal from "@/components/modal/SuccessModal";
import { api } from "@/api";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import OTPModal from "@/components/modal/OTPModal";

const inter = Montserrat({ subsets: ["vietnamese"], weight: ["400", "700"] });

const schema = yup.object().shape({
  vgaId: yup.string(),
  email: yup
    .string()
    .email('Định dạng email không hợp lệ'),
  name: yup.string().required("Vui lòng nhập họ và tên"),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(
      /^((\+84)|0)\d{9,11}$/, // Regex pattern for Vietnamese phone numbers
      "Số điện thoại không hợp lệ", // Message if the regex pattern does not match
    ),
  identifyNumber: yup.string().required("Vui lòng nhập số CCCD"),
  address: yup.string(),
  tern: yup.boolean().required(),
});

// type FormType = {
//   vgaId: string;
//   email: string;
//   name: string;
//   phone: string;
//   province: string;
//   tern: boolean;
//   refPhone?: string;
//   match_count?: string;
// };

export default function Home() {
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [openInputModal, setOpenInputModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const userForm = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      vgaId: "",
      name: "",
      phone: "",
      identifyNumber: "",
      email: "",
      address: "",
      tern: false,
    },
    mode: "onChange",
  });

  const onOpenOtpModal = () => {
    setOpenOtpModal(true);
  };

  const handleVerifyOtpSuccess = (data: any) => {
    userForm.setValue('phone', data.phone);
    if (data.user_id) {
      userForm.setValue('vgaId', data.id_display);
      userForm.setValue('name', data.fullname);
      userForm.setValue('identifyNumber', data.number_passport);
      userForm.setValue('email', data.email);
      userForm.setValue('address', data.address);
    }
    setOpenOtpModal(false);
    setOpenInputModal(true);
  };

  const onSubmit = (formValue: any) => {
    setIsSubmitting(true);
    api
      .post("/lead_form/lead", {
        vga_code: formValue.vgaId,
        name: formValue.name,
        phone: formValue.phone,
        identify_number: formValue.identifyNumber,
        email: formValue.email,
        address: formValue.address,
        consent: formValue.tern,
      })
      .then((res: any) => {
        setOpenInputModal(false);
        setOpenSuccessModal(true);
      })
      .catch((e) => {
        console.log(e);
        if (e.status == 404) {
          setErrorMessage("Mã VGA không tồn tại trên hệ thống.");
        } else {
          setErrorMessage("Đã có lỗi xảy ra, vui lòng thử lại.");
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (!openInputModal) {
      setErrorMessage(null);
    }
  }, [openInputModal]);

  return (
    <>
      <main className={`flex ${inter.className}`}>
        <div className="flex flex-col items-center pb-7 mx-auto bg-white w-[480px] sm:w-full max-w-[480px]">
          <div className="fixed bg-white top-0 left-1/2 transform -translate-x-1/2 z-10 h-[55px] w-full max-w-[480px]">
            <header className="flex flex-row items-center justify-between px-4 py-2">
              <div className="flex flex-row gap-4 justify-center items-center">
                <img src={BackArrow.src} />
                <div className="text-primary leading-6 text-base font-semibold">
                  NAM A BANK
                </div>
              </div>

              <div
                onClick={onOpenOtpModal}
                className="cursor-pointer justify-center px-3.5 py-1.5 items-center font-bold text-sm whitespace-nowrap rounded-xl bg-primary text-white"
              >
                ĐĂNG KÝ
              </div>
            </header>
          </div>

          <div className="pt-[50px] max-w-[480px] w-full">
            <div className="w-full">
              <div className="flex bg-image z-10 flex-col justify-center  self-stretch px-6 py-4 w-full font-bold text-[#F9EBAB] bg-[#BA8A3D]">
                <div className="flex gap-8 justify-between self-center px-0.5 text-xs text-center text-white whitespace-nowrap">
                  <img loading="lazy" src={ImageLogo1.src} />
                  <img loading="lazy" src={ImageLogo2.src} />
                </div>
                <div className="flex justify-between self-center px-0.5 max-w-full mt-4">
                  <img loading="lazy" src={NamABank.src} />
                </div>
                <div className="flex justify-between self-center px-0.5 max-w-full mt-4">
                  <img loading="lazy" src={HappyGolf.src} />
                </div>
                <div className="mt-6 text-2xl leading-7 text-primary text-center ">
                  ĐẶC QUYỀN VƯỢT TRỘI
                  <br />
                  TẬN HƯỞNG ĐAM MÊ
                </div>
                {/*<div className="mt-4 text-base leading-6 text-center whitespace-nowrap">*/}
                {/*  THẺ TÍN DỤNG NAM A BANK HAPPY GOLF*/}
                {/*</div>*/}
                <div className="flex gap-2 text-secondary justify-between mt-4 rounded-md">
                  <img loading="lazy" src={FlagIcon.src} />
                  <div className="flex-auto text-base leading-6">
                    <span className="font-bold">
                      Tận hưởng đặc quyền chơi Golf
                    </span>{" "}
                    <span className="font-normal">miễn phí không giới hạn</span>
                  </div>
                </div>
                <div className="flex gap-2 justify-between text-secondary mt-4 rounded-md">
                  <img loading="lazy" src={HandIcon.src} />
                  <div className="flex-auto text-base leading-7">
                    <span className="font-bold">
                      Miễn phí thường niên trọn đời
                    </span>{" "}
                    <span className="font-normal">
                      khi chi tiêu thoả điều kiện (*)
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-secondary pl-[38px] text-sm italic leading-6 font-normal whitespace-nowrap">
                  (*) Điều kiện & Điều khoản áp dụng cho sản phẩm
                </div>
              </div>
              <div className="flex overflow-hidden relative flex-col justify-between items-start self-stretch px-14 pt-2 pb-12 -mt-1 w-full aspect-[1]">
                <img
                  loading="lazy"
                  src={Image1.src}
                  className="object-cover absolute inset-0 size-full"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center self-stretch px-4 w-full">
              <div className="mt-10 text-xl font-bold leading-8 text-center text-secondary max-w-[393px]">
                <span className="">
                  Nam A Bank hân hạnh mang đến quý khách những
                </span>{" "}
                ưu đãi vượt trội <span className="">khi</span>{" "}
                <span className="">chơi Golf tại hơn</span>{" "}
                <a
                  href="https://www.namabank.com.vn/Data/Sites/1/media/the/2024/Happy%20golf/DANH%20S%C3%81CH%20S%C3%82N%20GOLF.pdf"
                  className="text-primary underline"
                  target="_blank"
                >
                  50 sân Golf{" "}
                </a>
                <br />
                <span className="">đẹp nhất Việt Nam.</span>
              </div>
              <div
                onClick={onOpenOtpModal}
                className="justify-center cursor-pointer px-9 py-5 mt-10 text-sm font-bold leading-4 text-white uppercase whitespace-nowrap bg-primary rounded-2xl"
              >
                mở thẻ ngay
              </div>
              <div className="mt-10 px-2 text-2xl font-bold leading-9 text-center uppercase text-secondary">
                TẬN HƯỞNG ĐẶC QUYỀN HAPPY GOLF, NÂNG TẦM ĐẲNG CẤP GOLFER
              </div>
              <img loading="lazy" src={Image2.src} className="mt-7 w-full" />
              <div className="w-full">
                <div className="flex items-center gap-3 p-8 mt-4 w-full bg-white border border-solid border-[color:var(--Grey-Scale-Black-10,rgba(25,24,37,0.10))] rounded-[32px]">
                  <img
                    loading="lazy"
                    src={SayNo.src}
                    className="w-[75px] h-[75px]"
                  />
                  <div className="text-lg font-bold leading-7 text-secondary">
                    Say NO với thủ tục đăng ký lịch chơi phức tạp và chi phí đắt
                    đỏ
                  </div>
                </div>
                <div className="flex gap-3 p-8 mt-4 w-full bg-white items-center border border-solid  rounded-[32px]">
                  <img
                    loading="lazy"
                    src={SayYes.src}
                    className="w-[75px] h-[75px]"
                  />
                  <div className="text-lg font-bold leading-7 text-secondary">
                    Say YES cùng thẻ Happy Golf siêu tiện ích và hàng loạt ưu
                    đãi đặc biệt
                  </div>
                </div>
              </div>
              <div className="mt-4 text-lg leading-7 text-center text-secondary">
                Đã là một Golfer sành điệu, chần chờ gì mà không tận dụng những
                đặc quyền đẳng cấp chỉ dành riêng cho bạn.
              </div>
              <div className="mt-10 text-2xl font-bold leading-9 text-center uppercase whitespace-nowrap text-secondary">
                Đặc quyền riêng biệt
              </div>

              <div className="flex flex-col justify-center mt-4 w-full">
                <img loading="lazy" src={DacQuyen.src} />
              </div>

              <div className="flex flex-col justify-center p-8 mt-4 w-full bg-white border border-solid border-[color:var(--Grey-Scale-Black-10,rgba(25,24,37,0.10))] rounded-[32px] text-[#0F0F0F]">
                <img
                  loading="lazy"
                  src={ImageItem1.src}
                  className="aspect-square w-[75px]"
                />
                <div className="mt-3 text-2xl font-bold leading-9">
                  Miễn phí thường niên năm đầu
                </div>
                <div className="mt-3 text-lg leading-7">
                  Khi chi tiêu từ 10 triệu đồng trong vòng 45 ngày kể từ ngày
                  kích hoạt thẻ.
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 mt-4 w-full bg-white border border-solid border-[color:var(--Grey-Scale-Black-10,rgba(25,24,37,0.10))]   rounded-[32px] text-[#0F0F0F]">
                <img
                  loading="lazy"
                  src={ImageItem2.src}
                  className="aspect-square w-[75px]"
                />
                <div className="mt-3 text-2xl font-bold leading-9">
                  Chi tiêu trước - trả tiền sau
                </div>
                <div className="mt-2 text-lg leading-7 whitespace-nowrap">
                  Miễn lãi lên đến 55 ngày
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 mt-4 w-full bg-white border border-solid border-[color:var(--Grey-Scale-Black-10,rgba(25,24,37,0.10))]   rounded-[32px] text-[#0F0F0F]">
                <img
                  loading="lazy"
                  src={ImageItem3.src}
                  className="aspect-square w-[75px]"
                />
                <div className="mt-3 text-2xl font-bold leading-9 whitespace-nowrap">
                  Thanh toán toàn cầu
                </div>
                <div className="mt-3 text-lg leading-7">
                  Tại các điểm chấp nhận thẻ có logo JCB
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 mt-4 w-full bg-white border border-solid border-[color:var(--Grey-Scale-Black-10,rgba(25,24,37,0.10))]   rounded-[32px] text-[#0F0F0F]">
                <img
                  loading="lazy"
                  src={ImageItem4.src}
                  className="aspect-square w-[75px]"
                />
                <div className="mt-3 text-2xl font-bold leading-9">
                  Giải thưởng Hole in One:
                </div>
                <div className="mt-3 text-lg leading-7">
                  Tặng 01 lượt chơi Golf miễn phí (bao gồm Green Fee + Caddy
                  Fee) khi Chủ thẻ tín dụng Happy Golf đạt được giải thưởng Hole
                  in One.
                </div>
              </div>
              <div className="mt-8 mb-8 text-2xl font-bold leading-9 text-center uppercase whitespace-nowrap text-[#0F0F0F]">
                Tiện ích vượt trội
              </div>
              <img
                loading="lazy"
                src={Image3.src}
                className=" w-full aspect-[1]"
              />
              <div className="flex flex-col px-8 py-9 mt-8 w-full text-2xl font-bold leading-7 text-center bg-[#FCF3D9] border border-solid border-gray-900 border-opacity-10   rounded-[32px] text-[#0F0F0F]">
                <img
                  loading="lazy"
                  src={Box1.src}
                  className="self-center fill-[linear-gradient(90deg,#F0C877_0%,#F9DC76_50%,#FDCB6A_100%)]"
                />
                <div className="mt-6">
                  Thẻ tích hợp ngay trên ứng dụng vHandicap
                </div>
              </div>
              <div className="flex flex-col px-8 py-10 mt-4 w-full text-2xl font-bold leading-7 text-center bg-[#FCF3D9] border border-solid border-gray-900 border-opacity-10   rounded-[32px] text-[#0F0F0F]">
                <img
                  loading="lazy"
                  src={Box2.src}
                  className="self-center fill-[linear-gradient(90deg,#F0C877_0%,#F9DC76_50%,#FDCB6A_100%)]"
                />
                <div className="mt-8">Quản lý chi tiêu hiệu quả</div>
              </div>
              <div className="flex flex-col px-8 py-9 mt-4 w-full text-2xl font-bold leading-7 text-center whitespace-nowrap bg-[#FCF3D9] border border-solid border-gray-900 border-opacity-10 rounded-[32px] text-[#0F0F0F]">
                <img
                  loading="lazy"
                  src={Box3.src}
                  className="self-center fill-[linear-gradient(90deg,#F0C877_0%,#F9DC76_50%,#FDCB6A_100%)]"
                />
                <div className="mt-6">Thanh toán hoá đơn</div>
              </div>
              <div className="flex flex-col px-8 py-9 mt-4 w-full text-2xl font-bold leading-7 text-center bg-[#FCF3D9] border border-solid border-gray-900 border-opacity-10 rounded-[32px] text-[#0F0F0F]">
                <img
                  loading="lazy"
                  src={Box4.src}
                  className="self-center fill-[linear-gradient(90deg,#F0C877_0%,#F9DC76_50%,#FDCB6A_100%)]"
                />
                <div className="mt-7">
                  Phương án thanh toán sao kê linh hoạt
                </div>
              </div>
              <div className="flex flex-col px-8 pt-12 pb-8 mt-4 w-full text-2xl font-bold leading-7 text-center whitespace-nowrap bg-[#FCF3D9] border border-solid border-gray-900 border-opacity-10 rounded-[32px] text-[#0F0F0F]">
                <img
                  loading="lazy"
                  src={Box5.src}
                  className="self-center fill-[linear-gradient(90deg,#F0C877_0%,#F9DC76_50%,#FDCB6A_100%)]"
                />
                <div className="mt-9">Chip EMV</div>
              </div>
              <div className="flex flex-row mx-2 gap-2 justify-between items-start px-8 py-8 mt-8 max-w-full text-sm font-medium leading-5 text-[#B98A3D] bg-white border border-solid border-gray-900 border-opacity-10 rounded-[32px]">
                <div className="w-full text-center">
                  <span className="text-primary">
                    Những câu hỏi thường gặp về{" "}
                  </span>
                  <br />
                  <a
                    href="https://www.namabank.com.vn/Data/Sites/1/media/the/2023/Golf/QA%20THE%20TIN%20DUNG%20HAPPY%20GOLF_08.05.2023.pdf"
                    className="text-primary underline"
                    target="_blank"
                  >
                    thẻ tín dụng Happy Golf
                  </a>
                </div>
                <img loading="lazy" src={NextArrow.src} />
              </div>
              <div
                onClick={onOpenOtpModal}
                className="justify-center cursor-pointer px-9 py-5 mt-8 text-sm font-bold leading-4 text-white uppercase whitespace-nowrap bg-primary rounded-2xl"
              >
                mở thẻ ngay
              </div>
            </div>
            <img
              loading="lazy"
              src={Image4.src}
              className="self-stretch mt-8 w-full aspect-[1]"
            />
          </div>
        </div>
      </main>
      <OTPModal
        open={openOtpModal}
        setOpen={setOpenOtpModal}
        onSuccess={handleVerifyOtpSuccess}
      />
      <InputModal
        onSubmit={onSubmit}
        open={openInputModal}
        setOpen={setOpenInputModal}
        isSubmitting={isSubmitting}
        userForm={userForm}
        errorMessage={errorMessage}
      />
      <SuccessModal open={openSuccessModal} setOpen={setOpenSuccessModal} />
    </>
  );
}
