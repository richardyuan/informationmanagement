package com.ictlab.controller;

import com.ictlab.database.DatabaseOperation;
import com.ictlab.database.QueryTypes;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class OrganizationsController {
    public static final String URL = "/organizations";
    public static final String organizationsQuery = "SELECT DISTINCT brand FROM twitter";


    @CrossOrigin(origins = "http://localhost")
    @RequestMapping(value = URL, method = RequestMethod.GET)
    public Map getData() {
        System.out.println("Processing request...");
        List<Map<String, Object>> queryResult;
        Map dataMap = new HashMap<String,String>();
        queryResult = DatabaseOperation.executeQuery(organizationsQuery, QueryTypes.SELECT);

        List<String> organizationsList = new ArrayList<String>();

        for (Map<String, Object> entry : queryResult){
            if (entry.containsKey("Brand")){
                organizationsList.add(entry.get("Brand").toString());
            }
        }
        dataMap.put("organizations",organizationsList);
        System.out.println("Request processed.");
        return dataMap;
    }

}
