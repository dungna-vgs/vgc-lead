import React from 'react';
import AppStore from '@/assets/images/app-store.svg';
import ChPlay from '@/assets/images/chplay.svg';

const DownloadSection = () => {
  return (
    <>
      <div className="self-stretch mt-3 text-sm font-medium leading-5 text-center text-gray-800 whitespace-nowrap">
        Tải ứng dụng vHandicap
      </div>
      <div className="flex gap-2.5 justify-between mt-3 w-full">
        <a
          target={'_blank'}
          href={'https://apps.apple.com/vn/app/vhandicap-golf/id1269491596'}
          className="cursor-pointer flex-1 shrink-0 w-full aspect-[3.45]"
        >
          <img
            loading="lazy"
            alt={'app ios'}
            src={AppStore.src}
            className="cursor-pointer flex-1 shrink-0 w-full aspect-[3.45]"
          />
        </a>

        <a
          target={'_blank'}
          href={
            'https://play.google.com/store/apps/details?id=com.golfervn.vga.vgagolfer&pcampaignid=web_share'
          }
          className="cursor-pointer flex-1 shrink-0 w-full aspect-[3.45]"
        >
          <img
            loading="lazy"
            src={ChPlay.src}
            className="cursor-pointer flex-1 shrink-0 w-full aspect-[3.45]"
            alt={'app android'}
          />
        </a>
      </div>
    </>
  );
};

export default DownloadSection;
