import clsx from 'clsx';
import s from './Logo.module.css';
import icons from '../../../images/icons/sprite.svg';

const Logo = ({ type }) => {
  return (
    <div className={clsx(s.logo, type === 'header' && s.headerLogo)}>
      <svg width="32px" height="36px">
        <use href={`${icons}#icon-logo`}></use>
      </svg>
      <h2 className={s.textLogo}>Money Guard</h2>
    </div>
  );
};

export default Logo;
