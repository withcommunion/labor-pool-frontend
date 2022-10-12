import Image from 'next/image';

const Footer = () => {
  return (
    <div className="mt-10 mb-4 flex items-center justify-center">
      <Image
        src="/images/logo-black.svg"
        alt="communion logo"
        width="120px"
        height="32px"
      />
    </div>
  );
};

export default Footer;
