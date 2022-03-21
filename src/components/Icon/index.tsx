import React from 'react';
import classNames from 'classnames'

type IconType = {
  type: string,
  className?: string,
  onClick?: () => void,
}
const Icon = ({ type, className, onClick }: IconType) => {
  return (
    <svg
      className={classNames('icon', className)}
      aria-hidden="true"
      onClick={onClick}
    >
      <use xlinkHref={`#${type}`}></use>
    </svg>
  );
}

export default Icon;
