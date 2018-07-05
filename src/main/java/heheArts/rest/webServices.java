package heheArts.rest;

import heheArts.dao.MemberDao;
import heheArts.dao.NotificationDao;
import heheArts.model.FileUploadEntity;
import heheArts.model.Member;
import heheArts.model.Notification;
import heheArts.model.ResponseObject;
import heheArts.utils.CommonUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.StandardMultipartHttpServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.FormParam;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/websiteService")
public class webServices {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value("${file.MappingPath}")
    private String fileMappingPath;

    @Value("${file.MappingUrl}")
    private String fileMappingUrl;

    @Value("${image.MappingPath}")
    private String imageMappingPath;

    @Value("${image.MappingUrl}")
    private String imageMappingUrl;

    @Value("${audio.MappingPath}")
    private String audioMappingPath;

    @Value("${audio.MappingUrl}")
    private String audioMappingUrl;

    @Value("${video.MappingPath}")
    private String videoMappingPath;

    @Value("${video.MappingUrl}")
    private String videoMappingUrl;

    @Autowired
    private NotificationDao notificationDaoImp;

    @Autowired
    private MemberDao memberDaoImp;

    //region file upload
    @PostMapping("/fileUpload/{requestFileName}/{requestFileType}")
    public ResponseObject uploadAvatar(@PathVariable String requestFileName, @PathVariable String requestFileType,
                                       HttpServletRequest request, HttpServletResponse response) {
        StandardMultipartHttpServletRequest fileRequest = (StandardMultipartHttpServletRequest) request;
        if (fileRequest == null) {
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }

        MultipartFile sourceFile = fileRequest.getFile(requestFileName);
        String savePath = imageMappingPath;
        String saveUrl = request.getContextPath() + imageMappingUrl;
        switch (requestFileType) {
            case "file":
                savePath = fileMappingPath;
                saveUrl = request.getContextPath() + fileMappingUrl;
                break;
            case "image":
                savePath = imageMappingPath;
                saveUrl = request.getContextPath() + imageMappingUrl;
                break;
            case "audio":
                savePath = audioMappingPath;
                saveUrl = request.getContextPath() + audioMappingUrl;
                break;
            case "video":
                savePath = videoMappingPath;
                saveUrl = request.getContextPath() + videoMappingUrl;
                break;
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String originalFileName = sourceFile.getOriginalFilename();
        String randomString = String.format("%s-%s", sdf.format(new Date()), originalFileName);
        String randomFileName = savePath + randomString;
        String randomFileUrl = saveUrl + randomString;
        File targetFile = new File(randomFileName);
        try (OutputStream f = new FileOutputStream(targetFile)) {
            f.write(sourceFile.getBytes());
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }

        FileUploadEntity fue = new FileUploadEntity();
        fue.setFileName(originalFileName);
        fue.setFileUrl(randomFileUrl);
        fue.setFileType(requestFileType);

        return new ResponseObject("ok", "上传成功", fue);
    }
    //endregion

    //region Notification
    @RequestMapping(value = "/loadNotificationList", method = RequestMethod.GET)
    public ResponseObject loadNotificationList(@RequestParam(value = "title", required = false, defaultValue = "") String title,
                                               @RequestParam("pageNumber") int pageNumber,
                                               @RequestParam("pageSize") int pageSize) {

        try {
            List<Notification> items = notificationDaoImp.getNotificationBriefs(title, pageNumber, pageSize);
            return new ResponseObject("ok", "查询成功", items);
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }
    }

    @RequestMapping(value = "/loadNotificationTotalCount", method = RequestMethod.GET)
    public ResponseObject loadNotificationTotalCount(@RequestParam(value = "title", defaultValue = "", required = false) String title) {

        try {
            int totalCount = notificationDaoImp.getNotificationTotalCount(title);
            return new ResponseObject("ok", "查询成功", totalCount);
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }
    }

    @RequestMapping(value = "/loadNotificationById", method = RequestMethod.GET)
    public ResponseObject loadNotificationById(@RequestParam("id") String id) {

        try {
            Notification items = notificationDaoImp.getNotificationById(id);
            return new ResponseObject("ok", "查询成功", items);
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }
    }

    @RequestMapping(value = "/addNotify", method = RequestMethod.POST)
    public ResponseObject addNotify(@FormParam("title") String title, @FormParam("content") String content) {

        Notification item = new Notification();
        item.setId(UUID.randomUUID().toString());
        item.setTitle(title);
        item.setContent(content);
        item.setDate(CommonUtils.getCurrentDate());

        try {
            notificationDaoImp.addNotification(item);
            return new ResponseObject("ok", "新增成功", item);
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }
    }

    @RequestMapping(value = "/updateNotify", method = RequestMethod.POST)
    public ResponseObject updateNotify(@FormParam("id") String id, @FormParam("title") String title,
                                       @FormParam("content") String content, @FormParam("date") String date) {

        Notification item = new Notification();
        item.setId(id);
        item.setTitle(title);
        item.setContent(content);
        item.setDate(date);

        try {
            notificationDaoImp.updateNotification(item);
            item.setContent("");
            return new ResponseObject("ok", "修改成功", item);
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }
    }

    @RequestMapping(value = "/deleteNotify", method = RequestMethod.GET)
    public ResponseObject deleteNotify(@RequestParam("id") String id, @RequestParam("usid") String usid) {

        try {
            Notification item = notificationDaoImp.getNotificationById(id);
            notificationDaoImp.deleteNotification(id);
            return new ResponseObject("ok", "删除成功", id);
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }
    }
    //endregion

    //region member
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ResponseObject login(@RequestParam(value = "tel") String sid,
                                @RequestParam(value = "password") String password) {

        try {
            Member item = memberDaoImp.login(sid, password);
            if (org.apache.commons.lang3.StringUtils.isNotEmpty(item.getId())) {
                return new ResponseObject("ok", "登录成功", item);
            }
            else
                return new ResponseObject("error", "用户不存在或密码错误!", "");
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }
    }

    @RequestMapping(value = "/getMembers", method = RequestMethod.GET)
    public ResponseObject getMembers(@RequestParam(value = "name", defaultValue = "", required = false) String name,
                                    @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
                                    @RequestParam(value = "pageSize", defaultValue = "0", required = false) int pageSize) {

        try {
            List<Member> items = memberDaoImp.getMembers(name, pageNumber, pageSize);
            return new ResponseObject("ok", "查询成功", items);
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }
    }

    @RequestMapping(value = "/deleteMember", method = RequestMethod.GET)
    public ResponseObject deleteMember(@RequestParam("id") String id) {

        try {
            memberDaoImp.deleteMember(id);
            return new ResponseObject("ok", "删除成功", id);
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }
    }

    @RequestMapping(value = "/addMember", method = RequestMethod.POST)
    public ResponseObject addMember(@FormParam("name") String name, @FormParam("password") String password,
                                    @FormParam("company") String company, @FormParam("tel") String tel,
                                    @FormParam("course") String course,
                                    @FormParam("courseHour") String courseHour, @FormParam("courseFee") String courseFee) {

        Member item = new Member();
        String id = UUID.randomUUID().toString();
        item.setId(id);
        item.setName(name);
        item.setPassword(password);
        item.setTel(tel);
        item.setCourse(course);
        item.setCourseHour(courseHour);
        item.setCourseFee(courseFee);

        try {
            memberDaoImp.addMember(item);
            return new ResponseObject("ok", "新增成功", item);
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }
    }

    @RequestMapping(value = "/updateMember", method = RequestMethod.POST)
    public ResponseObject updateMember(@FormParam("id") String id,
                                       @FormParam("name") String name, @FormParam("password") String password,
                                       @FormParam("company") String company, @FormParam("tel") String tel,
                                       @FormParam("course") String course,
                                       @FormParam("courseHour") String courseHour, @FormParam("courseFee") String courseFee) {


        Member item = new Member();
        item.setId(id);
        item.setName(name);
        item.setPassword(password);
        item.setTel(tel);
        item.setCourse(course);
        item.setCourseHour(courseHour);
        item.setCourseFee(courseFee);

        try {
            memberDaoImp.updateMember(item);
            return new ResponseObject("ok", "修改成功", item);
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }
    }

    @RequestMapping(value = "/getMemberTotalCount", method = RequestMethod.GET)
    public ResponseObject getMemberTotalCount(@RequestParam("name") String name) {

        try {
            int count = memberDaoImp.getMemberTotalCount(name);
            return new ResponseObject("ok", "查询成功", count);
        } catch (SQLException e) {
            logger.error(e.getMessage(), e);
            return new ResponseObject("error", "系统错误，请联系系统管理员");
        }
    }
    //endregion
}
