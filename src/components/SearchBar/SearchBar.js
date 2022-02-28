import React, { useState, useEffect } from "react";
import styles from "./SearchBar.module.css";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// SearchBar Actions
import axios from "axios";
// urls
import { JOB_URL} from '../../enviroment';

export const SearchBar = () => {
  
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Hacemos peticion de los trabajos en el back
    axios.get(JOB_URL)
      .then(jobs => setJobs(jobs.data))

  }, []);

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = jobs.filter((value) => {
      return value.job_name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className={styles.search}>
      <div className={styles.searchInputs}>
        <input
          type="text"
          placeholder="Buscar..."
          value={wordEntered}
          onChange={handleFilter}
        />
        <div className={styles.searchIcon}>
          {filteredData.length === 0 ? (
            <SearchIcon style={{width: "100%", height: "100%"}} />
          ) : (
            <CloseIcon style={{width: "100%", height: "100%", cursor: "pointer"}} onClick={clearInput} />
          )}
        </div>
      </div>
      {filteredData.length !== 0 && (
        <div className={styles.dataResult}>
          {filteredData.slice(0, 10).map((value, key) => {
            return (
              <a key={value.job_id} href={`/job/${value.job_id}`} className={styles.dataItem} rel="noreferrer">
                <p>{value.job_name} </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};