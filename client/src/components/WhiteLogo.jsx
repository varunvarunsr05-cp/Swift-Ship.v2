import React from "react";

/**
 * SwiftShip mark — three tapering navy bands flowing into a curved
 * tail, crossed by a single orange diagonal blade.
 * Colors match the brand palette exactly: navy #0B2A6F, orange #FF6B00.
 */
export default function WhiteLogo({ className = "w-35 h-auto" }) {
    return (
    <div className={`flex items-center ${className}`}>
        <svg
            width="48"
            height="48"
            viewBox="0 0 1300 1150"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label="SwiftShip logo"
        >
            {/* Band 1 — top */}
            <path
                d="M168,230
           Q150,230 150,248
           L150,390
           L790,390
           L946,238
           Q952,230 940,230
           Z"
                fill="#f5f8ff"
            />

            {/* Band 2 — middle */}
            <path
                d="M213,440
           Q195,440 195,458
           L195,600
           L716,600
           L852,448
           Q858,440 846,440
           Z"
                fill="#f5f8ff"
            />

            {/* Band 3 + tapering tail */}
            <path
                d="M258,650
           Q240,650 240,668
           L240,780
           Q240,796 256,796
           L592,796
           L700,660
           Q706,650 692,650
           Z
           M256,796
           L470,796
           Q460,860 420,910
           Q382,958 415,1000
           Q432,1022 452,1006
           Q486,978 512,932
           Q560,850 592,796
           Z"
                fill="#f5f8ff"
                fillRule="nonzero"
            />

            {/* Orange diagonal blade */}
            <path
                d="M1180,205
           L940,645
           L735,985
           L1075,625
           Z"
                fill="#FF6B00"
            />
        </svg>

     {/* Wordmark */}
      <div className="ml-1 flex flex-col leading-none">
        <span className="font-['Inter'] text-[22px] font-bold tracking-[-0.5px] text-[#f5f8ff]">
          SwiftShip
        </span>

        <span className="mt-[3px] font-['Inter'] text-[7px] font-semibold tracking-[0.2px] text-[#f5f8ff]">
          Delivering a Smarter Tomorrow
        </span>
      </div>
    </div>
  );
};