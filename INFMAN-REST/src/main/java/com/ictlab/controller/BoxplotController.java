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
public class BoxplotController {

    public static final String URL = "/boxplotlikes";

    public static final String instagramLikesQueryImage = "SELECT Likes FROM instagram\n" +
            "WHERE Brand = ? \n" +
            "AND Visualtype = 'image' \n" +
            "ORDER BY Likes ASC";

    public static final String instagramLikesQueryVideo = "SELECT Likes FROM instagram\n" +
            "WHERE Brand = ? \n" +
            "AND Visualtype = 'video' \n" +
            "ORDER BY Likes ASC";

    public static final String instagramLikesQueryCarousel = "SELECT Likes FROM instagram\n" +
            "WHERE Brand = ? \n" +
            "AND Visualtype = 'carousel' \n" +
            "ORDER BY Likes ASC";

    public static final String instagramCommentsQueryImage = "SELECT Comments FROM instagram\n" +
            "WHERE Brand = ? \n" +
            "AND Visualtype = 'image' \n" +
            "ORDER BY Likes ASC";

    public static final String instagramCommentsQueryVideo = "SELECT Comments FROM instagram\n" +
            "WHERE Brand = ? \n" +
            "AND Visualtype = 'video' \n" +
            "ORDER BY Likes ASC";

    public static final String instagramCommentsQueryCarousel = "SELECT Comments FROM instagram\n" +
            "WHERE Brand = ? \n" +
            "AND Visualtype = 'carousel' \n" +
            "ORDER BY Likes ASC";

    @CrossOrigin(origins = "http://localhost")
    @RequestMapping(value = URL, method = RequestMethod.GET)
    public Map getData(@RequestParam(value="organization", defaultValue = "") String organization){
        System.out.println("Processing request...");
        if (StringUtils.isBlank(organization)) return null;
        List<Map<String, Object>> queryResult;
        Map dataMap = new HashMap<String,String>();
        queryResult = DatabaseOperation.executeQuery(instagramLikesQueryImage, QueryTypes.SELECT, new String[] { organization });

        ArrayList<Integer> list = new ArrayList<Integer>();
        for (Map<String, Object> entry : queryResult){
            if (entry.containsKey("Likes")){
                list.add(Integer.parseInt(entry.get("Likes").toString()));
            }
        }
        dataMap.put("ImageLikesListInstagram", list);

        list = new ArrayList<Integer>();
        queryResult = DatabaseOperation.executeQuery(instagramLikesQueryVideo, QueryTypes.SELECT, new String[] { organization });
        for (Map<String, Object> entry : queryResult){
            if (entry.containsKey("Likes")){
                list.add(Integer.parseInt(entry.get("Likes").toString()));
            }
        }
        dataMap.put("VideoLikesListInstagram", list);

        list = new ArrayList<Integer>();
        queryResult = DatabaseOperation.executeQuery(instagramLikesQueryCarousel, QueryTypes.SELECT, new String[] { organization });
        for (Map<String, Object> entry : queryResult){
            if (entry.containsKey("Likes")){
                list.add(Integer.parseInt(entry.get("Likes").toString()));
            }
        }
        dataMap.put("CarouselLikesListInstagram", list);

        list = new ArrayList<Integer>();
        queryResult = DatabaseOperation.executeQuery(instagramCommentsQueryImage, QueryTypes.SELECT, new String[] { organization });
        for (Map<String, Object> entry : queryResult){
            if (entry.containsKey("Comments")){
                list.add(Integer.parseInt(entry.get("Comments").toString()));
            }
        }
        dataMap.put("ImageCommentsListInstagram", list);

        list = new ArrayList<Integer>();
        queryResult = DatabaseOperation.executeQuery(instagramCommentsQueryVideo, QueryTypes.SELECT, new String[] { organization });
        for (Map<String, Object> entry : queryResult){
            if (entry.containsKey("Comments")){
                list.add(Integer.parseInt(entry.get("Comments").toString()));
            }
        }
        dataMap.put("VideoCommentsListInstagram", list);

        list = new ArrayList<Integer>();
        queryResult = DatabaseOperation.executeQuery(instagramCommentsQueryCarousel, QueryTypes.SELECT, new String[] { organization });
        for (Map<String, Object> entry : queryResult){
            if (entry.containsKey("Comments")){
                list.add(Integer.parseInt(entry.get("Comments").toString()));
            }
        }
        dataMap.put("CarouselCommentsListInstagram", list);

        System.out.println("Request processed.");
        return dataMap;
    }

}
