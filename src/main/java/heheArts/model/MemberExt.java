package heheArts.model;

import java.util.ArrayList;
import java.util.List;

public class MemberExt extends Member {
    private List<CourseUsage> courseUsedList;
    private List<CourseUsage> courseAbsentList;
    private int courseUsed;
    private int courseRemain;

    public MemberExt(){
        courseUsedList = new ArrayList<CourseUsage>();
        courseAbsentList = new ArrayList<CourseUsage>();
        courseUsed = 0;
        courseRemain = 0;
    }

    public List<CourseUsage> getCourseUsedList() {
        return courseUsedList;
    }

    public void setCourseUsedList(List<CourseUsage> courseUsedList) {
        this.courseUsedList = courseUsedList;
    }

    public List<CourseUsage> getCourseAbsentList() {
        return courseAbsentList;
    }

    public void setCourseAbsentList(List<CourseUsage> courseAbsentList) {
        this.courseAbsentList = courseAbsentList;
    }

    public int getCourseUsed() {
        return courseUsed;
    }

    public void setCourseUsed(int courseUsed) {
        this.courseUsed = courseUsed;
    }

    public int getCourseRemain() {
        return courseRemain;
    }

    public void setCourseRemain(int courseRemain) {
        this.courseRemain = courseRemain;
    }
}
