import { useEffect, useState } from "react";
import SubTitle from "./SubTitle";
import { getSnapshot } from 'mobx-state-tree';
import apiService from '../../services/api.js'
import { useParams, Link } from 'react-router-dom';
import { useMst } from "../../stores/StoreProvider.js";


const ResidentsList = ({residents}) => {
    const urlParams = useParams();
    const [residentsList, setResidentsList] = useState([]);
    const [residentLoading, setResidentLoading] = useState(false)

    const { fetchResidentsList } = useMst(store => ({
        fetchResidentsList: store.fetchResidentsList,
      }));

    useEffect(() => {
        if(residents.length){
            setResidentLoading(true)
            fetchResidentsList(residents).then(residentsData => {
                setResidentLoading(false);
                setResidentsList(residentsData)
            })
            .catch(error => console.log('error', error))
        }
    }, []);
   

    return(
        <>
            <SubTitle>Residents</SubTitle>
            <div className="list">
                {!residentLoading ? residentsList.length ? residentsList.map(resident => (
                !resident
                    ? null
                    : (
                    <Link
                        className="listItem"
                        key={resident.id}
                        to={`/planets/${urlParams.planetId}/residents/${resident.id}`}
                    >
                        {resident.name}
                    </Link>
                    )
                )) : <div>No Residents for this Planet</div> : <div>Loading...</div>}
            </div>
        </>
    )

}

export default ResidentsList;