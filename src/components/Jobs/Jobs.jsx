import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobs } from "../../actions/formJobs";
import JobCard from "../JobCard/JobCard";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import SearchBar2 from "../SearchBar/SearchBar2";
import { cardClasses } from "@mui/material";
import { Box } from "@mui/system";

const useStyles = makeStyles((theme) => ({
    jobsLayout: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        marginTop: "2rem",
        [theme.breakpoints.down("sm")]: {
            marginTop: "1rem",
        },
    },
    jobsContainer: {
        width: "80vw",
    },
    search: {

    },
}));

export default function Jobs() {
    const classes = useStyles();
    const [searchWord, setSearchWord] = useState("");
    const dispatch = useDispatch();
    const [jobs, setJobs] = useState([]);
    const allJobs = useSelector((state) => state.jobs.allJobs)

    useEffect(() => {
        const getJobsData = async () => {
            try {
                await dispatch(getJobs());
            } catch (error) {
                console.log(error);
            }
        };
        getJobsData();
    }, [dispatch]);

    useEffect(() => {
        setJobs(allJobs);
    }, [allJobs]);



    const handleJobsChange = (e) => {
        const { value } = e.target;;
        setSearchWord(value);
        let filteredJobs = [];
        if (value !== "") {
            filteredJobs = allJobs.filter(job => job.job_name.toLowerCase().includes(value.toLowerCase()));
            setJobs(filteredJobs);
        } else {
            setJobs(allJobs);
        }
    };

    const handleClear = (e) => {
        setSearchWord("");
        setJobs(allJobs);
    };

    return (
        <div className={classes.jobsLayout}>
            <Box sx={{ width: { sm: "20rem", xs: "80vw" }, display: "inline" }}>
                <SearchBar2 handleChange={handleJobsChange} value={searchWord} handleClear={handleClear} />
            </Box>
            <div className={classes.jobsContainer}>
                {
                    jobs?.map((job) => {
                        return (
                            <JobCard
                                key={job.job_id}
                                id={job.job_id}
                                name={job.job_name}
                                description={job.job_description}
                                photo={job.job_photo}
                            />
                        );
                    })
                }
            </div>
        </div>
    );
};