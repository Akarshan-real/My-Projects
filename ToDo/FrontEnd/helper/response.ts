const response = ({ success, msg, statusCode , data }: {
    success: boolean, msg: string, statusCode: number , data ?: any
}) => {
    return Response.json({
        success: success,
        message: msg,
        data : data,
    }, { status: statusCode });
};

export default response;
