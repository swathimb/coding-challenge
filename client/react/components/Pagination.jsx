import { useMst } from '../../stores/StoreProvider.js';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './pagination.scss';

const Pagination = ({section, count}) => {

    let pageNumbers = Math.ceil(count/10)
    const [searchParams] = useSearchParams();
    let currentPage = searchParams.get("page");
    console.log(currentPage, 'currentPage')
    return(
        <div className='pagination'>
        <Link  to={'/'}>{'<'}</Link>
        { Array(pageNumbers).fill(0).map((_, i) => <Link  key={i} className= {Number(currentPage) === i + 1 ? 'activePage' : ''} to={`?page=${i+1}`}>{i + 1}</Link>)}
        <Link  to={'/'}>{'>'}</Link>
        </div>
    )

}

export default Pagination;