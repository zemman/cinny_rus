import { Box, Icon, Icons, Text, as, color, config } from 'folds';
import React from 'react';
import { useTranslation } from 'react-i18next';

const warningStyle = { color: color.Warning.Main, opacity: config.opacity.P300 };
const criticalStyle = { color: color.Critical.Main, opacity: config.opacity.P300 };

export const MessageDeletedContent = as<'div', { children?: never; reason?: string }>(
  ({ reason, ...props }, ref) => {
    const { t } = useTranslation();
    return (
      <Box as="span" alignItems="Center" gap="100" style={warningStyle} {...props} ref={ref}>
        <Icon size="50" src={Icons.Delete} />
        {reason ? (
          <i>{`${t('Chat.Message.deleted', 'This message has been deleted')}. ${reason}`}</i>
        ) : (
          <i>{t('Chat.Message.deleted', 'This message has been deleted')}</i>
        )}
      </Box>
    );
  }
);

export const MessageUnsupportedContent = as<'div', { children?: never }>(({ ...props }, ref) => {
  const { t } = useTranslation();
  return (
    <Box as="span" alignItems="Center" gap="100" style={criticalStyle} {...props} ref={ref}>
      <Icon size="50" src={Icons.Warning} />
      <i>{t('Chat.Message.unsupported', 'Unsupported message')}</i>
    </Box>
  );
});

export const MessageFailedContent = as<'div', { children?: never }>(({ ...props }, ref) => {
  const { t } = useTranslation();
  return (
    <Box as="span" alignItems="Center" gap="100" style={criticalStyle} {...props} ref={ref}>
      <Icon size="50" src={Icons.Warning} />
      <i>{t('Chat.Message.failed_to_load', 'Failed to load message')}</i>
    </Box>
  );
});

export const MessageBadEncryptedContent = as<'div', { children?: never }>(({ ...props }, ref) => {
  const { t } = useTranslation();
  return (
    <Box as="span" alignItems="Center" gap="100" style={warningStyle} {...props} ref={ref}>
      <Icon size="50" src={Icons.Lock} />
      <i>{t('Chat.Timeline.unable_to_decrypt', 'Unable to decrypt message')}</i>
    </Box>
  );
});

export const MessageNotDecryptedContent = as<'div', { children?: never }>(({ ...props }, ref) => {
  const { t } = useTranslation();
  return (
    <Box as="span" alignItems="Center" gap="100" style={warningStyle} {...props} ref={ref}>
      <Icon size="50" src={Icons.Lock} />
      <i>{t('Chat.Message.not_decrypted_yet', 'This message is not decrypted yet')}</i>
    </Box>
  );
});

export const MessageBrokenContent = as<'div', { children?: never }>(({ ...props }, ref) => {
  const { t } = useTranslation();
  return (
    <Box as="span" alignItems="Center" gap="100" style={criticalStyle} {...props} ref={ref}>
      <Icon size="50" src={Icons.Warning} />
      <i>{t('Chat.Message.broken', 'Broken message')}</i>
    </Box>
  );
});

export const MessageEmptyContent = as<'div', { children?: never }>(({ ...props }, ref) => {
  const { t } = useTranslation();
  return (
    <Box as="span" alignItems="Center" gap="100" style={criticalStyle} {...props} ref={ref}>
      <Icon size="50" src={Icons.Warning} />
      <i>{t('Chat.Message.empty', 'Empty message')}</i>
    </Box>
  );
});

export const MessageEditedContent = as<'span', { children?: never }>(({ ...props }, ref) => {
  const { t } = useTranslation();
  return (
    <Text as="span" size="T200" priority="300" {...props} ref={ref}>
      {` (${t('Chat.Message.edited', 'edited')})`}
    </Text>
  );
});
