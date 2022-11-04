import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import DesktopNav from './desktopNav';
import MobileNav from './mobileNav';

export default function NavContainer() {
  const { signOut } = useAuthenticator((context) => [context.signOut]);
  const router = useRouter();
  const [shouldRenderNav, setShouldRenderNav] = useState(false);
  const path = router.pathname;

  useEffect(() => {
    const pathsToNotRenderNav = ['/', '/login', '/404'];
    if (pathsToNotRenderNav.includes(path)) {
      setShouldRenderNav(false);
    } else {
      setShouldRenderNav(true);
    }
  }, [path]);

  const onSignOut = () => {
    signOut();
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  return shouldRenderNav ? (
    <>
      <div className="hidden md:contents">
        {<DesktopNav signOut={onSignOut} />}
      </div>
      <div className="contents md:hidden">
        {<MobileNav signOut={onSignOut} />}
      </div>
    </>
  ) : null;
}
