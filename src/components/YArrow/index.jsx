import React from 'react';
import { Image } from '@tarojs/components';
import arrowRight from './arrow_right.png';
import arrowDown from './arrow_down.png';
import arrowUp from './arrow_up.png';
import './index.scss';

const Right = (props) => {
  const { className = '', ...rest } = props;
  return <Image className={`y-arrow-right ${className}`} src={arrowRight} {...rest} />;
};

const Down = (props) => {
  const { className = '', ...rest } = props;
  return <Image className={`y-arrow-down ${className}`} src={arrowDown} {...rest} />;
};

const Up = (props) => {
  const { className = '', ...rest } = props;
  return <Image className={`y-arrow-down ${className}`} src={arrowUp} {...rest} />;
};

const Arrow = {
  Right,
  Down,
  Up,
};

export default Arrow;
