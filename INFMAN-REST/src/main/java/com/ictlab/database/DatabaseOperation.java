package com.ictlab.database;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;
import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;


public class DatabaseOperation {

    protected static final String SERVER_NAME = "127.0.0.1";
    protected static final int PORT = 13306;

    protected static final String USERNAME = "infman";
    protected static final String PASSWORD = "infman123";
    protected static final String ID = "id";

    public static List<Map<String, Object>> executeQuery(String query, String type){
        return executeQuery(query, type, null);
    }

    public static List<Map<String, Object>> executeQuery(String query, String type, String[] params){


        String user = "ubuntu-0915598";
        String password = "F492dx";
        String host = "145.24.222.157";
        int port = 22;

        Connection connection;
        Session session;
        try {

            JSch jsch = new JSch();
            session = jsch.getSession(user, host, port);
            session.setPassword(password);
            session.setConfig("StrictHostKeyChecking", "no");
            session.connect();
            session.setPortForwardingL(PORT, SERVER_NAME, 3306);

            MysqlDataSource dataSource = new MysqlDataSource();
            dataSource.setUser(USERNAME);
            dataSource.setPassword(PASSWORD);
            dataSource.setServerName(SERVER_NAME);
            dataSource.setPortNumber(PORT);
            dataSource.setDatabaseName("infman");

            connection = dataSource.getConnection();
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }

        try {
            if (connection.equals(null)) {
                return null;
            }
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            if (ArrayUtils.isNotEmpty(params)){
                for (int i = 1; (i-1) < params.length; i++) {
                    preparedStatement.setString(i,params[i-1]);
                }
            }
            List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
            ResultSet resultSet = null;
            if (StringUtils.equals(type, QueryTypes.SELECT)){
                resultSet = preparedStatement.executeQuery();
            } else if (StringUtils.equals(type, QueryTypes.UPDATE)){
                Map result = new HashMap<String, Object>();
                result.put(ID, preparedStatement.executeUpdate());
                resultList.add(result);
            }

            Map<String, Object> row;

            if (resultSet != null){
                ResultSetMetaData metaData = resultSet.getMetaData();
                Integer columnCount = metaData.getColumnCount();
                while (resultSet.next()) {
                    row = new HashMap<String, Object>();
                    for (int i = 1; i <= columnCount; i++) {
                        row.put(metaData.getColumnName(i), resultSet.getObject(i));
                    }
                    resultList.add(row);
                }
            }

            return resultList;
        }catch(SQLException ex){
            ex.printStackTrace();
        }finally {
            if (connection != null) {
                try {
                    connection.close();
                    session.disconnect();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }
        return null;
    }
}
