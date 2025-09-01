import { useMst } from '../../stores/StoreProvider';
import { Link } from 'react-router-dom';

const Pagination = () => {
    const storeValues = useMst(store => ({
        planets: store.planets,
        people: store.people
      }));
      

    console.log(storeValues.people, storeValues.planets)

    return(
        <Link  to={'/'}>1</Link>
    )

}

export default Pagination;