import React, { FC } from 'react';
import { SvgXml } from 'react-native-svg';

const tabbarBackgroundXml = `
<svg width="375" height="86" viewBox="0 0 375 86" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 20C0 8.9543 8.95431 0 20 0H355C366.046 0 375 8.95431 375 20V86H0V20Z" fill="url(#paint0_radial_4_175)" />
  <defs>
    <radialGradient id="paint0_radial_4_175" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(37.5 5.50001) rotate(64.7989) scale(56.3649 245.777)">
      <stop stop-color="#3D2726" />
      <stop offset="1" stop-color="#161716" />
    </radialGradient>
  </defs>
</svg>
`;

const TabbarBackground: FC = ({ children }) => {
  return <SvgXml xml={tabbarBackgroundXml}>{children}</SvgXml>;
};

export default TabbarBackground;
