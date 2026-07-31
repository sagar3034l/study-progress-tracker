
export function getLogOfsubject(subject,logs = []) {
    if(!subject || logs.length === 0){
        return [];
    }
    let arr = []
    if(logs && logs.length > 0 ){
        logs.map((item)=>{
        if(item.subject.subject.toLowerCase() === subject.toLowerCase()){
            arr.push(item)
        }
    })
    }
    return arr.length > 0 ? arr : []
}

export function getProgressPercentage(schedule,subject){
    if(!subject){
        return;
    }
    let percentage;
    let targetHour
    let overallPercenatge;
    schedule.Plans.map((m)=>{
        if(m.subject.toLowerCase() === subject.toLowerCase()){
            percentage = m.progressTillNow;
            targetHour = m.targetHours
            overallPercenatge = (percentage/targetHour)*100;
        }  
    })
    return Math.round(overallPercenatge)
}