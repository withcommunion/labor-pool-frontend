import Image from 'next/image';

const Footer = () => {
  return (
    <div className="mb-5 flex items-center justify-center">
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
