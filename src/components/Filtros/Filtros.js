import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getPosts, setFilters } from '../../actions/formEmpleador';
import { getJobs } from '../../actions/formJobs';
import { profileUser } from '../../actions/profileActions';
import OrdenadorDistancia from '../../helpers/distanciaPuntos';
import './Filtros.css'

export default function Filtros() {

  const dispatch = useDispatch();


  const [filtro, setFiltro] = React.useState({
    Prioridad: '',
    maximo: 10,
    oficio: null,
  })

  const [enable, setEnable] = React.useState(false)



  const usuario = useSelector(state => state.profile.ownProfile);
  const storePosts = useSelector(state => state.posts.allPosts);


  // console.log("usuario filtros",usuario)
  React.useEffect(() => {
    dispatch(getPosts());
  }, [dispatch])


  React.useEffect(() => {
    async function setear() {
      if (enable && usuario.usr_location !== null) {
        const ordenado = await OrdenadorDistancia(Filtrado(storePosts, filtro), usuario, filtro.maximo);
        // console.log("ordenado", ordenado)
        dispatch(setFilters(ordenado.map(elemento => { return elemento.post })))
      }
      else { dispatch(setFilters(Filtrado(storePosts, filtro))) }
    }
    setear();
    // console.log("filtro aplicado", filtro); 
  }, [dispatch, filtro, storePosts, enable, usuario])


  //select oficio
  const { allJobs } = useSelector((state) => state.jobs);

  const [formValues, setFormValues] = React.useState({
    job: "",
    id: null,
  });
  const [hideList, setHideList] = React.useState(false);

  const { job, id } = formValues;

  const handleUnable = (e) => {
    setEnable(!enable);
  }

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value, id: null
    });
    setHideList(false);
  };
  const selectJob = (value) => {
    setFormValues({ ...formValues, job: value.job_name, id: value.job_id });
    // console.log("oficio", value.job_id)
    setFiltro({ ...filtro, oficio: value.job_id })
    if (value.legth === 0) {
      setFiltro({ ...filtro, oficio: null })
    }
    setHideList(true);
  };
  React.useEffect(() => {
    if (allJobs.length <= 0) {
      dispatch(getJobs());
    }
  }, [dispatch, allJobs]);

  return (
    <div className='filtros_main'>
      <div className='div-fil'>
        <span className='priority'>Prioridad: </span>
        <select className='select-fil' onChange={(event) => setFiltro({ ...filtro, Prioridad: event.target.value })}>
          <option className='options' value=''>Todos</option>
          <option className='options' value='Urgente'>Urgente</option>
          <option className='options' value='Poco Urgente'>Poco Urgente</option>
          <option className='options' value='Sin Urgencia'>Sin Urgencia</option>
        </select>
      </div>
      <div className='div-oficio'>
        <span className='priority'>Oficio: </span>
        <input
          type="text"
          name="job"
          className="form-control"
          placeholder="Example: Plumber"
          autoComplete="off"
          value={job}
          onChange={handleInputChange}
        />
        <ul className="jobs-list">
          {job !== "" && !hideList
            ? allJobs
              .filter((value) =>
                value.job_name
                  .toLowerCase()
                  .includes(job.toLowerCase())
              )
              .map((value) => (
                <li
                  key={value.job_id}
                  onClick={() => selectJob(value)}
                >
                  {value.job_name}
                </li>
              ))
            : ""}
        </ul>
      </div>
      <div className='div-dist'>
        <label className='distan'>
          <input className='checkbox' onChange={handleUnable} type="checkbox" />Distancia<span className={enable ? "distunabled" : "distdisabled"}>{filtro.maximo} km</span> 
        </label>
        <input className='rangedist' type='range' min='2' max='100' value={filtro.maximo} onChange={event => setFiltro({ ...filtro, maximo: event.target.value })} disabled={!enable} />
      </div>
    </div>
  )
}

function Filtrado(datos, filtros) {
  if (filtros.Prioridad) { datos = datos.filter((post) => { if (post.post_priority) return post.post_priority === filtros.Prioridad }) }
  if (filtros.oficio) { datos = datos.filter((post) => { if (post.jobs) return post.jobs.some(job => job.job_id == filtros.oficio) }) }
  return datos;
}