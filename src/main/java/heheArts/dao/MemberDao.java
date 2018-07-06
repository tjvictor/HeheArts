package heheArts.dao;

import heheArts.model.CourseUsage;
import heheArts.model.Member;
import heheArts.model.MemberExt;

import java.sql.SQLException;
import java.util.List;

public interface MemberDao {
    List<Member> getMembers(String name, int pageNumber, int pageSize) throws SQLException;

    Member getMemberById(String id) throws SQLException;

    void deleteMember(String id) throws SQLException;

    void addMember(Member item) throws SQLException;

    void updateMember(Member item) throws SQLException;

    boolean login(String tel, String password) throws SQLException;

    void insertCourseUsage(CourseUsage item) throws SQLException;

    void deleteCourseUsage(String id) throws SQLException;

    List<CourseUsage> getCourseUsagesByUserId(String userId) throws SQLException;

    int getMemberTotalCount(String name) throws SQLException;

    List<MemberExt> searchMemberExtInfoByTel(String tel) throws SQLException;
}
