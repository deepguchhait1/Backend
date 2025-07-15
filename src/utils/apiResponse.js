class apiResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode
        this.data=datathis
        this.message=message
        this.success=statusCode < 400
    }
}