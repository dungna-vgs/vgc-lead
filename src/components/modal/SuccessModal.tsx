import { Modal } from "@/components/modal/Modal";

export default function SuccessModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="flex flex-col justify-center items-center px-12 py-20 text-sm font-bold text-secondary bg-white rounded-3xl shadow-sm max-w-[376px]">
        <div className="text-2xl tracking-tight leading-5 text-center whitespace-nowrap">
          Thông báo
        </div>
        <div className="self-stretch mt-5 font-medium leading-5 text-center">
          Thông tin của Quý khách đã được gửi đi thành công! Nam A Bank sẽ liên
          lạc với Quý khách trong 24h.
        </div>
        <div
          onClick={() => setOpen(false)}
          className="justify-center cursor-pointer items-center px-10 py-5 mt-5 text-white whitespace-nowrap bg-sky-600 rounded-xl shadow-sm"
        >
          ĐÓNG
        </div>
      </div>
    </Modal>
  );
}
