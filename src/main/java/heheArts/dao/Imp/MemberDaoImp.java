package heheArts.dao.Imp;

import heheArts.dao.MemberDao;
import heheArts.model.CourseUsage;
import heheArts.model.Member;

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
public class MemberDaoImp extends BaseDao implements MemberDao {
    @Override
    public List<Member> getMembers(String name, int pageNumber, int pageSize) throws SQLException {
        List<Member> items = new ArrayList<Member>();

        String whereSql = "where 1=1 ";
        String limitSql = "";
        if (StringUtils.isNotEmpty(name))
            whereSql += " and a.Name like '%" + name + "%'";
        if (pageNumber != 0 && pageSize != 0)
            limitSql = String.format(" limit %s,%s", (pageNumber - 1) * pageSize, pageSize);

        String selectSql = String.format("SELECT Id, Name, Tel, Password, Course, CourseHour, CourseFee FROM Member %s %s", whereSql, limitSql);

        try (Connection connection = DriverManager.getConnection(dbConnectString)) {
            try (Statement stmt = connection.createStatement()) {
                try (ResultSet rs = stmt.executeQuery(selectSql)) {
                    while (rs.next()) {
                        Member item = new Member();
                        int i = 1;
                        item.setId(rs.getString(i++));
                        item.setName(rs.getString(i++));
                        item.setTel(rs.getString(i++));
                        item.setPassword(rs.getString(i++));
                        item.setCourse(rs.getString(i++));
                        item.setCourseHour(rs.getString(i++));
                        item.setCourseFee(rs.getString(i++));
                        items.add(item);
                    }
                }
            }
        }

        return items;
    }

    @Override
    public Member getMemberById(String id) throws SQLException {
        Member item = new Member();

        String selectSql = String.format("SELECT Id, Name, Tel, Password, Course, CourseHour, CourseFee FROM Member where Id = '%s' ", id);

        try (Connection connection = DriverManager.getConnection(dbConnectString)) {
            try (Statement stmt = connection.createStatement()) {
                try (ResultSet rs = stmt.executeQuery(selectSql)) {
                    if (rs.next()) {
                        int i = 1;
                        item.setId(rs.getString(i++));
                        item.setName(rs.getString(i++));
                        item.setTel(rs.getString(i++));
                        item.setPassword(rs.getString(i++));
                        item.setCourse(rs.getString(i++));
                        item.setCourseHour(rs.getString(i++));
                        item.setCourseFee(rs.getString(i++));
                    }
                }
            }
        }

        return item;
    }

    @Override
    public void deleteMember(String id) throws SQLException {
        String deleteSql = String.format("delete from Member where id = '%s'", id);
        delete(deleteSql);
    }

    @Override
    public void addMember(Member item) throws SQLException {
        try (Connection connection = DriverManager.getConnection(dbConnectString)) {
            String insertSql = "insert into Member values(?,?,?,?,?,?,?);";
            try (PreparedStatement ps = connection.prepareStatement(insertSql)) {
                int i=1;
                ps.setString(i++, item.getId());
                ps.setString(i++, item.getName());
                ps.setString(i++, item.getTel());
                ps.setString(i++, item.getPassword());
                ps.setString(i++, item.getCourse());
                ps.setString(i++, item.getCourseHour());
                ps.setString(i++, item.getCourseFee());
                ps.executeUpdate();
            }
        }
    }

    @Override
    public void updateMember(Member item) throws SQLException {
        try (Connection connection = DriverManager.getConnection(dbConnectString)) {
            String insertSql = "update Member set Name=?, Password=?, Tel=?, Course=?, CourseHour=?, CourseFee=? where Id=?";
            try (PreparedStatement ps = connection.prepareStatement(insertSql)) {
                int i = 1;
                ps.setString(i++, item.getName());
                ps.setString(i++, item.getTel());
                ps.setString(i++, item.getPassword());
                ps.setString(i++, item.getCourse());
                ps.setString(i++, item.getCourseHour());
                ps.setString(i++, item.getCourseFee());
                ps.setString(i++, item.getId());
                ps.executeUpdate();
            }
        }
    }

    @Override
    public Member login(String tel, String password) throws SQLException {
        Member item = new Member();

        String selectSql = String.format("SELECT Id, Name, Tel, Password, Course, CourseHour, CourseFee FROM Member Tel = '%s' and Password= '%s' ", tel, password);

        try (Connection connection = DriverManager.getConnection(dbConnectString)) {
            try (Statement stmt = connection.createStatement()) {
                try (ResultSet rs = stmt.executeQuery(selectSql)) {
                    if (rs.next()) {
                        int i = 1;
                        item.setId(rs.getString(i++));
                        item.setName(rs.getString(i++));
                        item.setTel(rs.getString(i++));
                        item.setPassword(rs.getString(i++));
                        item.setCourse(rs.getString(i++));
                        item.setCourseHour(rs.getString(i++));
                        item.setCourseFee(rs.getString(i++));
                    }
                }
            }
        }

        return item;
    }

    @Override
    public void insertCourseUsage(CourseUsage item) throws SQLException {
        try (Connection connection = DriverManager.getConnection(dbConnectString)) {
            String insertSql = "insert into CourseUsage values(?,?,?,?,?);";
            try (PreparedStatement ps = connection.prepareStatement(insertSql)) {
                int i=1;
                ps.setString(i++, item.getId());
                ps.setString(i++, item.getUserId());
                ps.setString(i++, item.getType());
                ps.setString(i++, item.getDate());
                ps.setString(i++, item.getComment());
                ps.executeUpdate();
            }
        }
    }

    @Override
    public void deleteCourseUsage(String id) throws SQLException {
        String deleteSql = String.format("delete from CourseUsage where id = '%s'", id);
        delete(deleteSql);
    }

    @Override
    public List<CourseUsage> getCourseUsagesByUserId(String userId) throws SQLException {
        List<CourseUsage> items = new ArrayList<CourseUsage>();
        String selectSql = String.format("SELECT Id, UserId, Type, Date, Comment FROM CourseUsage where UserId = '%s' order by Date asc;", userId);
        try (Connection connection = DriverManager.getConnection(dbConnectString)) {
            try (Statement stmt = connection.createStatement()) {
                try (ResultSet rs = stmt.executeQuery(selectSql)) {
                    while (rs.next()) {
                        CourseUsage item = new CourseUsage();
                        int i = 1;
                        item.setId(rs.getString(i++));
                        item.setUserId(rs.getString(i++));
                        item.setType(rs.getString(i++));
                        item.setDate(rs.getString(i++));
                        item.setComment(rs.getString(i++));
                        items.add(item);
                    }
                }
            }
        }
        return items;
    }

    @Override
    public int getMemberTotalCount(String name) throws SQLException {
        String whereSql = "";
        if (StringUtils.isNotEmpty(name))
            whereSql += " where Name like '%" + name + "%'";

        String selectSql = String.format("select count(0) from Member %s", whereSql);
        try (Connection connection = DriverManager.getConnection(dbConnectString)) {
            try (Statement stmt = connection.createStatement()) {
                try (ResultSet rs = stmt.executeQuery(selectSql)) {
                    if (rs.next())
                        return rs.getInt(1);
                }
            }
        }

        return 0;
    }
}
