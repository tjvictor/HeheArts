package heheArts.dao;

import heheArts.model.Notification;

import java.sql.SQLException;
import java.util.List;

public interface NotificationDao {
    List<Notification> getNotificationBriefs(String title, int pageNumber, int pageSize) throws SQLException;

    int getNotificationTotalCount(String title) throws SQLException;

    Notification getNotificationById(String id) throws SQLException;

    void addNotification(Notification item) throws SQLException;

    void updateNotification(Notification item) throws SQLException;

    void deleteNotification(String id) throws SQLException;
}

