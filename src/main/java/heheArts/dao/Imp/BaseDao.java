package heheArts.dao.Imp;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

@Component
public class BaseDao {

    @Value("${db.connectString}")
    protected String dbConnectString;

    public int insert(String insertSql) throws SQLException {
        return update(insertSql);
    }

    public int update(String updateSql) throws SQLException {
        try (Connection connection = DriverManager.getConnection(dbConnectString)){
            try(Statement stmt = connection.createStatement()) {
                return stmt.executeUpdate(updateSql);
            }
        }
    }

    public int delete(String deleteSql) throws SQLException {
        return update(deleteSql);
    }

    public String escapeString(String item){
        if(StringUtils.isEmpty(item))
            return "";
        return StringEscapeUtils.escapeHtml4(item);
    }
}
