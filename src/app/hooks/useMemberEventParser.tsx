import React, { ReactNode } from 'react';
import { IconSrc, Icons } from 'folds';
import { MatrixEvent } from 'matrix-js-sdk';
import { useTranslation } from 'react-i18next';
import { IMemberContent, Membership } from '../../types/matrix/room';
import { getMxIdLocalPart } from '../utils/matrix';
import { isMembershipChanged } from '../utils/room';

export type ParsedResult = {
  icon: IconSrc;
  body: ReactNode;
};

export type MemberEventParser = (mEvent: MatrixEvent) => ParsedResult;

export const useMemberEventParser = (): MemberEventParser => {
  const { t } = useTranslation();

  const parseMemberEvent: MemberEventParser = (mEvent) => {
    const content = mEvent.getContent<IMemberContent>();
    const prevContent = mEvent.getPrevContent() as IMemberContent;
    const senderId = mEvent.getSender();
    const userId = mEvent.getStateKey();
    const reason = typeof content.reason === 'string' ? content.reason : undefined;

    if (!senderId || !userId)
      return {
        icon: Icons.User,
        body: t('Chat.Timeline.broken_membership', 'Broken membership event'),
      };

    const senderName = getMxIdLocalPart(senderId);
    const userName =
      typeof content.displayname === 'string'
        ? content.displayname || getMxIdLocalPart(userId)
        : getMxIdLocalPart(userId);

    if (isMembershipChanged(mEvent)) {
      if (content.membership === Membership.Invite) {
        if (prevContent.membership === Membership.Knock) {
          return {
            icon: Icons.ArrowGoRightPlus,
            body: (
              <>
                <b>{senderName}</b>
                {t('Chat.Timeline.accepted_join_request', ' accepted ')}
                <b>{userName}</b>
                {reason ? ` (${reason})` : ''}
              </>
            ),
          };
        }

        return {
          icon: Icons.ArrowGoRightPlus,
          body: (
            <>
              <b>{senderName}</b>
              {t('Chat.Timeline.invited', ' invited ')}
              <b>{userName}</b>
              {reason ? ` (${reason})` : ''}
            </>
          ),
        };
      }

      if (content.membership === Membership.Knock) {
        return {
          icon: Icons.ArrowGoRightPlus,
          body: (
            <>
              <b>{userName}</b>
              {t('Chat.Timeline.join_request', ' request to join room')}
              {reason ? ` (${reason})` : ''}
            </>
          ),
        };
      }

      if (content.membership === Membership.Join) {
        return {
          icon: Icons.ArrowGoRight,
          body: (
            <>
              <b>{userName}</b>
              {t('Chat.Timeline.joined', ' joined the room')}
            </>
          ),
        };
      }

      if (content.membership === Membership.Leave) {
        if (prevContent.membership === Membership.Invite) {
          return {
            icon: Icons.ArrowGoRightCross,
            body:
              senderId === userId ? (
                <>
                  <b>{userName}</b>
                  {t('Chat.Timeline.rejected_invitation', ' rejected the invitation')}
                  {reason ? ` (${reason})` : ''}
                </>
              ) : (
                <>
                  <b>{senderName}</b>
                  {t('Chat.Timeline.rejected_join_request', ' rejected ')}
                  <b>{userName}</b>
                  {reason ? ` (${reason})` : ''}
                </>
              ),
          };
        }

        if (prevContent.membership === Membership.Knock) {
          return {
            icon: Icons.ArrowGoRightCross,
            body:
              senderId === userId ? (
                <>
                  <b>{userName}</b>
                  {t('Chat.Timeline.revoked_join_request', ' revoked join request')}
                  {reason ? ` (${reason})` : ''}
                </>
              ) : (
                <>
                  <b>{senderName}</b>
                  {t('Chat.Timeline.revoked_invite', ' revoked ')}
                  <b>{userName}</b>
                  {reason ? ` (${reason})` : ''}
                </>
              ),
          };
        }

        if (prevContent.membership === Membership.Ban) {
          return {
            icon: Icons.ArrowGoLeft,
            body: (
              <>
                <b>{senderName}</b>
                {t('Chat.Timeline.unbanned', ' unbanned ')}
                <b>{userName}</b>
                {reason ? ` (${reason})` : ''}
              </>
            ),
          };
        }

        return {
          icon: Icons.ArrowGoLeft,
          body:
            senderId === userId ? (
              <>
                <b>{userName}</b>
                {t('Chat.Timeline.left', ' left the room')}
                {reason ? ` (${reason})` : ''}
              </>
            ) : (
              <>
                <b>{senderName}</b>
                {t('Chat.Timeline.kicked', ' kicked ')}
                <b>{userName}</b>
                {reason ? ` (${reason})` : ''}
              </>
            ),
        };
      }

      if (content.membership === Membership.Ban) {
        return {
          icon: Icons.ArrowGoLeft,
          body: (
            <>
              <b>{senderName}</b>
              {t('Chat.Timeline.banned', ' banned ')}
              <b>{userName}</b>
              {reason ? ` (${reason})` : ''}
            </>
          ),
        };
      }
    }

    if (content.displayname !== prevContent.displayname) {
      const prevUserName =
        typeof prevContent.displayname === 'string'
          ? prevContent.displayname || getMxIdLocalPart(userId)
          : getMxIdLocalPart(userId);

      return {
        icon: Icons.Mention,
        body:
          typeof content.displayname === 'string' ? (
            <>
              <b>{prevUserName}</b>
              {t('Chat.Timeline.changed_display_name', ' changed display name to ')}
              <b>{userName}</b>
            </>
          ) : (
            <>
              <b>{prevUserName}</b>
              {t('Chat.Timeline.removed_display_name', ' removed their display name')}
            </>
          ),
      };
    }
    if (content.avatar_url !== prevContent.avatar_url) {
      return {
        icon: Icons.User,
        body:
          content.avatar_url && typeof content.avatar_url === 'string' ? (
            <>
              <b>{userName}</b>
              {t('Chat.Timeline.changed_avatar', ' changed their avatar')}
            </>
          ) : (
            <>
              <b>{userName}</b>
              {t('Chat.Timeline.removed_avatar', ' removed their avatar')}
            </>
          ),
      };
    }

    return {
      icon: Icons.User,
      body: t('Chat.Timeline.no_changes', 'Membership event with no changes'),
    };
  };

  return parseMemberEvent;
};
