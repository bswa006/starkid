import React from "react";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <svg
          width="32"
          height="32"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          {/* Simple star shape */}
          <path
            d="M256 96l48 144h144l-120 96 48 144-120-96-120 96 48-144-120-96h144l48-144z"
            className="fill-[#6B7FE3]"
            fillOpacity="0.9"
          />
          {/* Subtle glow effect */}
          <path
            d="M256 136l36 108h108l-90 72 36 108-90-72-90 72 36-108-90-72h108l36-108z"
            className="fill-white"
            fillOpacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}

export default Logo;
