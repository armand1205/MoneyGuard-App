import s from './EmptyHistory.module.css';

const EmptyHistory = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.content}>
        <h4 className={s.title}>Transaction history is now empty</h4>
      </div>
    </div>
  );
};

export default EmptyHistory;
