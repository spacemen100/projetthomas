"use client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {SchedulerWrapper, SchedulerProjectData, ParsedDatesRange} from "@bitnoi.se/react-scheduler";
import {data} from "./mocked";
import { useCallback, useMemo, useState } from "react";
dayjs.extend(isBetween);

const WindowedScheduler = () =>{
    const [range, setRange]= useState<ParsedDatesRange>({
        startDate: new Date(),
        endDate: new Date(),
    })
    const filteredData = useMemo(
        ()=>
        data.map((person)=>({
            ...person,
            data: person.data.filter(
                (project)=>
                dayjs(project.startDate).isBetween(
                    range.startDate,
                    range.endDate
                )||
                dayjs(project.endDate).isBetween(range.startDate, range.endDate)||
                (dayjs(project.startDate).isBefore(range.startDate, "day")&&
                dayjs(project.endDate).isAfter(range.endDate, "day"))
            ),
        })),
        [range.endDate, range.startDate]
    );

    const handleRangeChange = useCallback((range: ParsedDatesRange)=>{
        setRange(range);
    }, []);
    
    const handleTitleClick= (data: SchedulerProjectData)=>
    alert(`Item ${data.title}-${data.subtitle}was clicked` )
    return(
        <SchedulerWrapper 
        data={filteredData} 
        isLoading={false} 
        onRangeChange={handleRangeChange} 
        onTitleClick={handleTitleClick}
        />
    )
}


