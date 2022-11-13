// import axios from 'axios';
import { IEvent } from '@/features/feedSlice';
import { IShift } from '@/features/orgShiftsSlice';
import { IOrg } from '@/features/orgSlice';
import { IUser } from '@/features/selfSlice';
import { isProd } from '@/util/envUtil';

const DEV_API_URL = 'https://utdp73znch.execute-api.us-east-1.amazonaws.com';
const PROD_API_URL = 'https://l5x0lrfh8j.execute-api.us-east-1.amazonaws.com';
export const API_URL = isProd ? PROD_API_URL : DEV_API_URL;

export function parseIdFromUrn(urn: string): string {
  return urn.split(':')[2];
}

export function parseEntityFromOwnerEntity(ownerEntity?: {
  org?: IOrg;
  user?: IUser;
}) {
  if (!ownerEntity?.org && !ownerEntity?.user) {
    return {};
  }

  return {
    name:
      ownerEntity.org?.name ||
      `${ownerEntity.user?.firstName || ''} ${
        ownerEntity.user?.lastName || ''
      }`,
    id: ownerEntity.org?.id || ownerEntity.user?.id,
    queryPathname: ownerEntity.org ? '/org/[orgId]' : '/user/[userId]',
    queryVals: ownerEntity.org
      ? { orgId: ownerEntity.org.id }
      : { userId: ownerEntity.user?.id },
  };
}

export function parseEvent(event: IEvent) {
  const eventType = event.eventUrn.split(':')[1] as
    | 'shiftApplication'
    | 'shift'
    | 'org'
    | 'user';

  const eventAction = event.event.toLowerCase() as
    | 'insert'
    | 'modify'
    | 'remove';

  const ownerEntity = parseEntityFromOwnerEntity(event.ownerEntity);

  if (eventType === 'shiftApplication') {
    if (eventAction === 'insert') {
      return {
        ownerEntity,
        description: `Applied to a shift`,
      };
    }
    if (eventAction === 'remove') {
      return {
        ownerEntity,
        description: 'Unapplied from a shift',
      };
    }
  } else if (eventType === 'shift') {
    const shiftRecord = event.record as IShift;
    if (eventAction === 'insert') {
      return {
        ownerEntity,
        description: `Created a shift: ${shiftRecord.name}`,
      };
    }
    if (eventAction === 'modify') {
      return {
        ownerEntity,
        description: 'Modified a shift: ${shiftRecord.name}',
      };
    }
    if (eventAction === 'remove') {
      return {
        ownerEntity,
        description: 'Deleted a shift: ${shiftRecord.name}',
      };
    }
  } else if (eventType === 'org') {
    const shiftRecord = event.record as IOrg;
    if (eventAction === 'insert') {
      return {
        ownerEntity,
        description: `${shiftRecord.name}, joined Communion!`,
      };
    }
    if (eventAction === 'modify') {
      return {
        ownerEntity,
        description: `${shiftRecord.name} updated their profile`,
      };
    }
    if (eventAction === 'remove') {
      return {
        ownerEntity,
        description: `Deleted an organization: ${shiftRecord.name}`,
      };
    }
  } else if (eventType === 'user') {
    const userRecord = event.record as IUser;
    if (eventAction === 'insert') {
      return {
        ownerEntity,
        description: `${userRecord.firstName} ${userRecord.lastName} joined Communion!`,
      };
    } else if (eventAction === 'modify') {
      return {
        ownerEntity,
        description: `${userRecord.firstName} ${userRecord.lastName} updated their profile`,
      };
    }
  } else {
    return {};
  }
}
