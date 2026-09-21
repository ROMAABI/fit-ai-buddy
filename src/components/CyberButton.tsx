// Backwards compatibility alias for Button
// Deprecated: use `Button` from `./Button` directly.
import React from 'react';
import { Button, ButtonProps } from './Button';

export type CyberButtonProps = ButtonProps;
export const CyberButton: React.FC<ButtonProps> = (props) => <Button {...props} />;
export default CyberButton;
