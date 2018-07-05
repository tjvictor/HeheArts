package heheArts.model;

public class ResponseObject {

    private String status;
    private String prompt;
    private Object callBackData;

    public ResponseObject(String status, String prompt){
        this.status = status;
        this.prompt = prompt;
        this.callBackData = "";
    }

    public ResponseObject(String status, String prompt, Object callBackData){
        this.status = status;
        this.prompt = prompt;
        this.callBackData = callBackData;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public Object getCallBackData() {
        return callBackData;
    }

    public void setCallBackData(Object callBackData) {
        this.callBackData = callBackData;
    }
}

