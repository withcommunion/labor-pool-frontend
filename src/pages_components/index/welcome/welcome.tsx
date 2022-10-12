import Image from 'next/image';

const Welcome = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex flex-col items-center justify-center pt-10">
        <span className="z-10 font-paytoneOne text-6xl text-fifthOrange">
          Welcome
        </span>
        <span className="z-10 mb-8 pt-3 text-xl font-semibold text-primaryGray">
          Please sign in or create an account
        </span>

        <div className="absolute -right-10 -top-2">
          <Image
            src="/images/logo-symbol-orange.svg"
            alt="background decoration image"
            width="149px"
            height="199px"
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
