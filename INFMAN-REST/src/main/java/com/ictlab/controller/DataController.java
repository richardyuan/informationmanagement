package com.ictlab.controller;

import com.ictlab.database.DatabaseOperation;
import com.ictlab.database.QueryTypes;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class DataController {
    public static final String EMPTY_STRING = "";
    public static final String URL = "/data";
    public static final String STARTDATE = "startDate";
    public static final String ENDDATE = "endDate";
    public static final String AVGLIKES = "avgLikes";
    public static final String AVGCOMMENTS = "avgComments";
    public static final String AVGLIKESBYDATE = "dateAvgLikes";
    public static final String AVGCOMMENTSBYDATE = "dateAvgComments";
    public static final String DATUM = "Datum";

    public static final String allAverageQuery = "SELECT ROUND(AVG(Likes)) as avgLikes, ROUND(AVG(Comments)) as avgComments \n" +
            "FROM infman.instagram";
    public static final String allAverageByDateQuery = "SELECT ROUND(AVG(Likes)) as avgLikes, ROUND(AVG(Comments)) as avgComments \n" +
            "FROM infman.instagram\n" +
            "WHERE (Datum BETWEEN ? AND ?)";

    public static final String maxLikesQuery = "SELECT MAX(Likes) as maxLikes, Datum FROM infman.instagram";
    public static final String maxCommentsQuery = "SELECT MAX(Comments) as maxComments, Datum FROM infman.instagram";
    public static final String maxLikesByDateQuery = "SELECT MAX(Likes) as dateMaxLikes, Datum FROM infman.instagram\n" +
            "WHERE (Datum BETWEEN ? AND ?)";
    public static final String maxCommentsByDateQuery = "SELECT MAX(Comments) as dateMaxComments, Datum FROM infman.instagram\n" +
            "WHERE (Datum BETWEEN ? AND ?)";

    @CrossOrigin(origins = "http://localhost")
    @RequestMapping(value = URL, method = RequestMethod.GET)
    public Map getData(@RequestParam(value=STARTDATE, defaultValue = EMPTY_STRING) String startDate, @RequestParam(value=ENDDATE, defaultValue = EMPTY_STRING) String endDate) {
        System.out.println("Processing request...");
        List<Map<String, Object>> queryResult;
        if (StringUtils.isBlank(startDate) && StringUtils.isBlank(endDate)){
            return null;
        }
        Map dataMap = new HashMap<String,String>();
        queryResult = DatabaseOperation.executeQuery(allAverageQuery, QueryTypes.SELECT);
        for(Map<String, Object> row : queryResult){
            if (row.containsKey(AVGCOMMENTS) && row.containsKey(AVGLIKES)){
                dataMap.put(AVGLIKES,row.get(AVGLIKES).toString());
                dataMap.put(AVGCOMMENTS,row.get(AVGCOMMENTS).toString());
            }
        }

        queryResult = DatabaseOperation.executeQuery(allAverageByDateQuery, QueryTypes.SELECT, new String[] { startDate, endDate });
        for(Map<String, Object> row : queryResult){
            if (row.containsKey(AVGCOMMENTS) && ObjectUtils.allNotNull(row.get(AVGCOMMENTS)) &&
                    row.containsKey(AVGLIKES) && ObjectUtils.allNotNull(row.get(AVGLIKES))){
                dataMap.put(AVGLIKESBYDATE,row.get(AVGLIKES).toString());
                dataMap.put(AVGCOMMENTSBYDATE,row.get(AVGCOMMENTS).toString());
            }
        }

        queryResult = DatabaseOperation.executeQuery(maxLikesQuery, QueryTypes.SELECT);
        for(Map<String, Object> row : queryResult){
            if (row.containsKey("maxLikes") && row.containsKey(DATUM)){
                dataMap.put("maxLikes",row.get("maxLikes").toString());
                dataMap.put("maxLikesDate",row.get(DATUM).toString());
            }
        }

        queryResult = DatabaseOperation.executeQuery(maxLikesByDateQuery, QueryTypes.SELECT, new String[] { startDate, endDate });
        for(Map<String, Object> row : queryResult){
            if (row.containsKey("dateMaxLikes") && ObjectUtils.allNotNull(row.get("dateMaxLikes"))
                    && row.containsKey(DATUM) && ObjectUtils.allNotNull(row.get(DATUM))){
                dataMap.put("dateMaxLikes",row.get("dateMaxLikes").toString());
                dataMap.put("dateMaxLikesDate",row.get(DATUM).toString());
            }
        }

        queryResult = DatabaseOperation.executeQuery(maxCommentsQuery, QueryTypes.SELECT);
        for(Map<String, Object> row : queryResult){
            if (row.containsKey("maxComments") && row.containsKey(DATUM)){
                dataMap.put("maxComments",row.get("maxComments").toString());
                dataMap.put("maxCommentsDate",row.get(DATUM).toString());
            }
        }

        queryResult = DatabaseOperation.executeQuery(maxCommentsByDateQuery, QueryTypes.SELECT, new String[] { startDate, endDate });
        for(Map<String, Object> row : queryResult){
            if (row.containsKey("dateMaxComments") && ObjectUtils.allNotNull(row.get("DateMaxComments"))
                    && row.containsKey(DATUM) && ObjectUtils.allNotNull(row.get(DATUM))){
                dataMap.put("dateMaxComments",row.get("dateMaxComments").toString());
                dataMap.put("dateMaxCommentsDate",row.get(DATUM).toString());
            }
        }
        System.out.println("Request processed.");
        return dataMap;
    }

}
