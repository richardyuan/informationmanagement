package com.ictlab.controller;

import com.ictlab.database.DatabaseOperation;
import com.ictlab.database.QueryTypes;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class TimelineController {
    public static final String URL = "/timeline";
    public static final String twitterQuery = "SELECT SUM(Likes) as twitterLikes, SUM(Comments) as twitterComments, Datum\n" +
            "FROM twitter\n" +
            "WHERE MONTH(Datum) = ? \n" +
            "GROUP BY Datum ASC";

    public static final String instagramQuery = "SELECT SUM(Likes) as instagramLikes, SUM(Comments) as instagramComments, Datum\n" +
            "FROM instagram\n" +
            "WHERE MONTH(Datum) = ? \n" +
            "GROUP BY Datum ASC";



    @CrossOrigin(origins = "http://localhost")
    @RequestMapping(value = URL, method = RequestMethod.GET)
    public Map getData(@RequestParam(value="month", defaultValue = "") String month) {
        System.out.println("Processing request...");
        if (StringUtils.isBlank(month)) return null;
        List<Map<String, Object>> queryResult;
        Map dataMap = new HashMap<String,String>();
        Map<String, String> twitterComments = new HashMap<String, String>();
        Map<String, String> twitterLikes = new HashMap<String, String>();
        Map<String, String> instagramComments = new HashMap<String, String>();
        Map<String, String> instagramLikes = new HashMap<String, String>();
        List<Map<String, String>> commentsList = new ArrayList<Map<String,String>>();
        List<Map<String, String>> likesList = new ArrayList<Map<String,String>>();
        queryResult = DatabaseOperation.executeQuery(twitterQuery, QueryTypes.SELECT, new String[] { month });
        for (Map<String, Object> entry : queryResult){
            if (entry.containsKey("twitterComments") && entry.containsKey("Datum") && entry.containsKey("twitterLikes")){
                HashMap<String, String> commentsMap = new HashMap<String, String>();
                commentsMap.put(entry.get("Datum").toString(),entry.get("twitterComments").toString());
                commentsList.add(commentsMap);
                HashMap<String, String> likesMap = new HashMap<String, String>();
                likesMap.put(entry.get("Datum").toString(), entry.get("twitterLikes").toString());
                likesList.add(likesMap);
            }
        }
        dataMap.put("twitterComments",commentsList);
        dataMap.put("twitterLikes",likesList);
        commentsList = new ArrayList<Map<String,String>>();
        likesList = new ArrayList<Map<String,String>>();
        queryResult = DatabaseOperation.executeQuery(instagramQuery, QueryTypes.SELECT, new String[] { month });
        for (Map<String, Object> entry : queryResult){
            if (entry.containsKey("instagramComments") && entry.containsKey("Datum") && entry.containsKey("instagramLikes")){
                HashMap<String, String> commentsMap = new HashMap<String, String>();
                commentsMap.put(entry.get("Datum").toString(),entry.get("instagramComments").toString());
                commentsList.add(commentsMap);
                HashMap<String, String> likesMap = new HashMap<String, String>();
                likesMap.put(entry.get("Datum").toString(), entry.get("instagramLikes").toString());
                likesList.add(likesMap);

            }
        }
        dataMap.put("instagramComments",commentsList);
        dataMap.put("instagramLikes",likesList);
        System.out.println("Request processed.");
        return dataMap;
    }

}
