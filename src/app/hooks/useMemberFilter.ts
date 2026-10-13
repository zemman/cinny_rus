import { useMemo } from 'react';
import { RoomMember } from 'matrix-js-sdk';
import { useTranslation } from 'react-i18next';
import { Membership } from '../../types/matrix/room';

export const MembershipFilter = {
  filterJoined: (m: RoomMember) => m.membership === Membership.Join,
  filterInvited: (m: RoomMember) => m.membership === Membership.Invite,
  filterLeaved: (m: RoomMember) =>
    m.membership === Membership.Leave &&
    m.events.member?.getStateKey() === m.events.member?.getSender(),
  filterKicked: (m: RoomMember) =>
    m.membership === Membership.Leave &&
    m.events.member?.getStateKey() !== m.events.member?.getSender(),
  filterBanned: (m: RoomMember) => m.membership === Membership.Ban,
};

export type MembershipFilterFn = (m: RoomMember) => boolean;

export type MembershipFilterItem = {
  name: string;
  filterFn: MembershipFilterFn;
};

export const useMembershipFilterMenu = (): MembershipFilterItem[] => {
  const { t } = useTranslation();
  return useMemo(
    () => [
      {
        name: t('Chat.MembersDrawer.filter_joined', 'Joined'),
        filterFn: MembershipFilter.filterJoined,
      },
      {
        name: t('Chat.MembersDrawer.filter_invited', 'Invited'),
        filterFn: MembershipFilter.filterInvited,
      },
      {
        name: t('Chat.MembersDrawer.filter_left', 'Left'),
        filterFn: MembershipFilter.filterLeaved,
      },
      {
        name: t('Chat.MembersDrawer.filter_kicked', 'Kicked'),
        filterFn: MembershipFilter.filterKicked,
      },
      {
        name: t('Chat.MembersDrawer.filter_banned', 'Banned'),
        filterFn: MembershipFilter.filterBanned,
      },
    ],
    [t]
  );
};

export const useMembershipFilter = (
  index: number,
  membershipFilter: MembershipFilterItem[]
): MembershipFilterItem => {
  const filter = membershipFilter[index] ?? membershipFilter[0];
  return filter;
};
