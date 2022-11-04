import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/router';

import DesktopNav from './desktopNav';
import MobileNav from './mobileNav';

export default function NavContainer() {
  const { signOut } = useAuthenticator((context) => [context.signOut]);
  const router = useRouter();

  const onSignOut = () => {
    signOut();
    setTimeout(() => {
      router.push('/');
    }, 500);
  };
  return (
    <>
      <div className="hidden md:contents">
        {<DesktopNav signOut={onSignOut} />}
      </div>
      <div className="contents md:hidden">
        {<MobileNav signOut={onSignOut} />}
      </div>
    </>
  );
}
