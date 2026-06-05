const response = ({ success, msg, statusCode }: {
    success: boolean, msg: string, statusCode: number
}) => {
    return Response.json({
        success: success,
        message: msg
    }, { status: statusCode });
};

export default response;