import React, { createElement } from "react";
import { footerLinks, footerSocial } from "@/constants/footer.js";
import { Separator } from "@/components/ui/separator.jsx";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex flex-col px-40 pt-20 pb-8 bg-neutral-900 max-md:px-5">
      <div className="flex flex-col pb-2">
        <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
          <div className="flex flex-wrap gap-8 items-center self-stretch my-auto min-w-[240px] w-[544px] max-md:max-w-full">
            <h2 className="grow shrink self-stretch my-auto text-2xl font-medium leading-none text-center text-white w-[105px]">
              3legant<span className="text-zinc-500">.</span>
            </h2>
            <div className="w-[1px] h-6 bg-zinc-500" />
            <p className="grow shrink self-stretch my-auto text-sm leading-loose text-gray-200 w-[350px]">
              Gift & Decoration Store
            </p>
          </div>

          <nav className="flex gap-10 items-start self-stretch my-auto text-sm leading-loose text-white min-w-[240px]">
            {footerLinks.map((link) => (
              <a key={link.title} href={`${link.link}`}>
                {link.title}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex flex-wrap gap-10 justify-between items-start py-4 mt-6 max-md:mt-10">
        <Separator className="my-2 bg-[#6C7275]" />
        <div className="flex flex-wrap gap-7 items-start text-xs font-semibold leading-loose text-white min-w-[240px]">
          <p className="text-gray-200">
            Copyright © 2023 3legant. All rights reserved
          </p>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-use">Terms of Use</a>
        </div>

        <div className="flex gap-6 items-start">
          {footerSocial.map((icon, index) => (
            <a key={index} href={icon.link}>
              {createElement(icon.icon, {
                width: 24,
                height: 24,
                size: 24,
              })}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
