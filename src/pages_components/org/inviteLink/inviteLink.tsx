import { useState, useEffect } from 'react';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import copy from 'copy-to-clipboard';

import { isProd, isDev, isLocal } from '@/util/envUtil';

interface Props {
  orgJoinCode: string;
  orgId: string;
  role: 'manager' | 'employee' | 'friendlyOrg';
  action: 'memberJoin' | 'friendlyOrgJoin';
}

const InviteLink = ({ orgId, orgJoinCode, action, role }: Props) => {
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [orgUrlWithJoinCode, setOrgUrlWithJoinCode] = useState('');

  useEffect(() => {
    if (orgId && orgJoinCode && !orgUrlWithJoinCode) {
      const prodUrl = 'https://communion.nyc';
      const devUrl = 'https://labor-pool-frontend.vercel.app';
      const localUrl = 'http://localhost:3000';
      const urlQueryParams = `?inviteeOrgId=${orgId}&joinCode=${orgJoinCode}&action=${action}&role=${role}`;

      if (isProd) {
        setOrgUrlWithJoinCode(`${prodUrl}${urlQueryParams}`);
      } else if (isDev) {
        setOrgUrlWithJoinCode(`${devUrl}${urlQueryParams}`);
      } else if (isLocal) {
        setOrgUrlWithJoinCode(`${localUrl}${urlQueryParams}`);
      }
    }
  }, [orgId, orgJoinCode, orgUrlWithJoinCode, action, role]);

  return (
    <div className="flex-col my-5 flex w-full text-start">
      <label>
        <span className="text-xl">Invite code</span>
      </label>
      <div className="flex flex-row">
        <input
          readOnly
          className="w-full grow border-1px border-thirdLightGray bg-white py-2 pl-5 pr-4 text-primaryPurple focus:outline-0"
          value={orgUrlWithJoinCode}
        />
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            copy(orgUrlWithJoinCode);
            setShowCopySuccess(true);
            setTimeout(() => {
              setShowCopySuccess(false);
            }, 1000);
          }}
        >
          {showCopySuccess && (
            <>
              <CheckBadgeIcon className="mr-2 h-6 w-6" />
              Copied!
            </>
          )}
          {!showCopySuccess && 'Copy'}
        </button>
      </div>
    </div>
  );
};

export const InviteTextArea = ({ orgId, orgJoinCode, action }: Props) => {
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [orgUrlWithJoinCode, setOrgUrlWithJoinCode] = useState('');
  const [message, setMessage] =
    useState(`Hi, I've created a shared worker pool for shift coverage on the Communion app, and I'd like to add you to my Friend's List. 

It'll allow us to have our workers cover each others' unfilled shifts. 
  
You can sign up with this link ${orgUrlWithJoinCode}`);

  useEffect(() => {
    if (orgId && orgJoinCode && !orgUrlWithJoinCode) {
      const prodUrl = 'https://communion.nyc';
      const devUrl = 'https://labor-pool-frontend.vercel.app';
      const localUrl = 'http://localhost:3000';
      const urlQueryParams = `?inviteeOrgId=${orgId}&joinCode=${orgJoinCode}&action=${action}`;

      if (isProd) {
        setOrgUrlWithJoinCode(`${prodUrl}${urlQueryParams}`);
      } else if (isDev) {
        setOrgUrlWithJoinCode(`${devUrl}${urlQueryParams}`);
      } else if (isLocal) {
        setOrgUrlWithJoinCode(`${localUrl}${urlQueryParams}`);
      }
    }
  }, [orgId, orgJoinCode, orgUrlWithJoinCode]);

  useEffect(() => {
    if (message && !message.includes('http')) {
      setMessage(`${message} ${orgUrlWithJoinCode}`);
    }
  }, [message, orgUrlWithJoinCode]);

  return (
    <div className="flex-col my-8 flex w-full text-start">
      <label>
        <span className="text-xl">Invite code</span>
      </label>
      <textarea
        rows={11}
        className="h-auto w-90vw border-1px border-thirdLightGray bg-white px-2 py-2 text-primaryPurple focus:outline-0"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="button"
        className="mt-2 inline-flex w-fit items-center place-self-end rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() => {
          copy(message);
          setShowCopySuccess(true);
          setTimeout(() => {
            setShowCopySuccess(false);
          }, 1000);
        }}
      >
        {showCopySuccess && (
          <>
            <CheckBadgeIcon className="mr-2 h-6 w-6" />
            Copied!
          </>
        )}
        {!showCopySuccess && 'Copy'}
      </button>
    </div>
  );
};

export default InviteLink;
