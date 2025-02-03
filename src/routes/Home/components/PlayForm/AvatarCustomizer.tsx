import { AvatarProps } from '@bigheads/core';
import { ChangeEventHandler, useState } from 'react';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Dialog from '@/components/Dialog';
import Text from '@/components/Text';
import { avatarPropToOptionsMap } from '@/utils/avatar';

interface AvatarCustomizerProps {
  visible: boolean;
  onClose: () => void;
  avatar: AvatarProps;
  onSave: (avatar: AvatarProps) => void;
}

const AvatarCustomizer = ({
  visible,
  onClose,
  avatar,
  onSave,
}: AvatarCustomizerProps) => {
  const [customAvatar, setCustomAvatar] = useState<AvatarProps>(avatar);

  const handleSave = () => {
    onSave(customAvatar);
    onClose();
  };

  const handlePropChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setCustomAvatar((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      title="Customize your avatar"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" color="warning" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    >
      <Avatar className="w-64" avatarProps={customAvatar} />
      <div className="grid grid-cols-3 grid-flow-row gap-4">
        {Object.keys(avatarPropToOptionsMap).map((key) => (
          <div key={key}>
            <Text>{key.toUpperCase()}:</Text>
            <select
              name="key"
              onChange={handlePropChange}
              value={customAvatar[key as keyof AvatarProps] as string}
            >
              {avatarPropToOptionsMap[
                key as keyof typeof avatarPropToOptionsMap
              ].map((val, index) => (
                <option key={index} value={val.toString()}>
                  {val.toString().toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export default AvatarCustomizer;
