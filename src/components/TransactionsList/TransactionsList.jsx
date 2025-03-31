import TransactionsDescItem from '../TransactionsDescItem/TransactionsDescItem';
import TransactionsMobileItem from '../TransactionsMobileItem/TransactionsMobileItem';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectTransactions,
  selectCategories,
} from '../../redux/transactions/selectors';
import { getCategoriesThunk } from '../../redux/transactions/operations';

import s from './TransactionsList.module.css';

import { useMedia } from 'hooks';
import useDeleteToast from '../DeleteToast/DeleteToast';
import clsx from 'clsx';
import { useEffect } from 'react';

const TransactionsList = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const categories = useSelector(selectCategories);
  const { isTablet } = useMedia();
  const { showDeleteToast, deletedIds } = useDeleteToast();
  const handleDelete = (transactionId, sum, comment) => {
    showDeleteToast(transactionId, sum, comment);
  };

  useEffect(() => {
    if (!categories.length) {
      dispatch(getCategoriesThunk());
    }
  }, [dispatch, categories.length]);

  if (!categories.length) {
    return null; // or return a loading spinner
  }

  return (
    <>
      {isTablet ? (
        <table className={s.table}>
          <thead className={s.thead}>
            <tr className={s.t_row}>
              <th className={s.title}>Date</th>
              <th className={s.title}>Type</th>
              <th className={s.title}>Category</th>
              <th className={s.title}>Comment</th>
              <th className={clsx(s.title, s.sum)}>Sum</th>
              <th className={s.title}></th>
            </tr>
          </thead>
          <tbody className={s.tbody}>
            {transactions.map(item => (
              <TransactionsDescItem
                key={item.id}
                item={item}
                categories={categories}
                deletedIds={deletedIds}
                handleDelete={handleDelete}
                index={transactions.indexOf(item) + 1}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <ul className={s.list}>
          {transactions.map(item => (
            <TransactionsMobileItem
              key={item.id}
              item={item}
              handleDelete={handleDelete}
              index={transactions.indexOf(item) + 1}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default TransactionsList;
