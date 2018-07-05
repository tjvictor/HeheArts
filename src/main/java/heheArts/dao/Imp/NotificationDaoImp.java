package heheArts.dao.Imp;

import heheArts.dao.NotificationDao;
import heheArts.model.Notification;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Component
public class NotificationDaoImp extends BaseDao implements NotificationDao {
    @Override
    public List<Notification> getNotificationBriefs(String title, int pageNumber, int pageSize) throws SQLException {
        List<Notification> notifications = new ArrayList<Notification>();
        String whereSql = "";
        String limitSql = "";
        if(StringUtils.isNotEmpty(title))
            whereSql=" where Title like '%"+title+"%'";
        if(pageNumber != 0 && pageSize != 0)
            limitSql = String.format(" limit %s,%s", (pageNumber-1)*pageSize, pageSize);

        String selectSql = String.format("SELECT Id, Title, Date FROM Notification %s order by Date desc %s",whereSql, limitSql);

        try (Connection connection = DriverManager.getConnection(dbConnectString)) {
            try (Statement stmt = connection.createStatement()) {
                try(ResultSet rs = stmt.executeQuery(selectSql)) {
                    while(rs.next()){
                        Notification item = new Notification();
                        item.setId(rs.getString(1));
                        item.setTitle(rs.getString(2));
                        item.setDate(rs.getString(3));
                        notifications.add(item);
                    }
                }
            }
        }

        return notifications;
    }

    @Override
    public int getNotificationTotalCount(String title) throws SQLException {
        String whereSql = "";
        if(org.apache.commons.lang3.StringUtils.isNotEmpty(title))
            whereSql=" where Title like '%"+title+"%'";

        String selectSql = String.format("select count(0) from Notification %s", whereSql);

        try (Connection connection = DriverManager.getConnection(dbConnectString)) {
            try (Statement stmt = connection.createStatement()) {
                try(ResultSet rs = stmt.executeQuery(selectSql)) {
                    if(rs.next())
                        return rs.getInt(1);
                }
            }
        }

        return 0;
    }

    @Override
    public Notification getNotificationById(String id) throws SQLException {
        Notification item = new Notification();

        String selectSql = String.format("SELECT Id, Title, Content, Date FROM Notification where id = '%s'", id);
        try (Connection connection = DriverManager.getConnection(dbConnectString)) {
            try (Statement stmt = connection.createStatement()) {
                try (ResultSet rs = stmt.executeQuery(selectSql)) {
                    if(rs.next()) {
                        item.setId(rs.getString(1));
                        item.setTitle(rs.getString(2));
                        item.setContent(rs.getString(3));
                        item.setDate(rs.getString(4));
                    }
                }
            }
        }

        return item;
    }

    @Override
    public void addNotification(Notification item) throws SQLException {
        try (Connection connection = DriverManager.getConnection(dbConnectString)){
            String insertSql = "insert into Notification values(?,?,?,?);";
            try(PreparedStatement ps = connection.prepareStatement(insertSql)) {
                ps.setString(1, item.getId());
                ps.setString(2, item.getTitle());
                ps.setString(3, item.getContent());
                ps.setString(4,item.getDate());
                ps.executeUpdate();
            }
        }
    }

    @Override
    public void updateNotification(Notification item) throws SQLException {
        try (Connection connection = DriverManager.getConnection(dbConnectString)){
            String insertSql = "update Notification set Title=?, Content=? where Id=?";
            try(PreparedStatement ps = connection.prepareStatement(insertSql)) {
                ps.setString(1, item.getTitle());
                ps.setString(2, item.getContent());
                ps.setString(3, item.getId());
                ps.executeUpdate();
            }
        }
    }

    @Override
    public void deleteNotification(String id) throws SQLException {
        String deleteSql = String.format("delete from Notification where id = '%s'", id);
        delete(deleteSql);
    }
}