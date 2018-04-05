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
public class BarChartDataController {
    public static final String URL = "/barchart";
    public static final String twitterQuery = "SELECT SUM(Likes) as twitterLikes, Visualtype FROM twitter\n" +
            "WHERE brand = ? \n" +
            "GROUP BY Visualtype";

    public static final String instagramQuery = "SELECT SUM(Likes) as instagramLikes, Visualtype FROM instagram\n" +
            "WHERE brand = ? \n" +
            "GROUP BY Visualtype";



    @CrossOrigin(origins = "http://localhost")
    @RequestMapping(value = URL, method = RequestMethod.GET)
    public Map getData(@RequestParam(value="organization", defaultValue = "") String organization) {
        System.out.println("Processing request...");
        if (StringUtils.isBlank(organization)) return null;
        List<Map<String, Object>> queryResult;
        Map dataMap = new HashMap<String,String>();
        queryResult = DatabaseOperation.executeQuery(twitterQuery, QueryTypes.SELECT, new String[] { organization });

        for (Map<String, Object> entry : queryResult){
            if (entry.containsKey("twitterLikes") && entry.containsKey("Visualtype")){
                dataMap.put(entry.get("Visualtype").toString()+"Twitter",entry.get("twitterLikes").toString());
            }
        }

        queryResult = DatabaseOperation.executeQuery(instagramQuery, QueryTypes.SELECT, new String[] { organization });



        for (Map<String, Object> entry : queryResult){
            if (entry.containsKey("instagramLikes") && entry.containsKey("Visualtype")){
                dataMap.put(entry.get("Visualtype").toString()+"Instagram",entry.get("instagramLikes").toString());
            }
        }

        System.out.println("Request processed.");
        return dataMap;
    }

}
