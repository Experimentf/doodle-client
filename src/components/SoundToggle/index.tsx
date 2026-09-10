import { useState } from 'react';
import { FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';

import IconButton from '@/components/Button/IconButton';
import { isSoundEnabled, setSoundEnabled } from '@/utils/sounds/soundSettings';

const SoundToggle = () => {
  const [enabled, setEnabled] = useState(isSoundEnabled);

  const handleToggle = () => {
    const next = !enabled;
    setSoundEnabled(next);
    setEnabled(next);
  };

  return (
    <IconButton
      variant="primary"
      color="primary"
      className="text-2xl"
      onClick={handleToggle}
      type="button"
      tooltip={enabled ? 'Mute sounds' : 'Unmute sounds'}
      icon={enabled ? <FaVolumeHigh /> : <FaVolumeXmark />}
    />
  );
};

export default SoundToggle;
