// @flow

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ORANGE, WHITE } from '@/utils/colors';

type Props = {
  color: string,
  background: string,
  width: number,
  height: number,
};

const VerifiedSticker = ({
  color = ORANGE,
  background = WHITE,
  width = 13,
  height = 13,
}: Props) => (
  <Svg width={width} height={height} viewBox="0 0 13 13" fill="none">
    <Path
      d="M6.5 0L8.14706 1.43087L10.3206 1.24139L10.8121 3.3671L12.6819 4.49139L11.83 6.5L12.6819 8.50861L10.8121 9.6329L10.3206 11.7586L8.14706 11.5691L6.5 13L4.85294 11.5691L2.6794 11.7586L2.18794 9.6329L0.318133 8.50861L1.17 6.5L0.318133 4.49139L2.18794 3.3671L2.6794 1.24139L4.85294 1.43087L6.5 0Z"
      fill={color}
    />
    <Path
      d="M4 6.5L5.66667 8L9 5"
      stroke={background}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default VerifiedSticker;
